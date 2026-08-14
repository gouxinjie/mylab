/**
 * @file github-route.ts
 * @description GitHub 代理 API 路由的公共逻辑：IP 获取、限流、参数校验、Token 头构造、错误响应
 * @author gouxinjie
 * @created 2026-08-14
 */

import { NextResponse } from "next/server";
import { createRateLimiter } from "@/utils/rate-limiter";

/**
 * 从请求头提取客户端真实 IP
 * @param request - 请求对象
 * @returns 客户端 IP 字符串；无法识别时返回 "unknown"
 */
export const getClientIp = (request: Request): string =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "unknown";

/**
 * 构造 GitHub API 认证头
 * @param token - 环境变量中的 GitHub Token
 * @returns 请求头对象（含 Accept，若有 Token 则附加 Authorization）
 */
export const buildGithubHeaders = (token: string | undefined): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

/**
 * 统一的错误响应构造
 * @param error - 捕获的异常
 * @returns 统一格式的 500 响应（超时/其他错误分别给出中文描述）
 */
export const toErrorResponse = (error: unknown): NextResponse => {
  const message =
    error instanceof Error && error.name === "AbortError"
      ? "请求超时，请稍后重试"
      : error instanceof Error
        ? error.message
        : "未知错误";
  return NextResponse.json(
    { success: false, code: "UNKNOWN_ERROR", message, data: null },
    { status: 500 },
  );
};

/**
 * 校验必填的 username 参数，缺失时返回 400 响应
 * @param searchParams - 请求查询参数
 * @returns username 字符串；缺失时返回 400 响应
 */
export const requireUsername = (searchParams: URLSearchParams): string | NextResponse => {
  const username = searchParams.get("username");
  if (!username) {
    return NextResponse.json(
      { success: false, code: "MISSING_PARAM", message: "缺少必要参数: username", data: null },
      { status: 400 },
    );
  }
  return username;
};

/**
 * 执行速率限制检查，超限时返回 429 响应
 * @param limiter - 限流器实例（check 方法）
 * @param ip - 客户端 IP
 * @returns 未超限返回 null；超限返回 429 响应
 */
export const checkRateLimit = (
  limiter: ReturnType<typeof createRateLimiter>,
  ip: string,
): NextResponse | null => {
  const retryAfter = limiter.check(ip);
  if (retryAfter === null) return null;
  return NextResponse.json(
    { success: false, code: "RATE_LIMITED", message: "请求过于频繁，请稍后再试", data: null },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
};
