/**
 * @file OSS 静态资源地址工具
 * @description 将项目内以 "/images/" 开头的本地静态图片路径统一转换为 OSS（对象存储）公网访问地址，
 *              用于图片加速与集中管理；当未配置 NEXT_PUBLIC_OSS_BASE_URL 时原样返回本地路径，
 *              保证本地开发、图片迁移过渡期与 OSS 不可用时页面依然正常展示。
 * @author gouxinjie
 * @created 2026-10-09
 * @updated 2026-10-09 增加协议校验，避免漏写协议前缀时生成无效地址
 */

/**
 * 环境变量原始值（去除首尾空白与末尾斜杠）
 * @description 使用 NEXT_PUBLIC_ 前缀，构建期会被内联，故客户端组件中同样可用
 */
const RAW_OSS_BASE_URL: string = (process.env.NEXT_PUBLIC_OSS_BASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

/**
 * OSS 公网访问基础地址
 * @description 读取构建期环境变量 NEXT_PUBLIC_OSS_BASE_URL，
 *              例如 https://mylab-images.oss-cn-shanghai.aliyuncs.com；
 *              仅接受 http(s) 协议，漏写协议时视为未配置，回退本地路径，
 *              避免生成缺失协议的地址导致 next/image 直接报错或图片静默 404
 */
const OSS_BASE_URL: string = /^https?:\/\//i.test(RAW_OSS_BASE_URL) ? RAW_OSS_BASE_URL : "";

// 配置了值但格式不合法时，在开发环境给出明确提示（生产环境不输出日志）
if (process.env.NODE_ENV !== "production" && RAW_OSS_BASE_URL && !OSS_BASE_URL) {
  console.warn(
    `[oss] NEXT_PUBLIC_OSS_BASE_URL 缺少 http(s) 协议前缀，已忽略并回退本地图片路径：${RAW_OSS_BASE_URL}`
  );
}

/**
 * 需要转换的本地图片路径前缀
 * @description 仅接管 public/images 下的图片，避免误伤 /logos、/data 等其它本地静态资源
 */
const LOCAL_IMAGE_PREFIX = "/images/";

/**
 * 判断给定路径是否为可转换的本地图片路径
 * @param path - 资源路径
 * @returns 属于 public/images 下的本地路径返回 true
 */
const isLocalImagePath = (path: string): boolean => path.startsWith(LOCAL_IMAGE_PREFIX);

/**
 * 将本地图片路径转换为 OSS 公网绝对地址
 * @param path - 图片路径，如 "/images/project-cover/mylab.png"；
 *               若传入已是 http(s)、data:、blob: 或非 /images 开头的地址，则原样返回
 * @returns OSS 绝对地址；未配置 OSS 域名或路径无需转换时返回原始 path
 * @example
 * assetUrl("/images/avatar.png");
 * // => "https://mylab-images.oss-cn-shanghai.aliyuncs.com/images/avatar.png"
 */
export const assetUrl = (path: string): string => {
  // 空值、未配置 OSS 域名、非本地图片路径均原样返回，保证降级可用
  if (!path || !OSS_BASE_URL || !isLocalImagePath(path)) return path;
  return `${OSS_BASE_URL}${path}`;
};

/**
 * 批量将本地图片路径转换为 OSS 公网绝对地址
 * @param paths - 图片路径数组
 * @returns 转换后的地址数组，顺序与入参一致
 */
export const assetUrls = (paths: string[]): string[] => paths.map(assetUrl);
