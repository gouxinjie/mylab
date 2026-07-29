/**
 * @component BaiduTongji
 * @description 百度统计接入组件：注入官方 hm.js 脚本，并在客户端路由切换时上报 PV，
 *              弥补 Next.js App Router 作为 SPA（单页应用）不会整页刷新导致百度统计漏计的问题。
 * @author gouxinjie
 * @created 2026-07-29
 * @updated 2026-07-29
 */

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * 百度统计站点 ID，来自环境变量（构建时注入客户端 bundle）
 * 在 .env.local 配置：NEXT_PUBLIC_BAIDU_TONGJI_ID=你的站点ID
 */
const BAIDU_TONGJI_ID = process.env.NEXT_PUBLIC_BAIDU_TONGJI_ID;

/**
 * 百度统计全局命令队列元素类型
 * 常用命令：["_trackPageview", url] 用于页面浏览（PV）上报
 */
type HmtCommand = ["_trackPageview", string] | string;

declare global {
  interface Window {
    _hmt?: HmtCommand[];
  }
}

/**
 * 百度统计组件
 * 1. 通过 next/script（afterInteractive 策略）注入官方 hm.js，不阻塞首屏渲染
 * 2. 监听路由 pathname 变化，客户端导航时手动 push PV 上报
 */
export default function BaiduTongji() {
  const pathname = usePathname();
  // 首次渲染标记：首屏由百度脚本自动上报一次 PV，跳过本次避免重复计数
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 首屏（页面加载）百度脚本已自动上报，仅处理后续客户端路由切换
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!BAIDU_TONGJI_ID) return;

    window._hmt = window._hmt || [];
    window._hmt.push(["_trackPageview", pathname]);
  }, [pathname]);

  // 未配置站点 ID 时不注入统计脚本
  if (!BAIDU_TONGJI_ID) return null;

  return (
    <Script
      id="baidu-tongji"
      strategy="afterInteractive"
    >{`var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?${BAIDU_TONGJI_ID}";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();`}</Script>
  );
}
