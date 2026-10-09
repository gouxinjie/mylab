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

/**
 * OSS 图片处理选项
 */
export interface OssImageOptions {
  /** 目标宽度（px），由 OSS 端等比缩放；不传则不缩放 */
  width?: number;
  /** 目标高度（px），一般不传，由宽度等比推导 */
  height?: number;
  /**
   * 输出格式，默认 webp
   * @description webp 浏览器兼容性最好且 OSS 端处理更快；
   *              实测同图 avif 体积约为 webp 的 70%，但 OSS 冷处理耗时约翻倍
   *              （0.88s vs 0.34s），追求更小体积时可改为 avif
   */
  format?: "webp" | "avif" | "jpg" | "png";
  /** 压缩质量 1-100，默认 75 */
  quality?: number;
}

/**
 * 可由 OSS 图片处理转码的位图格式
 * @description 排除 svg（矢量图，OSS 不支持处理）与 gif（处理后会丢失动图帧）
 */
const PROCESSABLE_IMAGE_EXT = /\.(png|jpe?g|webp|bmp|tiff?)$/i;

/**
 * 构建带 OSS 图片处理参数的访问地址
 * @description 缩放与格式转换全部由 OSS 端完成，浏览器直连 OSS，
 *              从而避免经 next/image 在应用服务器上实时转码（CPU 密集，是图片加载慢的主因）。
 *              未启用 OSS、传入外部地址或不支持处理的格式时，原样返回入参。
 * @param path - 本地图片路径（如 /images/cover.png）或已转换的 OSS 绝对地址
 * @param options - 处理选项，见 {@link OssImageOptions}
 * @returns 带 x-oss-process 参数的 OSS 地址；不适用处理时返回原始地址
 * @example
 * ossImageUrl("/images/project-cover/mylab.png", { width: 828 });
 * // => "https://mylab-images.oss-cn-shanghai.aliyuncs.com/images/project-cover/mylab.png?x-oss-process=image/resize,w_828/format,webp/quality,75"
 */
export const ossImageUrl = (path: string, options: OssImageOptions = {}): string => {
  if (!path || !OSS_BASE_URL) return path;

  // 去掉可能已存在的处理参数，保证重复调用时结果为最新参数
  const cleanPath = path.split("?")[0];
  // 仅处理站内 /images 资源与指向本 bucket 的地址，外部图片（如 GitHub 头像）保持原样
  const isOwnAsset = isLocalImagePath(cleanPath) || cleanPath.startsWith(`${OSS_BASE_URL}/`);
  if (!isOwnAsset || !PROCESSABLE_IMAGE_EXT.test(cleanPath)) return path;

  const { width, height, format = "webp", quality = 75 } = options;
  const resizeParams = [width ? `w_${width}` : "", height ? `h_${height}` : ""]
    .filter(Boolean)
    .join(",");

  const operations: string[] = [];
  if (resizeParams) operations.push(`image/resize,${resizeParams}`);
  operations.push(`format,${format}`, `quality,${quality}`);

  const absoluteUrl = isLocalImagePath(cleanPath) ? `${OSS_BASE_URL}${cleanPath}` : cleanPath;
  return `${absoluteUrl}?x-oss-process=${operations.join("/")}`;
};

/**
 * 判断地址是否为已应用 OSS 图片处理的地址
 * @description 此类地址已由 OSS 完成缩放与转码，需配合 next/image 的 unoptimized 使用，
 *              避免应用服务器对同一张图再次转码
 * @param url - 图片地址
 * @returns 含 x-oss-process 参数时返回 true
 */
export const isOssProcessed = (url: string): boolean => url.includes("x-oss-process=");
