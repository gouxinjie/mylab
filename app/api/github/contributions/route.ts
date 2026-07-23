/**
 * @file route.ts
 * @description GitHub 贡献热力图代理接口（同源，规避浏览器跨域与网络限制）
 * @author gouxinjie
 * @created 2026-07-15
 */

import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";
import type { GithubContributionsData } from "@/types/api";

// 默认 GitHub 用户名（与看板保持一致）
const DEFAULT_USERNAME = "gouxinjie";
// 上游数据来源模板：公开贡献统计服务
const UPSTREAM_TEMPLATE = "https://github-contributions-api.jogruber.de/v4";
// 上游请求超时时间（毫秒），防止生产环境外网请求无限挂起
const UPSTREAM_TIMEOUT = 10000;
// 内存缓存有效期（毫秒）：缓存命中且未过期时直接返回，降低上游压力
const CACHE_TTL = 60 * 60 * 1000;
// 构建期预生成的兜底快照（国内 ECS 运行时往往无法直连境外上游）
const SNAPSHOT_FILE = path.join(process.cwd(), "public", "data", "github-contributions.json");

/**
 * 贡献数据内存缓存条目
 * @property data - 上游返回的贡献数据
 * @property savedAt - 成功写入缓存的时间戳
 */
interface CacheEntry {
  data: GithubContributionsData;
  savedAt: number;
}

// 模块级内存缓存：standalone 单实例下有效，可避免每次请求都打上游，
// 并在上游抖动时提供“过期兜底”返回，保证看板始终可渲染。
const cache = new Map<string, CacheEntry>();
// 兜底快照读取缓存（仅首次读盘），避免每次请求都访问文件系统
let snapshotCache: GithubContributionsData | null = null;
let snapshotTried = false;

/**
 * 读取构建期生成的兜底快照
 * @returns 快照数据；文件不存在或解析失败返回 null
 */
function readSnapshot(): GithubContributionsData | null {
  if (snapshotTried) return snapshotCache;
  snapshotTried = true;
  try {
    if (existsSync(SNAPSHOT_FILE)) {
      snapshotCache = JSON.parse(readFileSync(SNAPSHOT_FILE, "utf8")) as GithubContributionsData;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[GitHub Contributions] 读取兜底快照失败: ${message}`);
  }
  return snapshotCache;
}

/**
 * 获取 GitHub 贡献热力图（最近一年）
 * @remarks 由服务端代理请求上游，统一返回 ApiResponse 结构；浏览器仅请求同源 /api 路径。
 * 不使用 fetch 的 next 缓存（standalone 镜像未携带 .next/cache，会触发 500）。
 * 运行时优先取上游，失败则依次回退：内存缓存 → 构建期兜底快照文件。
 */
export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") || DEFAULT_USERNAME;
  const upstream = `${UPSTREAM_TEMPLATE}/${username}`;

  // 命中未过期内存缓存则直接返回，避免重复请求上游
  const cached = cache.get(username);
  if (cached && Date.now() - cached.savedAt < CACHE_TTL) {
    return NextResponse.json({
      success: true,
      code: 200,
      message: "操作成功",
      data: cached.data,
    });
  }

  try {
    // 添加 AbortController 超时控制，防止生产环境外网请求无限挂起
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT);

    const res = await fetch(upstream, {
      headers: { Accept: "application/json" },
      // 显式不缓存：交由本路由自管理内存缓存，规避 standalone 下 .next/cache 缺失问题
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(
        `[GitHub Contributions] 上游返回非 2xx: ${res.status} ${res.statusText}, username=${username}, upstream=${upstream}`
      );
      return fallback(username, cached);
    }

    const data = (await res.json()) as GithubContributionsData;
    // 写入内存缓存（含过期兜底），下次请求优先复用
    cache.set(username, { data, savedAt: Date.now() });
    return NextResponse.json({
      success: true,
      code: 200,
      message: "操作成功",
      data,
    });
  } catch (err) {
    // 记录完整错误信息，便于生产环境排查
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[GitHub Contributions] 请求异常: ${message}, username=${username}, upstream=${upstream}`
    );
    return fallback(username, cached);
  }
}

/**
 * 上游不可达时的逐级兜底：内存缓存 → 构建期静态快照；皆无则返回错误
 * @param username - GitHub 用户名
 * @param cached - 已有内存缓存（可能过期），优先于静态快照
 * @returns NextResponse（成功或错误）
 */
function fallback(
  username: string,
  cached: CacheEntry | undefined
): NextResponse {
  if (cached) {
    return NextResponse.json({
      success: true,
      code: 200,
      message: "操作成功（使用缓存）",
      data: cached.data,
    });
  }
  const snapshot = readSnapshot();
  if (snapshot) {
    return NextResponse.json({
      success: true,
      code: 200,
      message: "操作成功（使用快照）",
      data: snapshot,
    });
  }
  return NextResponse.json(
    {
      success: false,
      code: "UPSTREAM_ERROR",
      message: "获取 GitHub 贡献数据失败",
      data: null,
    },
    { status: 502 }
  );
}
