/**
 * @file github.ts
 * @description GitHub 相关 API 封装
 * @author gouxinjie
 */

import request from "@/utils/request";
import { GithubUserData, GithubRepoData } from "@/types/api";

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
