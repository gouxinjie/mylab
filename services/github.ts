/**
 * @file github.ts
 * @description GitHub 相关 API 封装
 * @author gouxinjie
 * @updated 2026-07-23 async/await 风格统一
 */

import {
  GithubUserData,
  GithubRepoData,
  GithubContributionsData,
  ApiResponse,
} from "@/types/api";

/**
 * 通用请求解析：检查 HTTP 状态与业务 success 字段，提取 data 或抛出异常
 * @param response - fetch 响应
 * @param emptyMessage - data 为空时的中文错误描述
 * @returns 解析后的业务数据
 * @throws 当 HTTP 状态异常或业务返回失败时抛出
 */
const parseApiResponse = async <T>(
  response: Response,
  emptyMessage: string,
): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const body = (await response.json()) as ApiResponse<T>;
  if (!body.success || !body.data) {
    throw new Error(body.message || emptyMessage);
  }
  return body.data;
};

/**
 * 获取 GitHub 用户信息
 * @param username - GitHub 用户名
 * @returns 用户基础数据
 * @remarks 走同源代理 /api/github/user，由服务端鉴权请求上游，规避浏览器跨域与速率限制。
 */
export const getGithubUser = async (username: string): Promise<GithubUserData> => {
  const response = await fetch(
    `/api/github/user?username=${encodeURIComponent(username)}`,
  );
  return parseApiResponse<GithubUserData>(response, "用户数据为空");
};

/**
 * 获取 GitHub 用户仓库列表
 * @param username - GitHub 用户名
 * @param perPage - 每页数量
 * @returns 仓库列表数据
 * @remarks 走同源代理 /api/github/repos，由服务端鉴权请求上游，规避浏览器跨域与速率限制。
 */
export const getGithubRepos = async (
  username: string,
  perPage = 100,
): Promise<GithubRepoData[]> => {
  const query = new URLSearchParams({
    username,
    per_page: String(perPage),
  });
  const response = await fetch(`/api/github/repos?${query}`);
  return parseApiResponse<GithubRepoData[]>(response, "仓库列表为空");
};

/**
 * 获取 GitHub 用户近一年的贡献热力图数据
 * @param username - GitHub 用户名
 * @returns 贡献热力图数据（含每日提交数与等级）
 * @throws 当请求失败或响应异常时抛出错误
 * @remarks 走同源代理 /api/github/contributions，由服务端请求上游，
 * 规避浏览器跨域限制；上游为只读公开服务，不接受项目内部 userId 头。
 */
export const getGithubContributions = async (
  username: string,
): Promise<GithubContributionsData> => {
  const response = await fetch(
    `/api/github/contributions?username=${encodeURIComponent(username)}`,
  );
  return parseApiResponse<GithubContributionsData>(response, "贡献数据为空");
};
