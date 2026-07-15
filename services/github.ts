/**
 * @file github.ts
 * @description GitHub 相关 API 封装
 * @author gouxinjie
 */

import request from "@/utils/request";
import {
  GithubUserData,
  GithubRepoData,
  GithubContributionsData,
  ApiResponse,
} from "@/types/api";

/**
 * 获取 GitHub 用户信息
 * @param username - GitHub 用户名
 * @returns 用户基础数据
 */
export const getGithubUser = (username: string): Promise<GithubUserData> => {
  return request.get(`https://api.github.com/users/${username}`);
};

/**
 * 获取 GitHub 用户仓库列表
 * @param username - GitHub 用户名
 * @param perPage - 每页数量
 * @returns 仓库列表数据
 */
export const getGithubRepos = (username: string, perPage = 100): Promise<GithubRepoData[]> => {
  return request.get(`https://api.github.com/users/${username}/repos`, {
    per_page: perPage,
    sort: "updated",
    type: "public"
  });
};

/**
 * 获取 GitHub 用户近一年的贡献热力图数据
 * @param username - GitHub 用户名
 * @returns 贡献热力图数据（含每日提交数与等级）
 * @throws 当请求失败或响应异常时抛出错误
 * @remarks 走同源代理 /api/github/contributions，由服务端请求上游，
 * 规避浏览器跨域限制；上游为只读公开服务，不接受项目内部 userId 头。
 */
export const getGithubContributions = (
  username: string
): Promise<GithubContributionsData> => {
  return fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json() as Promise<ApiResponse<GithubContributionsData>>;
    })
    .then((body) => {
      if (!body.success || !body.data) {
        throw new Error(body.message || "贡献数据为空");
      }
      return body.data;
    });
};
