/**
 * @component GitHubDashboard
 * @description GitHub 数据看板组件，含统计卡片（sparkline 折线图）、个人资料卡片与引用区域
 * @author gouxinjie
 * @created 2026-07-18
 * @updated 2026-07-17
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { getGithubUser, getGithubRepos, getGithubContributions } from "@/services/github";
import type { GithubContributionDay, GithubContributionsData } from "@/types/api";
import Section from "@/components/commons/Section";
import Image from "next/image";
import styles from "./index.module.scss";

interface GithubData {
  public_repos: number;
  /** 公开仓库总数（含 Fork） */
  repo_count: number;
  /** GitHub 账号注册至今的年数 */
  github_years: number;
}

// 统计卡片配置（颜色、图标、sparkline 数据）
interface StatConfig {
  key: string;
  color: string;
  bgColor: string;
  sparklineColor: string;
  icon: React.ReactNode;
}

/**
 * 迷你 Sparkline 折线图组件
 * @param data - 数据点数组
 * @param color - 折线颜色
 */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;

  const width = 120;
  const height = 32;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padX = 4;
  const padY = 6;

  const points = data
    .map((v, i) => {
      const x = padX + (i / (data.length - 1)) * (width - padX * 2);
      const y = height - padY - ((v - min) / range) * (height - padY * 2);
      return `${x},${y}`;
    })
    .join(" ");

  // 生成折线路径（用于折线下方的渐变填充区域）
  const pathD = data
    .map((v, i) => {
      const x = padX + (i / (data.length - 1)) * (width - padX * 2);
      const y = height - padY - ((v - min) / range) * (height - padY * 2);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg
      className={styles.sparkline}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* 填充区域：折线下方半透明渐变 */}
      <defs>
        <linearGradient id={`spark-fill-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={`${pathD} L ${width - padX} ${height - padY} L ${padX} ${height - padY} Z`}
        fill={`url(#spark-fill-${color.replace("#", "")})`}
      />
      {/* 折线 */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 最后一个数据点 */}
      {(() => {
        const last = data[data.length - 1];
        const x = padX + ((data.length - 1) / (data.length - 1)) * (width - padX * 2);
        const y = height - padY - ((last - min) / range) * (height - padY * 2);
        return (
          <circle
            cx={x}
            cy={y}
            r={3}
            fill="#fff"
            stroke={color}
            strokeWidth="1.5"
          />
        );
      })()}
    </svg>
  );
}

/**
 * 将逐日贡献数据按周聚合为 sparkline 数据点
 * @param contributions - 逐日贡献数据
 * @returns 每周提交总数数组（最近 12 周）
 */
function buildWeeklySparkline(contributions: GithubContributionDay[]): number[] {
  if (!contributions.length) return [];
  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: number[] = [];
  let currentWeek = 0;
  let dayCount = 0;

  for (const day of sorted) {
    currentWeek += day.count;
    dayCount += 1;
    if (dayCount === 7) {
      weeks.push(currentWeek);
      currentWeek = 0;
      dayCount = 0;
    }
  }
  if (dayCount > 0) weeks.push(currentWeek);

  // 取最近 12 周
  return weeks.slice(-12);
}

// 预定义的装饰性 sparkline 数据（静态、平滑、有趋势感）
const STATIC_SPARKLINES: Record<string, number[]> = {
  repos: [12, 15, 18, 14, 20, 22, 19, 23, 21, 25, 23, 26],
  originals: [5, 7, 6, 8, 9, 8, 10, 11, 10, 12, 11, 13],
  age: [2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5, 5],
};

export default function GitHubDashboard() {
  const t = useTranslations("GitHubDashboard");

  /** 获取 raw 翻译数据（数组格式），绕过 next-intl raw() 的类型推断限制 */
  const raw = (key: "months" | "weekday_labels"): string[] => t.raw(key) as string[];
  const months = raw("months");
  const weekdayLabels = raw("weekday_labels");

  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [contributions, setContributions] = useState<GithubContributionDay[] | null>(null);
  const [contributionsLoading, setContributionsLoading] = useState(true);
  const [contributionsError, setContributionsError] = useState(false);

  const [avatarSrc, setAvatarSrc] = useState("https://avatars.githubusercontent.com/gouxinjie?v=4");

  useEffect(() => {
    async function fetchGitHub() {
      try {
        setLoading(true);
        const [userData, reposData] = await Promise.all([
          getGithubUser("gouxinjie"),
          getGithubRepos("gouxinjie"),
        ]);

        const repoCount = reposData.length;
        const createdAt = new Date(userData.created_at);
        const now = new Date();
        const githubYears = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        );

        setData({
          public_repos: userData.public_repos,
          repo_count: repoCount,
          github_years: githubYears,
        });
      } catch (err) {
        setError("Failed to load GitHub data");
        console.error("GitHub API error:", err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchContributions() {
      try {
        setContributionsLoading(true);
        const result: GithubContributionsData = await getGithubContributions("gouxinjie");
        setContributions(result.contributions ?? []);
      } catch (err) {
        setContributionsError(true);
        console.error("GitHub contributions API error:", err);
      } finally {
        setContributionsLoading(false);
      }
    }

    fetchGitHub();
    fetchContributions();
  }, []);

  // 今年提交次数
  const yearCommits = useMemo(() => {
    if (!contributions) return null;
    const currentYear = String(new Date().getFullYear());
    return contributions
      .filter((d) => d.date.startsWith(currentYear))
      .reduce((sum, d) => sum + d.count, 0);
  }, [contributions]);

  // 今年提交的 sparkline 数据
  const yearCommitsSparkline = useMemo(() => {
    if (!contributions) return [];
    const currentYear = String(new Date().getFullYear());
    const yearData = contributions.filter((d) => d.date.startsWith(currentYear));
    return buildWeeklySparkline(yearData);
  }, [contributions]);

  // 统计卡片配置
  const statConfigs: StatConfig[] = [
    {
      key: "repos",
      color: "#00C853",
      bgColor: "rgba(0, 200, 83, 0.08)",
      sparklineColor: "#00C853",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      key: "originals",
      color: "#FF9800",
      bgColor: "rgba(255, 152, 0, 0.08)",
      sparklineColor: "#FF9800",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      key: "github_age",
      color: "#7C4DFF",
      bgColor: "rgba(124, 77, 255, 0.08)",
      sparklineColor: "#7C4DFF",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      key: "year_commits",
      color: "#2196F3",
      bgColor: "rgba(33, 150, 243, 0.08)",
      sparklineColor: "#2196F3",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
  ];

  // 统计卡片值（含加载/错误态）
  const statValues = useMemo(() => {
    if (loading) {
      return {
        repos: "—",
        originals: "—",
        github_age: "—",
        year_commits: "—",
      };
    }
    if (error) {
      return {
        repos: "36",
        originals: "30+",
        github_age: "8年",
        year_commits: "—",
      };
    }
    return {
      repos: String(data?.public_repos || 0),
      originals: `${data?.repo_count || 0}+`,
      github_age: t("github_age_years", { years: data?.github_years || 0 }),
      year_commits: String(yearCommits ?? "—"),
    };
  }, [loading, error, data, yearCommits, t]);

  // Sparkline 数据
  const statSparklines = useMemo(() => {
    return {
      repos: STATIC_SPARKLINES.repos,
      originals: STATIC_SPARKLINES.originals,
      github_age: STATIC_SPARKLINES.age,
      year_commits: yearCommitsSparkline.length > 0 ? yearCommitsSparkline : STATIC_SPARKLINES.repos,
    };
  }, [yearCommitsSparkline]);

  // 热力图数据（保留原有逻辑）
  const recentContributions = useMemo(() => {
    if (!contributions) return null;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 371);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return contributions.filter((d) => {
      const date = new Date(`${d.date}T00:00:00`);
      return date >= cutoff && date <= endOfMonth;
    });
  }, [contributions]);

  const totalCount = useMemo(
    () => (recentContributions ? recentContributions.reduce((sum, d) => sum + d.count, 0) : null),
    [recentContributions]
  );

  // 热力图可滚动区域引用
  const scrollRef = useRef<HTMLDivElement>(null);

  // 热力图周数据
  const heatmapWeeks = useMemo(() => {
    if (!recentContributions || recentContributions.length === 0) return [];
    const sorted = [...recentContributions].sort((a, b) => a.date.localeCompare(b.date));
    const weeks: (GithubContributionDay | null)[][] = [];
    const firstDate = new Date(`${sorted[0].date}T00:00:00`);
    const firstWeekday = firstDate.getDay();

    let currentWeek: (GithubContributionDay | null)[] = [];
    for (let i = 0; i < firstWeekday; i += 1) currentWeek.push(null);

    for (const day of sorted) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    // 截断最后一周空白
    if (weeks.length > 0) {
      const lastWeek = weeks[weeks.length - 1];
      let lastNonNull = -1;
      lastWeek.forEach((d, i) => {
        if (d !== null) lastNonNull = i;
      });
      if (lastNonNull === -1) {
        weeks.pop();
      } else if (lastNonNull < 6) {
        weeks[weeks.length - 1] = lastWeek.slice(0, lastNonNull + 1);
      }
    }

    return weeks;
  }, [recentContributions]);

  const monthLabels = useMemo(() => {
    const labels: { weekIndex: number; label: string }[] = [];
    let prevMonth = -1;
    heatmapWeeks.forEach((week, idx) => {
      const firstDay = week.find((d) => d !== null);
      if (firstDay) {
        const month = new Date(`${firstDay.date}T00:00:00`).getMonth();
        if (month !== prevMonth) {
          labels.push({ weekIndex: idx, label: months[month] });
          prevMonth = month;
        }
      }
    });
    return labels;
  }, [heatmapWeeks, months]);

  const yearLabels = useMemo(() => {
    const labels: { weekIndex: number; label: string }[] = [];
    let prevYear = -1;
    heatmapWeeks.forEach((week, idx) => {
      const firstDay = week.find((d) => d !== null);
      if (firstDay) {
        const year = new Date(`${firstDay.date}T00:00:00`).getFullYear();
        if (year !== prevYear) {
          labels.push({ weekIndex: idx, label: String(year) });
          prevYear = year;
        }
      }
    });
    return labels;
  }, [heatmapWeeks]);

  useEffect(() => {
    if (scrollRef.current && heatmapWeeks.length > 0) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [heatmapWeeks]);

  const showHeatmapError = contributionsError && !contributionsLoading && heatmapWeeks.length === 0;

  return (
    <Section
      className={styles.github}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      {/* 主体：统计网格 + 个人资料 */}
      <div className={styles.grid}>
        {/* 左侧统计卡片（2x2 网格） */}
        <div className={styles.statsGrid}>
          {statConfigs.map((config) => {
            const value = statValues[config.key as keyof typeof statValues];
            const sparklineData = statSparklines[config.key as keyof typeof statSparklines];
            return (
              <div
                key={config.key}
                className={styles.statsCard}
              >
                <div className={styles.statsCard__header}>
                  <span
                    className={styles.statsCard__icon}
                    style={{ backgroundColor: config.bgColor, color: config.color }}
                  >
                    {config.icon}
                  </span>
                </div>
                <span className={styles.statsCard__value} style={{ color: config.color }}>
                  {value}
                </span>
                <span className={styles.statsCard__label}>
                  {t(config.key)}
                </span>
                <div className={styles.statsCard__sparkline}>
                  <Sparkline data={sparklineData} color={config.sparklineColor} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 右侧个人资料卡片 */}
        <div className={styles.profileCard}>
          <div className={styles.profileCard__main}>
            <Image
              src={avatarSrc}
              alt="xinjie avatar"
              width={72}
              height={72}
              className={styles.profileCard__avatar}
              onError={() => setAvatarSrc("/images/avatar-placeholder.svg")}
            />
            <div className={styles.profileCard__info}>
              <h3 className={styles.profileCard__name}>{t("profile_name")}</h3>
              <div className={styles.profileCard__tags}>
                <span className={styles.profileCard__tag}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {t("profile_role").split("\n")[0]}
                </span>
                <span className={styles.profileCard__tag}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  {t("profile_role").split("\n")[1]}
                </span>
              </div>
            </div>
          </div>
          <a
            href="https://github.com/gouxinjie"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileCard__link}
          >
            GitHub →
          </a>
        </div>
      </div>

      {/* 底部引用区域 */}
      <div className={styles.quoteBar}>
        <svg className={styles.quoteBar__mark} width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M9.5 6C7 6 5 8 5 10.5V16h5v-5H7.5C7.5 9.5 8.2 9 9.5 9V6zm9 0C16 6 14 8 14 10.5V16h5v-5h-2.5C16.5 9.5 17.2 9 18.5 9V6z" />
        </svg>
        <span className={styles.quoteBar__text}>持续学习，持续构建，享受编程的每一天</span>
        <svg className={styles.quoteBar__heart} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </div>

      {/* 贡献热力图（保留原有功能） */}
      <div className={styles.heatmap}>
        <h3 className={styles.heatmap__title}>
          {t("heatmap_title")}
          {totalCount !== null && (
            <span className={styles.heatmap__total}>
              {t("heatmap_total", { count: totalCount })}
            </span>
          )}
        </h3>

        {showHeatmapError ? (
          <p className={styles.heatmap__error}>{t("heatmap_error")}</p>
        ) : heatmapWeeks.length > 0 ? (
          <div className={styles.heatmap__chart}>
            <div className={styles.heatmap__body}>
              <div className={styles.heatmap__weekdayLabels}>
                {weekdayLabels.map((label, i) => (
                  <span key={i} className={styles.heatmap__weekdayLabel}>
                    {label}
                  </span>
                ))}
              </div>
              <div className={styles.heatmap__scrollArea} ref={scrollRef}>
                <div className={styles.heatmap__scrollInner}>
                  <div className={styles.heatmap__monthLabels}>
                    {yearLabels.map((y) => (
                      <span
                        key={y.label + y.weekIndex}
                        className={styles.heatmap__yearLabel}
                        style={{
                          left: `calc(${y.weekIndex} * (var(--gh-cell) + var(--gh-gap)))`,
                        }}
                      >
                        {y.label}
                      </span>
                    ))}
                    {monthLabels.map((m) => (
                      <span
                        key={m.label + m.weekIndex}
                        className={styles.heatmap__monthLabel}
                        style={{
                          left: `calc(${m.weekIndex} * (var(--gh-cell) + var(--gh-gap)))`,
                        }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>
                  <div className={styles.heatmap__grid}>
                    {heatmapWeeks.map((week, wi) => (
                      <div key={wi} className={styles.heatmap__col}>
                        {week.map((day, di) => {
                          if (!day) {
                            return (
                              <div
                                key={di}
                                className={`${styles.heatmap__cell} ${styles["heatmap__cell--empty"]}`}
                              />
                            );
                          }
                          const level = Math.min(day.level, 4);
                          return (
                            <div
                              key={di}
                              className={`${styles.heatmap__cell} ${styles[`heatmap__cell--level-${level}`]}`}
                              title={`${day.date} · ${day.count} commits`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.heatmap__chart}>
            <div className={styles.heatmap__body}>
              <div className={styles.heatmap__weekdayLabels}>
                {weekdayLabels.map((label, i) => (
                  <span key={i} className={styles.heatmap__weekdayLabel}>
                    {label}
                  </span>
                ))}
              </div>
              <div className={styles.heatmap__scrollArea}>
                <div className={styles.heatmap__scrollInner}>
                  <div className={styles.heatmap__monthLabels} />
                  <div className={styles.heatmap__grid}>
                    {Array.from({ length: 53 }).map((_, weekIdx) => (
                      <div key={weekIdx} className={styles.heatmap__col}>
                        {Array.from({ length: 7 }).map((_, dayIdx) => (
                          <div
                            key={dayIdx}
                            className={`${styles.heatmap__cell} ${styles["heatmap__cell--empty"]}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.heatmap__footer}>
          <a
            href="https://docs.github.com/en/graphs/contributions"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.heatmap__link}
          >
            {t("heatmap_learn_more")}
          </a>
          <div className={styles.heatmap__legend}>
            <span>{t("less")}</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`${styles.heatmap__level} ${styles[`heatmap__level--${level}`]}`}
              />
            ))}
            <span>{t("more")}</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
