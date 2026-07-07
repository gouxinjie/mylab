import { Metadata } from "next";
import { experiences, skills, socialLinks } from "@/lib/data";
import GitHubDashboard from "@/components/sections/GitHubDashboard";

export const metadata: Metadata = {
  title: "关于",
  description: "了解更多关于 xinjie — 全栈开发者、AI 探索者、开源爱好者",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">关于我</h1>
        </div>

        {/* Bio */}
        <section className="mb-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 sm:p-8">
          <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
            你好！我是 xinjie，一名热爱技术的全栈开发者和 AI 探索者。
          </p>
          <br />
          <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
            我专注于构建高质量的 Web 应用，从前端交互到后端架构都有涉猎。
            近年来投入大量时间在 AI 领域，探索大语言模型、RAG、Agent 等技术如何融入实际产品中。
            我相信代码的价值在于解决真实的问题，而 AI 是放大这种价值的有力工具。
          </p>
          <br />
          <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
            工作之余我喜欢通过开源项目分享所学，也乐于写技术博客记录踩坑经验。
            如果你对我的项目或想法感兴趣，欢迎随时联系我交流！
          </p>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="section-title mb-6">技术栈</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="mb-12">
          <h2 className="section-title mb-6">工作经历</h2>
          <div className="relative space-y-0 before:absolute before:left-3.5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-[var(--color-border)]">
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="relative pb-8 pl-10">
                <span
                  className={`absolute left-2 top-1 h-3 w-3 rounded-full border-2 ${
                    exp.current
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                      : "bg-[var(--color-bg)] border-[var(--color-border)]"
                  }`}
                  style={{ boxShadow: exp.current ? `0 0 0 4px var(--color-primary)/20` : "none" }}
                />
                <div className="card">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{exp.role}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">{exp.company}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-[var(--color-border)] px-3 py-0.5 text-xs text-[var(--color-text-muted)]">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GitHub Dashboard */}
        <GitHubDashboard />
      </div>
    </div>
  );
}
