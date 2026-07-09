/**
 * @file api.d.ts
 * @description API 相关类型定义
 * @author gouxinjie
 */

// 统一响应结构：泛型默认使用 unknown，避免 any 违反类型安全规范
export interface ApiResponse<T = unknown> {
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

// 索引签名为 unknown，扩展字段需自行收窄类型
export interface GithubUserData {
  public_repos: number;
  followers: number;
  [key: string]: unknown;
}

export interface GithubRepoData {
  stargazers_count: number;
  [key: string]: unknown;
}
