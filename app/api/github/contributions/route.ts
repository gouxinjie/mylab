/**
 * @file route.ts
 * @description GitHub 贡献热力图 API - 代理获取用户年度贡献数据
 * @author gouxinjie
 * @updated 2026-07-23 抽取公共工具函数 + 限流
 */

import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/utils/fetch-with-timeout";
import { createRateLimiter } from "@/utils/rate-limiter";

/** GitHub GraphQL API 请求超时时间（毫秒） */
const GITHUB_API_TIMEOUT = 15000;

/** 每 IP 每分钟最多 5 次请求（GraphQL 成本较高） */
const limiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 5 });

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

    // 计算从一年前到今天
    const to = new Date();
    const from = new Date(to);
    from.setFullYear(from.getFullYear() - 1);

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetchWithTimeout(
      "https://api.github.com/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            username,
            from: from.toISOString(),
            to: to.toISOString(),
          },
        }),
      },
      GITHUB_API_TIMEOUT,
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          code: "GITHUB_ERROR",
          message: `GitHub GraphQL 接口返回错误: ${response.status}`,
          data: null,
        },
        { status: response.status },
      );
    }

    const result = await response.json();

    if (result.errors) {
      return NextResponse.json(
        {
          success: false,
          code: "GRAPHQL_ERROR",
          message: result.errors[0]?.message || "GraphQL 查询错误",
          data: null,
        },
        { status: 500 },
      );
    }

    const contributionsData =
      result.data?.user?.contributionsCollection?.contributionCalendar;

    if (!contributionsData) {
      return NextResponse.json(
        { success: false, code: "NO_DATA", message: "获取贡献数据为空", data: null },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      code: 200,
      message: "操作成功",
      data: contributionsData,
    });
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
