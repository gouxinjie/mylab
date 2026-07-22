/**
 * @file route.ts
 * @description GitHub 用户仓库列表代理接口（同源，服务端鉴权规避浏览器跨域与速率限制）
 * @author gouxinjie
 * @created 2026-07-15
 */

import { NextRequest, NextResponse } from "next/server";
import type { GithubRepoData } from "@/types/api";

// 默认 GitHub 用户名（与看板保持一致）
const DEFAULT_USERNAME = "gouxinjie";
// 上游数据来源模板：GitHub 公开 API
const UPSTREAM_TEMPLATE = "https://api.github.com/users";

/**
 * 获取 GitHub 用户仓库列表（带鉴权头，享有更高速率限制）
 * @remarks 由服务端代理请求上游，统一返回 ApiResponse 结构；浏览器仅请求同源 /api 路径。
 */
export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") || DEFAULT_USERNAME;
  const perPage = req.nextUrl.searchParams.get("per_page") || "100";

  const params = new URLSearchParams({
    per_page: perPage,
    sort: "updated",
    type: "public",
  });
  const upstream = `${UPSTREAM_TEMPLATE}/${username}/repos?${params}`;

  // 鉴权请求享有更高速率限制；未配置 GITHUB_TOKEN 时降级为匿名请求
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // 添加 AbortController 超时控制，防止生产环境外网请求无限挂起
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(upstream, {
      headers,
      // 缓存一小时，降低上游压力
      next: { revalidate: 3600 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(
        `[GitHub Repos] 上游返回非 2xx: ${res.status} ${res.statusText}, username=${username}, upstream=${upstream}`
      );
      return NextResponse.json(
        {
          success: false,
          code: "UPSTREAM_ERROR",
          message: "获取 GitHub 仓库列表失败",
          data: null,
        },
        { status: 502 }
      );
    }

    const data = (await res.json()) as GithubRepoData[];
    return NextResponse.json({
      success: true,
      code: 200,
      message: "操作成功",
      data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[GitHub Repos] 请求异常: ${message}, username=${username}, upstream=${upstream}`
    );
    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: "服务异常，请稍后重试",
        data: null,
      },
      { status: 500 }
    );
  }
}
