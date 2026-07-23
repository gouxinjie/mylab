/**
 * @file fetch-contributions.mjs
 * @description 构建期从公开贡献统计服务抓取 GitHub 贡献热力图数据，落地为本地兜底文件。
 * 生产环境（国内 ECS）运行时可能无法直连境外上游，故在构建阶段（CI Runner 网络通畅）
 * 预生成快照；运行时若上游不可达则回退到该文件，保证看板始终可渲染。
 * @usage node scripts/fetch-contributions.mjs
 * @note 非致命：抓取失败时保留既有快照文件，不阻断构建流程。
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "data");
const outFile = path.join(outDir, "github-contributions.json");

// 默认用户名与上游模板（与路由保持一致）
const USERNAME = "gouxinjie";
const UPSTREAM = `https://github-contributions-api.jogruber.de/v4/${USERNAME}`;
const TIMEOUT = 15000;

async function main() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(UPSTREAM, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`上游返回 ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (!data || !Array.isArray(data.contributions)) {
      throw new Error("上游响应结构异常");
    }
    mkdirSync(outDir, { recursive: true });
    writeFileSync(outFile, JSON.stringify(data), "utf8");
    console.log(`✓ 已生成贡献快照：${outFile}（共 ${data.contributions.length} 天）`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (existsSync(outFile)) {
      // 保留既有快照，仅告警，不阻断构建
      const prev = JSON.parse(readFileSync(outFile, "utf8"));
      console.warn(
        `⚠ 抓取贡献数据失败（${msg}），沿用既有快照（${prev.contributions?.length ?? 0} 天）`
      );
    } else {
      console.error(`✗ 抓取贡献数据失败且无既有快照（${msg}）`);
    }
  } finally {
    clearTimeout(timer);
  }
}

main();
