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

/** 轮询间隔（毫秒），默认 60s，可按需调整 */
const POLL_INTERVAL = 60_000;
/** 请求控制：禁用缓存，确保每次都能拿到最新 version.json */
const FETCH_INIT: RequestInit = { cache: "no-cache" };

/** version.json 数据结构 */
interface VersionInfo {
  version: string;
  buildTime: number;
}

/**
 * 拉取最新版本信息并与当前构建时间对比
 * @param currentBuildTime - 当前页面记录的构建时间
 * @returns 若远端 buildTime 与当前不一致（已发版）返回 true，否则 false
 */
const fetchAndCompare = async (currentBuildTime: number): Promise<boolean> => {
  try {
    const res = await fetch("/version.json", FETCH_INIT);
    if (!res.ok) return false;
    const data = (await res.json()) as VersionInfo;
    return typeof data.buildTime === "number" && data.buildTime !== currentBuildTime;
  } catch {
    // 网络异常静默失败，下次轮询再试，避免影响正常访问
    return false;
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
  // 基准以服务端 version.json 的 buildTime 为准，而非本地时间，防止首屏误报
  const buildTimeRef = useRef<number>(0);
  const notifiedRef = useRef<boolean>(false);

  useEffect(() => {
    // 初始化基准：先拉取一次服务端版本，将远端 buildTime 作为对比基准
    const init = async () => {
      try {
        const res = await fetch("/version.json", FETCH_INIT);
        if (res.ok) {
          const data = (await res.json()) as VersionInfo;
          if (typeof data.buildTime === "number") {
            buildTimeRef.current = data.buildTime;
          }
        }
      } catch {
        // 初始化失败不阻塞，后续轮询会补齐基准
      }
    };

    void init();

    const timer = setInterval(async () => {
      // 基准未就绪（首次拉取未完成或失败）时跳过，避免误报
      if (buildTimeRef.current === 0) return;
      const changed = await fetchAndCompare(buildTimeRef.current);
      if (changed && !notifiedRef.current) {
        notifiedRef.current = true;
        toast(renderUpdateToast(), { id: "version-update", duration: Infinity });
      }
    }, POLL_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  // 该组件仅负责副作用，无可见 UI
  return null;
}
