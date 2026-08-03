/**
 * 生成前端版本标识文件
 * 在每次 build / start 前执行，将构建时间戳写入 public/version.json。
 * 前端定时拉取该文件，对比 buildTime 判断是否发生发版，进而提示用户刷新。
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const publicDir = path.resolve(process.cwd(), "public");
const target = path.join(publicDir, "version.json");

// 确保 public 目录存在（开发环境首次运行也可能缺失）
mkdirSync(publicDir, { recursive: true });

const version = {
  // 构建时间 ISO 字符串，便于排查
  version: new Date().toISOString(),
  // 构建时间戳（毫秒），作为版本对比核心字段
  buildTime: Date.now(),
};

writeFileSync(target, JSON.stringify(version, null, 2), "utf-8");
console.log(`[version] 已生成 ${target} -> ${version.version}`);
