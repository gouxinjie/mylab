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

// GitHub 贡献热力图单日数据
export interface GithubContributionDay {
  // 日期，格式 YYYY-MM-DD
  date: string;
  // 当日提交次数
  count: number;
  // 贡献等级，0（无）- 4（最多）
  level: number;
}

// GitHub 贡献热力图响应
export interface GithubContributionsData {
  // 不同时间维度的提交总数，例如 { lastYear: 123, "2024": 456 }
  total: Record<string, number>;
  // 按日期升序排列的每日贡献明细
  contributions: GithubContributionDay[];
}
