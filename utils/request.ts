/**
 * @file request.ts
 * @description 请求封装工具
 * @author gouxinjie
 */

import { ApiResponse } from "@/types/api";

/**
 * 基础请求函数
 * @param url - 请求地址
 * @param options - Fetch 配置项
 * @returns 响应结果
 */
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  
  // 所有请求必须包含 userId
  // 实际项目中可能从 store 或 cookie 中获取，这里暂时模拟
  const userId = "guest_user"; 
  headers.set("x-user-id", userId);

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}

/**
 * GET 请求
 * @param url - 地址
 * @param params - 查询参数
 */
request.get = <T>(url: string, params?: Record<string, string | number>): Promise<T> => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
  }
  const queryString = searchParams.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return request<T>(fullUrl, { method: "GET" });
};

export default request;
