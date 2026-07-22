/**
 * @file github-slugger.d.ts
 * @description github-slugger 模块类型声明。
 * github-slugger@1.5.0 未内置 .d.ts，项目也未安装 @types/github-slugger，
 * 在此补充模块声明以通过 next build 的严格类型检查（strict + noImplicitAny）。
 * 运行时该包以 module.exports = class GithubSlugger 形式导出，配合 esModuleInterop 默认导入可用。
 * @author gouxinjie
 * @created 2026-07-22
 */

declare module "github-slugger" {
  /**
   * GitHub 风格 slug 生成器。
   * 内部维护已生成 slug 的计数，保证相同文本生成唯一锚点（如 "foo" 与 "foo-1"）。
   */
  export default class GithubSlugger {
    /**
     * 根据标题文本生成 slug。
     * @param value - 原始标题文本
     * @param maintainCase - 是否保留原始大小写，默认 false（转小写并用短横线连接）
     * @returns 生成的 slug 字符串
     */
    slug(value: string, maintainCase?: boolean): string;

    /**
     * 重置内部计数，使后续 slug 从基线重新开始。
     */
    reset(): void;
  }
}
