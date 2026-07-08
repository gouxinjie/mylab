/**
 * @file api.d.ts
 * @description API 相关类型定义
 * @author gouxinjie
 */

export interface ApiResponse<T = any> {
  success: boolean;
  code: number | string;
  message: string;
  data: T;
}

export interface UserListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

export interface GithubUserData {
  public_repos: number;
  followers: number;
  [key: string]: any;
}

export interface GithubRepoData {
  stargazers_count: number;
  [key: string]: any;
}
