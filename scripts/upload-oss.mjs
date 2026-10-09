/**
 * @file OSS 图片上传脚本
 * @description 将 public/images 下的静态图片批量同步到阿里云 OSS（对象存储），用于图片加速。
 *              支持增量跳过（按文件 MD5 与远端 ETag 比对）、并发上传、dry-run 预演。
 *              凭证与配置统一从 .env.local 读取，禁止在代码中硬编码密钥。
 * @author gouxinjie
 * @created 2026-10-09
 * @updated 2026-10-09
 * @usage pnpm uploadOss -- [--dry-run] [--force] [--prefix=images]
 */

import OSS from "ali-oss";
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/** 本地待上传的图片目录（相对项目根目录） */
const LOCAL_DIR = "public/images";

/** 默认的对象键前缀（与本地 /images/ 路径保持一致） */
const DEFAULT_PREFIX = "images";

/** 上传并发数，避免过多连接触发 OSS 限流 */
const CONCURRENCY = 6;

/** 图片类型映射表：扩展名 -> Content-Type */
const CONTENT_TYPE_MAP = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

/** 图片缓存策略：内容不可变，设置一年强缓存（更换图片时请重命名文件以刷新缓存） */
const CACHE_CONTROL = "public, max-age=31536000, immutable";

/**
 * 解析命令行参数
 * @returns 解析结果，包含 dryRun / force / prefix（未通过命令行指定 prefix 时为 undefined）
 */
const parseArgs = () => {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry-run");
  const force = argv.includes("--force");
  const prefixArg = argv.find((arg) => arg.startsWith("--prefix="));
  return {
    dryRun,
    force,
    prefix: prefixArg ? prefixArg.slice("--prefix=".length) : undefined,
  };
};

/**
 * 加载 .env.local 中的环境变量
 * @description 仅补齐 process.env 中不存在的键，不覆盖系统已注入的变量
 * @param filePath - 环境变量文件绝对路径
 * @returns 无返回值
 */
const loadEnvFile = async (filePath) => {
  let content = "";
  try {
    content = await readFile(filePath, "utf8");
  } catch {
    // 文件不存在时静默跳过，由后续必填校验给出明确提示
    return;
  }
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;
    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
    // 去除常见的包裹引号
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
};

/**
 * 递归收集目录下的全部文件
 * @param dir - 目录绝对路径
 * @returns 文件绝对路径数组
 */
const collectFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectFiles(fullPath);
      if (entry.isFile()) return [fullPath];
      return [];
    })
  );
  return files.flat();
};

/**
 * 计算文件 MD5（即 OSS 普通上传对象的 ETag 值）
 * @param filePath - 文件绝对路径
 * @returns 32 位小写 MD5 字符串
 */
const calcFileMd5 = async (filePath) => {
  const buffer = await readFile(filePath);
  return createHash("md5").update(buffer).digest("hex");
};

/**
 * 查询远端对象 ETag
 * @param client - OSS 客户端实例
 * @param key - 对象键
 * @returns 对象存在时返回去除引号的 ETag，不存在返回 null
 */
const getRemoteEtag = async (client, key) => {
  try {
    const result = await client.head(key);
    const etag = result?.res?.headers?.etag;
    return typeof etag === "string" ? etag.replace(/"/g, "") : "";
  } catch (error) {
    if (error?.status === 404 || error?.code === "NoSuchKey") return null;
    throw error;
  }
};

/**
 * 按固定并发数执行异步任务
 * @param items - 待处理任务数组
 * @param limit - 并发数
 * @param worker - 单个任务处理函数
 * @returns 无返回值
 */
const runWithConcurrency = async (items, limit, worker) => {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const currentIndex = cursor;
      cursor += 1;
      await worker(items[currentIndex], currentIndex);
    }
  });
  await Promise.all(runners);
};

/**
 * 脚本主流程
 * @returns 无返回值，失败时以退出码 1 结束
 */
