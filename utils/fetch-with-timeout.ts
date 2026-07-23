/**
 * @file fetch-with-timeout.ts
 * @description 带超时控制的 fetch 封装，用于 API Route 请求上游服务
 * @author gouxinjie
 * @created 2026-07-23
 */

/**
 * 带超时控制的 fetch 请求
 * @param url - 请求 URL
 * @param options - fetch 选项（不含 signal，由本函数管理超时）
 * @param timeoutMs - 超时时间（毫秒），默认 10000
 * @returns fetch Response
 * @throws 超时时抛出 "Request timeout after {timeoutMs}ms"
 */
export const fetchWithTimeout = async (
  url: string,
  options: Omit<RequestInit, "signal"> = {},
  timeoutMs = 10000,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};
