/**
 * @component VersionCheck
 * @description 发版检测组件：定时拉取 public/version.json，若构建版本变化则通过 toast 提示用户刷新页面。
 *              采用 no-cache 请求 + localStorage 记录基准 buildTime，避免命中缓存导致永远检测不到新版本。
 * @author gouxinjie
 * @created 2026-08-03
 */
"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

/** 轮询间隔（毫秒），默认 1 小时（3600s），可按需调整 */
const POLL_INTERVAL = 3_600_000;
/** 请求控制：禁用缓存，确保每次都能拿到最新 version.json */
const FETCH_INIT: RequestInit = { cache: "no-cache" };
/** 本地存储 key：持久化最近一次已知的 buildTime，跨会话也能检测到发版 */
const STORAGE_KEY = "__APP_BUILD_TIME__";

/** version.json 数据结构 */
interface VersionInfo {
  version: string;
  buildTime: number;
}

/**
 * 拉取最新版本信息
 * @returns 远端 version.json 的 buildTime；请求失败或结构异常时返回 null
 */
const fetchLatestBuildTime = async (): Promise<number | null> => {
  try {
    const res = await fetch("/version.json", FETCH_INIT);
    if (!res.ok) return null;
    const data = (await res.json()) as VersionInfo;
    return typeof data.buildTime === "number" ? data.buildTime : null;
  } catch {
    // 网络异常静默失败，下次轮询再试，避免影响正常访问
    return null;
  }
};

/** 刷新提示的 toast 内容 */
const renderUpdateToast = (): React.ReactElement => (
  <span>
    站点已更新，请
    <button
      type="button"
      onClick={() => window.location.reload()}
      style={{ margin: "0 6px", color: "#2563eb", cursor: "pointer", background: "none", border: "none", padding: 0 }}
    >
      刷新页面
    </button>
    以获取最新内容。
  </span>
);

export default function VersionCheck() {
  // 用 ref 持有基准构建时间与去重标记，避免闭包陈旧值
  const buildTimeRef = useRef<number>(0);
  const notifiedRef = useRef<boolean>(false);

  useEffect(() => {
    // 初始化基准：读取本地持久化的旧 buildTime（跨会话检测的关键），
    // 并拉取一次服务端版本。若本地旧值与远端不一致，说明自上次访问后已发版，立即提示。
    const init = async () => {
      // 本地持久化的最近一次 buildTime
      const stored = Number(localStorage.getItem(STORAGE_KEY));
      const storedValid = Number.isFinite(stored) && stored > 0;
      if (storedValid) {
        buildTimeRef.current = stored;
      }

      const latest = await fetchLatestBuildTime();
      if (latest === null) return;

      // 首次访问（无本地记录）以远端为准，避免首屏误报
      if (!storedValid) {
        buildTimeRef.current = latest;
      }
      // 持久化最新版本号
      localStorage.setItem(STORAGE_KEY, String(latest));

      // 跨会话发版检测：本地记录的旧版本与远端不一致则立即弹窗
      if (storedValid && stored !== latest) {
        notifiedRef.current = true;
        toast(renderUpdateToast(), { id: "version-update", duration: Infinity });
      }
    };

    void init();

    const timer = setInterval(async () => {
      // 基准未就绪时跳过，避免误报
      if (buildTimeRef.current === 0) return;
      const latest = await fetchLatestBuildTime();
      if (latest !== null && latest !== buildTimeRef.current && !notifiedRef.current) {
        notifiedRef.current = true;
        // 更新持久化记录，避免重复提示
        localStorage.setItem(STORAGE_KEY, String(latest));
        toast(renderUpdateToast(), { id: "version-update", duration: Infinity });
      }
    }, POLL_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  // 该组件仅负责副作用，无可见 UI
  return null;
}
