/**
 * @file route.ts
 * @description GitHub 贡献热力图代理接口（同源，规避浏览器跨域与网络限制）
 * @author gouxinjie
 * @created 2026-07-15
 */

import { NextRequest, NextResponse } from "next/server";
import type { GithubContributionsData } from "@/types/api";

// 默认 GitHub 用户名（与看板保持一致）
const DEFAULT_USERNAME = "gouxinjie";
// 上游数据来源模板：公开贡献统计服务
const UPSTREAM_TEMPLATE = "https://github-contributions-api.jogruber.de/v4";

/**
 * 获取 GitHub 贡献热力图（最近一年）
 * @remarks 由服务端代理请求上游，统一返回 ApiResponse 结构；浏览器仅请求同源 /api 路径。
 */
export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") || DEFAULT_USERNAME;
  const upstream = `${UPSTREAM_TEMPLATE}/${username}`;
  try {
    // 添加 AbortController 超时控制，防止生产环境外网请求无限挂起
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(upstream, {
      headers: { Accept: "application/json" },
      // 缓存一天，降低上游压力（standalone 模式下配合 ISR 生效）
      next: { revalidate: 86400 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(
        `[GitHub Contributions] 上游返回非 2xx: ${res.status} ${res.statusText}, username=${username}, upstream=${upstream}`
      );
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

    const data = (await res.json()) as GithubContributionsData;
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
