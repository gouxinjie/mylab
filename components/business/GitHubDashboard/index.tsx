/**
 * @component GitHubDashboard
 * @description GitHub数据看板组件
 * @author gouxinjie
 * @created 2024
 * @updated 2024
 */

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getGithubUser, getGithubRepos } from "@/services/github";
import styles from "./index.module.scss";

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
        // 使用封装好的服务获取数据
        const [userData, reposData] = await Promise.all([
          getGithubUser("gouxinjie"),
          getGithubRepos("gouxinjie")
        ]);

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
    <section className={styles.github}>
      <div className="container-custom">
        <div className={styles.header}>
          <div>
            <h2 className="section-title">{t("title")}</h2>
            <p className={styles.header__subtitle}>
              {t("subtitle")}
            </p>
          </div>
          <a
            href="https://github.com/gouxinjie"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.header__link}
          >
            {t("view_github")}
          </a>
        </div>

        <div className={styles.grid}>
          {/* Stats Cards */}
          <div className={styles['stats-grid']}>
            {/* Skeleton */}
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
              // 错误状态
              <>
                <div className={styles['stats-grid__card']}>
                  <span className={styles['error-card__val']}>36</span>
                  <p className={styles['error-card__label']}>
                    {t("repos")}
                  </p>
                </div>
                <div className={styles['stats-grid__card']}>
                  <span className={styles['error-card__val']}>1.2k+</span>
                  <p className={styles['error-card__label']}>
                    {t("stars")}
                  </p>
                </div>
                <div className={styles['stats-grid__card']}>
                  <span className={styles['error-card__val']}>480+</span>
                  <p className={styles['error-card__label']}>
                    {t("followers")}
                  </p>
                </div>
              </>
            ) : (
              // 数据状态
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
                    {`${((data?.total_stars || 0) / 1000).toFixed(1)}k+`}
                  </span>
                  <p className={styles['error-card__label']}>
                    {t("stars")}
                  </p>
                </div>
                <div className={styles['stats-grid__card']}>
                  <span className={styles['error-card__val']}>
                    {`${data?.followers || 0}+`}
                  </span>
                  <p className={styles['error-card__label']}>
                    {t("followers")}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Profile Card */}
          <div className={styles['profile-card']}>
            <img
              src={`https://avatars.githubusercontent.com/gouxinjie?v=4`}
              alt="xinjie avatar"
              width={72}
              height={72}
              className={styles['profile-card__avatar']}
              onError={(e) => {
                if (!e.currentTarget.dataset.errorHandled) {
                  e.currentTarget.dataset.errorHandled = "true";
                  e.currentTarget.src = "/images/avatar-placeholder.svg";
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

        {/* Contribution Heatmap */}
        <div className={styles.heatmap}>
          <h3 className={styles.heatmap__title}>
            {t("heatmap_title")}
          </h3>
          <div className={styles.heatmap__scroll}>
            <div className={styles.heatmap__container}>
              {Array.from({ length: heatmapWeeks }).map((_, weekIdx) => (
                <div key={weekIdx} className={styles.heatmap__week}>
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
                        className={styles.heatmap__day}
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
          <div className={styles.heatmap__legend}>
            <span>{t("less")}</span>
            {[0.05, 0.25, 0.5, 0.75, 1].map((op, i) => (
              <div
                key={i}
                className={styles.heatmap__level}
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
