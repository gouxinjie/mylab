/**
 * @file route.ts
 * @description GitHub 仓库列表 API - 代理获取用户仓库数据
 * @author gouxinjie
 * @updated 2026-08-14 抽取公共逻辑到 utils/github-route.ts
 */

import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/utils/fetch-with-timeout";
import { createRateLimiter } from "@/utils/rate-limiter";
import {
  getClientIp,
  buildGithubHeaders,
  toErrorResponse,
  requireUsername,
  checkRateLimit,
} from "@/utils/github-route";

/** GitHub API 请求超时时间（毫秒） */
const GITHUB_API_TIMEOUT = 10000;

/** 每 IP 每分钟最多 10 次请求 */
const limiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 10 });

export async function GET(request: Request) {
  try {
    // 速率限制检查
    const clientIp = getClientIp(request);
    const rateLimited = checkRateLimit(limiter, clientIp);
    if (rateLimited) return rateLimited;

    // 参数校验
    const { searchParams } = new URL(request.url);
    const username = requireUsername(searchParams);
    if (username instanceof NextResponse) return username;
    const perPage = searchParams.get("per_page") || "50";

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      // 无 Token 降级为未认证请求（限流 60 次/小时），记录告警便于线上排查配置缺失
      console.warn("[github/repos] GITHUB_TOKEN 未配置，使用未认证请求（限流较低）");
    }

    const response = await fetchWithTimeout(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=${perPage}`,
      { headers: buildGithubHeaders(token) },
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
    return toErrorResponse(error);
  }
}
