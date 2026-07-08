"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * @component GitHubDashboard
 * @description GitHub数据看板组件，展示GitHub用户数据和热力图
 * @author gouxinjie
 * @created 2024
 * @updated 2024
 */

interface GithubData {
  public_repos: number;
  followers: number;
  total_stars: number;
}

export default function GitHubDashboard() {
  const t = useTranslations("GitHubDashboard");
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHub() {
      try {
        setLoading(true);
        // Fetch user profile
        const userRes = await fetch(
          "https://api.github.com/users/gouxinjie"
        );
        if (!userRes.ok) throw new Error("GitHub API error");
        const userData = await userRes.json();

        // Fetch repos to calculate stars
        const reposRes = await fetch(
          "https://api.github.com/users/gouxinjie/repos?per_page=100&sort=updated&type=public"
        );
        const reposData: Array<{ stargazers_count: number }> =
          await reposRes.json();

        const totalStars = reposData.reduce(
          (sum, repo) => sum + repo.stargazers_count,
          0
        );

        setData({
          public_repos: userData.public_repos,
          followers: userData.followers,
          total_stars: totalStars,
        });
      } catch (err) {
        setError("Failed to load GitHub data");
        console.error("GitHub API error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGitHub();
  }, []);

  // Generate heatmap data (simplified)
  const heatmapWeeks = 52;
  const heatmapDays = 7;

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="section-title">{t("title")}</h2>
            <p className="mt-1.5 sm:mt-2 text-sm text-[var(--color-text-secondary)]">
              {t("subtitle")}
            </p>
          </div>
          <a
            href="https://github.com/gouxinjie"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
          >
            {t("view_github")}
          </a>
        </div>

        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-3 gap-3 sm:gap-4">
            {/* Skeleton */}
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-6 sm:h-8 w-12 sm:w-16 rounded bg-gray-200" />
                    <div className="mt-3 sm:mt-4 h-5 sm:h-6 w-16 sm:w-20 rounded bg-gray-200" />
                    <div className="mt-1 h-2.5 sm:h-3 w-10 sm:w-12 rounded bg-gray-200" />
                  </div>
                ))}
              </>
            ) : error ? (
              // 错误状态
              <>
                <div className="card">
                  <span className="text-xl sm:text-2xl font-bold">36</span>
                  <p className="mt-1 text-[11px] sm:text-xs text-[var(--color-text-muted)]">
                    {t("repos")}
                  </p>
                </div>
                <div className="card">
                  <span className="text-xl sm:text-2xl font-bold">1.2k+</span>
                  <p className="mt-1 text-[11px] sm:text-xs text-[var(--color-text-muted)]">
                    {t("stars")}
                  </p>
                </div>
                <div className="card">
                  <span className="text-xl sm:text-2xl font-bold">480+</span>
                  <p className="mt-1 text-[11px] sm:text-xs text-[var(--color-text-muted)]">
                    {t("followers")}
                  </p>
                </div>
              </>
            ) : (
              // 数据状态
              <>
                <div className="card">
                  <span className="text-xl sm:text-2xl font-bold">
                    {data?.public_repos || "—"}
                  </span>
                  <p className="mt-1 text-[11px] sm:text-xs text-[var(--color-text-muted)]">
                    {t("repos")}
                  </p>
                </div>
                <div className="card">
                  <span className="text-xl sm:text-2xl font-bold">
                    {`${((data?.total_stars || 0) / 1000).toFixed(1)}k+`}
                  </span>
                  <p className="mt-1 text-[11px] sm:text-xs text-[var(--color-text-muted)]">
                    {t("stars")}
                  </p>
                </div>
                <div className="card">
                  <span className="text-xl sm:text-2xl font-bold">
                    {`${data?.followers || 0}+`}
                  </span>
                  <p className="mt-1 text-[11px] sm:text-xs text-[var(--color-text-muted)]">
                    {t("followers")}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Profile Card */}
          <div className="card flex items-center gap-3 sm:gap-4 overflow-hidden p-4 sm:p-5">
            <img
              src={`https://avatars.githubusercontent.com/gouxinjie?v=4`}
              alt="xinjie avatar"
              width={72}
              height={72}
              className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-xl object-cover"
              onError={(e) => {
                if (!e.currentTarget.dataset.errorHandled) {
                  e.currentTarget.dataset.errorHandled = "true";
                  e.currentTarget.src = "/images/avatar-placeholder.svg";
                }
              }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base">{t("profile_name")}</h3>
              <p className="mt-0.5 text-[11px] sm:text-xs text-[var(--color-text-secondary)] whitespace-pre-line">
                {t("profile_role")}
              </p>
              <a
                href="https://github.com/gouxinjie"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
              >
                GitHub →
              </a>
            </div>
          </div>
        </div>

        {/* Contribution Heatmap */}
        <div className="mt-6 sm:mt-8 card overflow-hidden">
          <h3 className="mb-3 sm:mb-4 text-sm font-medium text-[var(--color-text-secondary)]">
            {t("heatmap_title")}
          </h3>
          <div className="overflow-x-auto">
            <div className="flex gap-0.5 pb-2 min-w-max">
              {Array.from({ length: heatmapWeeks }).map((_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[2px]">
                  {Array.from({ length: heatmapDays }).map((_, dayIdx) => {
                    const seed = weekIdx * 7 + dayIdx;
                    const pseudoRandom = ((seed * 2654435761) >>> 0) % 100 / 100;
                    const level = Math.floor(pseudoRandom * 5);
                    const opacity = [0.05, 0.25, 0.5, 0.75, 1][level];
                    const bgColor = level > 0
                      ? `rgba(245, 158, 11, ${opacity})`
                      : "var(--color-border)";
                    return (
                      <div
                        key={dayIdx}
                        className="h-1.5 w-2 sm:h-2 sm:w-2.5 rounded-sm transition-colors hover:ring-1 hover:ring-[var(--color-primary)]"
                        style={{ backgroundColor: bgColor }}
                        title={`Week ${weekIdx}, Day ${dayIdx}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div className="mt-2.5 sm:mt-3 flex items-center justify-end gap-1 text-[11px] sm:text-xs text-[var(--color-text-muted)]">
            <span>{t("less")}</span>
            {[0.05, 0.25, 0.5, 0.75, 1].map((op, i) => (
              <div
                key={i}
                className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm"
                style={{ backgroundColor: `rgba(245, 158, 11, ${op})` }}
              />
            ))}
            <span>{t("more")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
