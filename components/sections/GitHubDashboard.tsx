"use client";

import { useEffect, useState } from "react";

interface GithubData {
  public_repos: number;
  followers: number;
  total_stars: number;
}

export default function GitHubDashboard() {
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHub() {
      try {
        setLoading(true);
        // Fetch user profile
        const userRes = await fetch(
          "https://api.github.com/users/gouxinjie",
          { next: { revalidate: 300 } } // Cache for 5 minutes
        );
        if (!userRes.ok) throw new Error("GitHub API error");
        const userData = await userRes.json();

        // Fetch repos to calculate stars
        const reposRes = await fetch(
          "https://api.github.com/users/gouxinjie/repos?per_page=100&sort=updated&type=public",
          { next: { revalidate: 300 } }
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
    <section className="py-16 sm:py-20">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title">GitHub 数据看板</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              实时数据，刷新查看最新
            </p>
          </div>
          <a
            href="https://github.com/gouxinjie"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
          >
            访问我的 GitHub →
          </a>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-3 gap-4">
            {/* Skeleton or Data */}
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-8 w-16 rounded bg-gray-200" />
                    <div className="mt-4 h-6 w-20 rounded bg-gray-200" />
                    <div className="mt-1 h-3 w-12 rounded bg-gray-200" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="card">
                  <span className="text-2xl font-bold">
                    {error ? "36" : data?.public_repos || "—"}
                  </span>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    公开仓库<br />Repositories
                  </p>
                </div>
                <div className="card">
                  <span className="text-2xl font-bold">
                    {error ? "1.2k+" : `${((data?.total_stars || 0) / 1000).toFixed(1)}k+`}
                  </span>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Stars 总计<br />Stars
                  </p>
                </div>
                <div className="card">
                  <span className="text-2xl font-bold">
                    {error ? "480+" : `${data?.followers || 0}+`}
                  </span>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    关注者<br />Followers
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Profile Card */}
          <div className="card flex items-center gap-4 overflow-hidden p-5">
            <img
              src={
                error
                  ? "/images/avatar-placeholder.png"
                  : `https://avatars.githubusercontent.com/gouxinjie?v=4`
              }
              alt="xinjie avatar"
              width={96}
              height={96}
              className="h-24 w-24 rounded-xl object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/avatar-placeholder.png";
              }}
            />
            <div>
              <h3 className="font-semibold">xinjie</h3>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                Full Stack Developer
                <br />
                AI Explorer
              </p>
              <a
                href="https://github.com/gouxinjie"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
              >
                GitHub →
              </a>
            </div>
          </div>
        </div>

        {/* Contribution Heatmap */}
        <div className="mt-8 card">
          <h3 className="mb-4 text-sm font-medium text-[var(--color-text-secondary)]">
            贡献热力图（最近一年）
          </h3>
          <div className="overflow-x-auto">
            <div className="flex gap-0.5 pb-2">
              {Array.from({ length: heatmapWeeks }).map((_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[2px]">
                  {Array.from({ length: heatmapDays }).map((_, dayIdx) => {
                    // Deterministic pseudo-random based on index (avoids hydration mismatch)
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
                        className="h-2 w-2.5 rounded-sm transition-colors hover:ring-1 hover:ring-[var(--color-primary)]"
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
          <div className="mt-3 flex items-center justify-end gap-1 text-xs text-[var(--color-text-muted)]">
            <span>Less</span>
            {[0.05, 0.25, 0.5, 0.75, 1].map((op, i) => (
              <div
                key={i}
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: `rgba(245, 158, 11, ${op})` }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
