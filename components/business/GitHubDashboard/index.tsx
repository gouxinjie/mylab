/**
 * @component GitHubDashboard
 * @description GitHub 数据看板组件，含统计卡片与真实贡献热力图
 * @author gouxinjie
 * @created 2024
 * @updated 2026-07-15
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
  /** 非 Fork 的原创仓库数量 */
  original_repos: number;
  /** GitHub 账号注册至今的年数 */
  github_years: number;
}

// 左侧星期标签、月份标签均来自 i18n（weekday_labels / months），避免硬编码

/**
 * 将按日期升序的贡献明细转换为「周 × 天」二维网格
 * @param contributions - 每日贡献数据（按日期升序）
 * @returns 每列代表一周（7 天），缺失日期以 null 占位；末尾去掉跨月之后完全无数据的空白格
 */
function buildWeeks(
  contributions: GithubContributionDay[]
): (GithubContributionDay | null)[][] {
  if (contributions.length === 0) return [];

  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: (GithubContributionDay | null)[][] = [];
  const firstDate = new Date(`${sorted[0].date}T00:00:00`);
  const firstWeekday = firstDate.getDay(); // 0=周日

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

  // 截断最后一周：去掉跨月之后完全无数据的空白格子（避免右侧出现整片未来空白列）
  if (weeks.length > 0) {
    const lastWeek = weeks[weeks.length - 1];
    let lastNonNull = -1;
    lastWeek.forEach((d, i) => {
      if (d !== null) lastNonNull = i;
    });
    if (lastNonNull === -1) {
      // 整周为空（不应出现），移除
      weeks.pop();
    } else if (lastNonNull < 6) {
      // 仅保留到当月最后一天所在的格子，去掉其后的空白
      weeks[weeks.length - 1] = lastWeek.slice(0, lastNonNull + 1);
    }
  }

  return weeks;
}

/**
 * 根据热力图网格生成月份标签列表
 * @param weeks - 热力图网格
 * @param months - 月份标签数组（来自 i18n，索引 0~11）
 * @returns 月份标签数组（包含列索引和月份文案）
 */
