/**
 * @file route.ts
 * @description GitHub 用户信息 API - 代理获取 GitHub 用户数据
 * @author gouxinjie
 * @updated 2026-07-23 抽取公共工具函数 + 限流
 */

import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/utils/fetch-with-timeout";
import { createRateLimiter } from "@/utils/rate-limiter";

/** GitHub API 请求超时时间（毫秒） */
const GITHUB_API_TIMEOUT = 10000;

/** 每 IP 每分钟最多 10 次请求 */
const limiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 10 });

export async function GET(request: Request) {
  try {
    // 获取客户端 IP 进行速率限制
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const retryAfter = limiter.check(clientIp);
    if (retryAfter !== null) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", message: "请求过于频繁，请稍后再试", data: null },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, code: "MISSING_PARAM", message: "缺少必要参数: username", data: null },
        { status: 400 },
      );
    }

    const response = await fetchWithTimeout(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
      GITHUB_API_TIMEOUT,
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          code: "GITHUB_ERROR",
          message: `GitHub 接口返回错误: ${response.status}`,
          data: null,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, code: 200, message: "操作成功", data });
  } catch (error) {
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
  }
}
