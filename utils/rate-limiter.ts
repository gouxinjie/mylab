/**
 * @file rate-limiter.ts
 * @description 基于内存 Map 的简易速率限制器，用于 API Route 防止滥用
 * @author gouxinjie
 * @created 2026-07-23
 */

/**
 * 速率限制配置
 */
interface RateLimitConfig {
  /** 时间窗口（毫秒），默认 60 秒 */
  windowMs?: number;
  /** 窗口内最大请求数，默认 30 */
  maxRequests?: number;
  /** 限流响应消息 */
  message?: string;
}

/**
 * 客户端请求记录
 */
interface ClientRecord {
  /** 窗口首次请求时间戳 */
  windowStart: number;
  /** 窗口内已请求次数 */
  count: number;
}

/**
 * 创建简易速率限制中间件工厂
 * @param config - 限流配置
 * @returns 检查函数：传入 IP，返回是否被限流
 */
export const createRateLimiter = (config: RateLimitConfig = {}) => {
  const {
    windowMs = 60 * 1000,
    maxRequests = 30,
  } = config;

  // 使用 Map 存储每个 IP 的请求记录
  const clients = new Map<string, ClientRecord>();

  // 每 5 分钟清理过期记录，避免内存泄漏
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of clients) {
      if (now - record.windowStart > windowMs * 2) {
        clients.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  // Node.js 退出时清理定时器（不强制，但良好习惯）
  if (typeof process !== "undefined") {
    process.once("beforeExit", () => clearInterval(cleanupInterval));
  }

  /**
   * 检查指定 IP 是否超过速率限制
   * @param ip - 客户端 IP 地址
   * @returns 未被限制返回 null；被限制返回剩余等待秒数
   */
  const check = (ip: string): number | null => {
    const now = Date.now();
    const record = clients.get(ip);

    if (!record) {
      // 首次请求：创建窗口
      clients.set(ip, { windowStart: now, count: 1 });
      return null;
    }

    // 窗口已过期：重置窗口
    if (now - record.windowStart > windowMs) {
      clients.set(ip, { windowStart: now, count: 1 });
      return null;
    }

    // 窗口内计数 +1
    record.count += 1;

    // 超过限制：返回剩余等待秒数
    if (record.count > maxRequests) {
      const remainingMs = record.windowStart + windowMs - now;
      return Math.ceil(remainingMs / 1000);
    }

    return null;
  };

  return { check };
};

/** 默认全局限流器实例（每 IP 每分钟最多 30 次请求） */
export const globalRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
});
