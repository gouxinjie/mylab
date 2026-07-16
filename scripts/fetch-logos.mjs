/**
 * @file fetch-logos.mjs
 * @description 从 Google favicon 服务批量下载 AI 产品图标到 public/logos/（按域名命名）
 * @usage node scripts/fetch-logos.mjs
 * @note 需在可访问 www.google.com 的网络环境下运行（如开启代理）
 */
import { mkdirSync, existsSync, statSync, unlinkSync, readFileSync as readBytes } from "fs";
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "lib", "ai-products.ts");
const outDir = path.join(root, "public", "logos");
mkdirSync(outDir, { recursive: true });

// 从数据文件提取 name / url 配对
const data = readFileSync(dataPath, "utf8");
const names = [...data.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);
const urls = [...data.matchAll(/url:\s*"([^"]+)"/g)].map((m) => m[1]);
const items = names
  .map((name, i) => ({ name, url: urls[i] }))
  .filter((x) => x && x.url);

const seen = new Set();
let ok = 0;
let skip = 0;
let fail = 0;

for (const it of items) {
  let domain = "";
  try {
    domain = new URL(it.url).hostname;
  } catch {
    console.log(`✗ ${it.name}: 域名解析失败 (${it.url})`);
    fail++;
    continue;
  }
  if (seen.has(domain)) {
    skip++;
    continue;
  }
  seen.add(domain);

  const file = path.join(outDir, `${domain}.png`);
  const api = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const res = spawnSync("curl.exe", ["-s", "-L", "--max-time", "25", "-o", file, api], {
    windowsHide: true,
  });

  // 校验下载结果是否为真实图片（PNG / ICO / SVG）
  if (res.status !== 0 || !existsSync(file) || statSync(file).size < 50) {
    if (existsSync(file)) unlinkSync(file);
    console.log(`✗ ${it.name} (${domain}): 下载失败`);
    fail++;
    continue;
  }
  const head = readBytes(file).subarray(0, 4);
  const isImg =
    head[0] === 0x89 && head[1] === 0x50 || // PNG
    head[0] === 0x00 && head[1] === 0x00 || // ICO
    head.slice(0, 3).toString() === "GIF" ||
    head.slice(0, 4).toString() === "<svg";
  if (!isImg) {
    unlinkSync(file);
    console.log(`✗ ${it.name} (${domain}): 非图片内容`);
    fail++;
    continue;
  }
  ok++;
  console.log(`✓ ${it.name} -> ${domain}.png`);
}

console.log(`\n完成：成功 ${ok}，跳过重复 ${skip}，失败 ${fail}`);
