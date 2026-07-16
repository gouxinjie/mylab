/**
 * @component AiTabs
 * @description AI 页面通用 Tab 切换栏：控制多个内容面板的显隐，支持键盘与无障碍；
 *              激活状态同步到 URL query（?tab=），从文章详情页返回时保留当前分类
 * @author gouxinjie
 * @created 2026-07-16
 * @updated 2026-07-16
 */

"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "@/lib/navigation";
import styles from "./index.module.scss";

/** 单个 Tab 配置项 */
interface TabItem {
  /** 唯一标识 */
  key: string;
  /** 展示文案 */
  label: string;
  /** 面板内容（可为服务端渲染的 React 节点） */
  content: ReactNode;
}

interface AiTabsProps {
  /** Tab 列表 */
  tabs: TabItem[];
  /** 默认激活的 Tab key，缺省取第一项 */
  defaultKey?: string;
}

/**
 * AI 页面 Tab 切换栏
 * @param tabs - Tab 配置列表
 * @param defaultKey - 默认激活项 key
 * @returns 含切换栏与面板的容器
 */
export default function AiTabs({ tabs, defaultKey }: AiTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 初始激活项：默认取第一项（SSR 阶段无 URL 信息，客户端挂载后由 URL 同步）
  const fallbackKey = defaultKey ?? tabs[0]?.key;
  const [active, setActive] = useState<string>(fallbackKey);

  /**
   * 客户端挂载后及浏览器前进/后退时，根据 URL 中的 tab 参数恢复激活项
   * @description 从文章详情页携带 ?tab=docs 返回时恢复「相关文档」分类；刷新或浏览器导航后状态保留
   */
  useEffect(() => {
    const syncFromUrl = (): void => {
      const tabFromUrl = new URLSearchParams(window.location.search).get("tab");
      if (tabFromUrl && tabs.some((tab) => tab.key === tabFromUrl)) {
        // 函数式更新避免闭包读取旧 active，与当前一致则跳过
        setActive((prev) => (prev === tabFromUrl ? prev : tabFromUrl));
      }
    };

    // 挂载即同步一次（SSR 默认渲染第一项，客户端恢复 URL 指定分类）
    syncFromUrl();
    // 浏览器前进/后退导致 URL 变化时同步激活项
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [tabs]);

  /**
   * 切换 Tab 并同步到 URL query
   * @param key - 目标 Tab 的唯一标识
   */
  const handleSelect = (key: string): void => {
    setActive(key);
    // 用 replace 更新 query，不新增历史记录；刷新或返回时可恢复当前分类
    const params = new URLSearchParams(window.location.search);
    params.set("tab", key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.tabs}>
      {/* 切换栏 */}
      <div className={styles.tabbar} role="tablist" aria-label="AI 内容分类">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              onClick={() => handleSelect(tab.key)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 面板区 */}
      <div className={styles.panels}>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            role="tabpanel"
            hidden={active !== tab.key}
            className={styles.panel}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