function getMonthLabels(
  weeks: (GithubContributionDay | null)[][],
  months: string[]
): { weekIndex: number; label: string }[] {
  const labels: { weekIndex: number; label: string }[] = [];
  let prevMonth = -1;

  weeks.forEach((week, idx) => {
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
}

/**
 * 根据热力图网格生成年份标签列表
 * @param weeks - 热力图网格
 * @returns 年份标签数组（包含列索引和年份字符串）
 */
function getYearLabels(
  weeks: (GithubContributionDay | null)[][]
): { weekIndex: number; label: string }[] {
  const labels: { weekIndex: number; label: string }[] = [];
  let prevYear = -1;

  weeks.forEach((week, idx) => {
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
}

export default function GitHubDashboard() {
  const t = useTranslations("GitHubDashboard");
  // 国际化星期标签与月份标签
  // use-intl 的 raw 类型仅收录「值为 string」的消息键，而此处为 string[]，
  // 故以 never 断言 key 并通过 as string[] 取回正确类型
  const weekdayLabels = t.raw("weekday_labels" as never) as string[];
  const months = t.raw("months" as never) as string[];

  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 贡献热力图数据
  const [contributions, setContributions] = useState<GithubContributionDay[] | null>(null);
  const [contributionsLoading, setContributionsLoading] = useState(true);
  const [contributionsError, setContributionsError] = useState(false);

  // 头像地址：远程 GitHub 头像加载失败时回退到本地占位图（用状态驱动，
  // 避免直接改 DOM 在父组件重渲染时被 next/image 的优化 URL 覆盖而失效）
  const [avatarSrc, setAvatarSrc] = useState("https://avatars.githubusercontent.com/gouxinjie?v=4");

  useEffect(() => {
    async function fetchGitHub() {
      try {
        setLoading(true);
        const [userData, reposData] = await Promise.all([
          getGithubUser("gouxinjie"),
          getGithubRepos("gouxinjie"),
        ]);

        // 统计原创仓库数量（排除 Fork 仓库）
        const originalRepos = reposData.filter((repo) => !repo.fork).length;

        // 计算 GitHub 注册年数（从 created_at 到当前）
        const createdAt = new Date(userData.created_at);
        const now = new Date();
        const githubYears = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        );

        setData({
          public_repos: userData.public_repos,
          original_repos: originalRepos,
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

  // 仅取最近一年数据；为让「当前月份」完整呈现，上限放宽到当月最后一天，
  // 而不是按今天截断（否则当前月会被「今天」腰斩，导致月份显示不完整）。
  // 最后一周的跨月空白由 buildWeeks 负责截掉，避免右侧出现整片未来空白列。
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

  const heatmapWeeks = useMemo(
    () => (recentContributions ? buildWeeks(recentContributions) : []),
    [recentContributions]
  );

  // 热力图可滚动区域 DOM 引用，用于数据就绪后自动滚到最右侧（最新日期）
  const scrollRef = useRef<HTMLDivElement>(null);

  const monthLabels = useMemo(
    () => getMonthLabels(heatmapWeeks, months),
    [heatmapWeeks, months]
  );

  const yearLabels = useMemo(
    () => getYearLabels(heatmapWeeks),
    [heatmapWeeks]
  );

  // 热力图数据就绪后，自动将滚动区域滚到最右侧，确保用户首先看到最新日期
  useEffect(() => {
    if (scrollRef.current && heatmapWeeks.length > 0) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [heatmapWeeks]);

  const totalCount = useMemo(
    () => (recentContributions ? recentContributions.reduce((sum, d) => sum + d.count, 0) : null),
    [recentContributions]
  );

  const showHeatmapError = contributionsError && !contributionsLoading && heatmapWeeks.length === 0;

  return (
    <Section
      className={styles.github}
      title={t("title")}
      subtitle={t("subtitle")}
      action={
        <a
          href="https://github.com/gouxinjie"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.header__link}
        >
          {t("view_github")}
        </a>
      }
    >
        <div className={styles.grid}>
          {/* Stats Cards */}
          <div className={styles['stats-grid']}>
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={styles['stats-grid__card']}>
                    <div className={styles.skeleton__val} />
                    <div className={styles.skeleton__label} />
                    <div className={styles.skeleton__sub} />
                  </div>
                ))}
              </>
            ) : error ? (
              <>
                <div className={styles['stats-grid__card']}>
                  <span className={styles['error-card__val']}>36</span>
                  <p className={styles['error-card__label']}>
                    {t("repos")}
                  </p>
                </div>
                <div className={styles['stats-grid__card']}>
                  <span className={styles['error-card__val']}>30+</span>
                  <p className={styles['error-card__label']}>
                    {t("originals")}
                  </p>
                </div>
                <div className={styles['stats-grid__card']}>
                  <span className={styles['error-card__val']}>8年</span>
                  <p className={styles['error-card__label']}>
                    {t("github_age")}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className={styles['stats-grid__card']}>
                  <span className={styles['error-card__val']}>
                    {data?.public_repos || "—"}
                  </span>
                  <p className={styles['error-card__label']}>
                    {t("repos")}
                  </p>
                </div>
                <div className={styles['stats-grid__card']}>
                  <span className={styles['error-card__val']}>
                    {`${data?.original_repos || 0}+`}
                  </span>
                  <p className={styles['error-card__label']}>
                    {t("originals")}
                  </p>
                </div>
                <div className={styles['stats-grid__card']}>
                  <span className={styles['error-card__val']}>
                    {t("github_age_years", { years: data?.github_years || 0 })}
                  </span>
                  <p className={styles['error-card__label']}>
                    {t("github_age")}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Profile Card */}
          <div className={styles['profile-card']}>
            <Image
              src={avatarSrc}
              alt="xinjie avatar"
              width={72}
              height={72}
              className={styles['profile-card__avatar']}
              onError={(e) => {
                if (!e.currentTarget.dataset.errorHandled) {
                  e.currentTarget.dataset.errorHandled = "true";
                  setAvatarSrc("/images/avatar-placeholder.svg");
                }
              }}
            />
            <div className={styles['profile-card__info']}>
              <h3 className={styles['profile-card__name']}>{t("profile_name")}</h3>
              <p className={styles['profile-card__role']}>
                {t("profile_role")}
              </p>
              <a
                href="https://github.com/gouxinjie"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['profile-card__link']}
              >
                GitHub →
              </a>
            </div>
          </div>
        </div>

        {/* 贡献热力图（GitHub 经典样式） */}
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
              {/* 热力图主体：左侧 weekday（固定） + 右侧可滚动区域（月份标签 + 格子） */}
              <div className={styles.heatmap__body}>
                <div className={styles.heatmap__weekdayLabels}>
                  {weekdayLabels.map((label, i) => (
                    <span key={i} className={styles.heatmap__weekdayLabel}>
                      {label}
                    </span>
                  ))}
                </div>
                {/* 可滚动区域：月份/年份标签与格子共用同一滚动容器，保持对齐 */}
                <div className={styles.heatmap__scrollArea} ref={scrollRef}>
                  <div className={styles.heatmap__scrollInner}>
                    {/* 月份 + 年份标签行（随格子一起滚动） */}
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
                    {/* 格子网格 */}
                    <div className={styles.heatmap__grid}>
                      {heatmapWeeks.map((week, wi) => (
                        <div key={wi} className={styles.heatmap__col}>
                          {week.map((day, di) => {
                            if (!day) {
                              return (
                                <div
                                  key={di}
                                  className={`${styles.heatmap__cell} ${styles['heatmap__cell--empty']}`}
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
                              className={`${styles.heatmap__cell} ${styles['heatmap__cell--empty']}`}
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

          {/* 底部：链接 + 图例 */}
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