const main = async () => {
  const { dryRun, force, prefix: prefixArg } = parseArgs();
  await loadEnvFile(path.resolve(process.cwd(), ".env.local"));

  // 前缀优先级：命令行 --prefix > 环境变量 OSS_PREFIX > 默认 images
  // 此处用 || 而非 ??：环境变量被置为空串时也需回退，
  // 否则会拼出 "/xxx.png" 这类带前导斜杠的对象键，与站内 /images 路径不匹配
  const rawPrefix = prefixArg || process.env.OSS_PREFIX || DEFAULT_PREFIX;
  // 归一化：去除首尾空白与斜杠；若归一化后为空（如配置为 "/"），回退默认前缀
  const prefix = rawPrefix.trim().replace(/^\/+|\/+$/g, "") || DEFAULT_PREFIX;

  const region = process.env.OSS_REGION;
  const bucket = process.env.OSS_BUCKET;
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
  const publicBaseUrl = (process.env.NEXT_PUBLIC_OSS_BASE_URL || "").replace(/\/+$/, "");

  // 必填配置校验：缺失时明确提示，避免出现难以定位的上传失败
  const missing = [
    ["OSS_REGION", region],
    ["OSS_BUCKET", bucket],
    ["OSS_ACCESS_KEY_ID", accessKeyId],
    ["OSS_ACCESS_KEY_SECRET", accessKeySecret],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    console.error(`[oss] 缺少必要环境变量：${missing.join("、")}`);
    console.error("[oss] 请先在 .env.local 中补充上述配置后重试（可参考 .env.example）");
    process.exitCode = 1;
    return;
  }

  const localDir = path.resolve(process.cwd(), LOCAL_DIR);
  const dirStat = await stat(localDir).catch(() => null);
  if (!dirStat?.isDirectory()) {
    console.error(`[oss] 本地目录不存在：${localDir}`);
    process.exitCode = 1;
    return;
  }

  const client = new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    secure: true,
  });

  console.log(`[oss] bucket=${bucket} region=${region} 本地目录=${LOCAL_DIR} 对象前缀=${prefix}/`);
  if (dryRun) console.log("[oss] 当前为 --dry-run 预演模式，不会真实上传");

  const allFiles = await collectFiles(localDir);
  // 非图片类型文件直接跳过，避免误传其它资源
  const imageFiles = allFiles.filter((file) => CONTENT_TYPE_MAP[path.extname(file).toLowerCase()]);
  // 显式提示被跳过的文件数，避免新增非图片资源后漏传而无感知
  const skippedByType = allFiles.length - imageFiles.length;
  if (skippedByType > 0) {
    console.log(
      `[oss] 另有 ${skippedByType} 个非图片文件已跳过（支持的类型：${Object.keys(CONTENT_TYPE_MAP).join("、")}）`
    );
  }

  let uploaded = 0;
  let skipped = 0;
  let uploadedBytes = 0;
  const failures = [];

  await runWithConcurrency(imageFiles, CONCURRENCY, async (filePath) => {
    // 对象键统一使用 POSIX 分隔符，保证跨平台一致
    const relativePath = path.relative(localDir, filePath).split(path.sep).join("/");
    const key = `${prefix}/${relativePath}`;
    const extension = path.extname(filePath).toLowerCase();
    const displayPath = `${LOCAL_DIR}/${relativePath}`;

    try {
      if (!force) {
        const md5 = await calcFileMd5(filePath);
        const remoteEtag = await getRemoteEtag(client, key);
        if (remoteEtag !== null && remoteEtag.toLowerCase() === md5) {
          skipped += 1;
          console.log(`[oss] 跳过（内容未变） ${key}`);
          return;
        }
      }

      const fileStat = await stat(filePath);
      if (dryRun) {
        uploaded += 1;
        uploadedBytes += fileStat.size;
        console.log(`[oss] 待上传 ${key} (${(fileStat.size / 1024).toFixed(0)}KB)`);
        return;
      }

      await client.put(key, filePath, {
        headers: {
          "Content-Type": CONTENT_TYPE_MAP[extension],
          "Cache-Control": CACHE_CONTROL,
        },
      });

      uploaded += 1;
      uploadedBytes += fileStat.size;
      console.log(`[oss] 上传成功 ${key} (${(fileStat.size / 1024).toFixed(0)}KB)`);
    } catch (error) {
      failures.push({ displayPath, message: error?.message || String(error) });
      console.error(`[oss] 上传失败 ${displayPath}：${error?.message || error}`);
    }
  });

  console.log("");
  console.log(
    `[oss] 完成：成功 ${uploaded} 个，跳过 ${skipped} 个，失败 ${failures.length} 个，共 ${(uploadedBytes / 1024 / 1024).toFixed(2)}MB`
  );
  if (publicBaseUrl) {
    console.log(`[oss] 访问地址示例：${publicBaseUrl}/${prefix}/avatar.png`);
  } else {
    console.log("[oss] 提示：配置 NEXT_PUBLIC_OSS_BASE_URL 后，项目会自动改为从 OSS 加载图片");
  }
  if (failures.length > 0) {
    console.error(`[oss] 存在 ${failures.length} 个文件上传失败，请检查网络与权限配置`);
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error("[oss] 执行异常：", error);
  process.exitCode = 1;
});
