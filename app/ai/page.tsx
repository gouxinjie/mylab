import { Metadata } from "next";
import { aiTools } from "@/lib/data";

export const metadata: Metadata = {
  title: "AI 探索",
  description: "xinjie 在 AI 领域的探索 — 大语言模型、RAG、Agent、Prompt Engineering",
};

export default function AIPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">AI 探索</h1>
          <p className="mt-2 max-w-xl text-[var(--color-text-secondary)]">
            探索人工智能的边界，将 LLM、RAG、Agent 等技术融入实际产品中。
          </p>
        </div>

        {/* AI Projects */}
        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold">AI 项目</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "AI Chat Hub",
                desc: "多模型聚合对话平台，支持 OpenAI / Dify / 自定义模型，内置 RAG 检索增强",
                tags: ["React", "OpenAI", "Dify", "RAG"],
              },
              {
                title: "Dify Workflow Builder",
                desc: "基于 Dify 的可视化工作流编排器，拖拽式构建复杂 AI Agent",
                tags: ["Dify", "LangChain", "TypeScript"],
              },
            ].map((project) => (
              <article key={project.title} className="card group">
                <div className="mb-3 h-40 rounded-lg bg-gradient-to-br from-blue-900 to-purple-800 flex items-center justify-center text-white/20">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 8V4H8" /><rect x="4" y="8" width="10" height="8" rx="1"/>
                    <circle cx="18" cy="11" r="2"/><path d="M15 14l3 3"/><path d="M19 17a2 2 0 100 4 2 2 0 000-4z"/>
                  </svg>
                </div>
                <h3 className="font-semibold">{project.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-3">
                  {project.desc}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* AI Tool Stack */}
        <section>
          <h2 className="mb-6 text-lg font-semibold">AI 工具栈</h2>
          <div className="flex flex-wrap gap-3">
            {aiTools.map((tool) => (
              <span
                key={tool.name}
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-sm transition-all hover:border-[var(--color-primary)] hover:shadow-md"
              >
                {tool.name}
                <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-500 transition-colors group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary-dark)]">
                  {tool.category}
                </span>
              </span>
            ))}
          </div>
        </section>

        {/* Blog Articles Index */}
        <section className="mt-16">
          <h2 className="mb-6 text-lg font-semibold">AI 相关文章</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            从博客中精选的 AI 技术文章
          </p>
          <div className="space-y-3">
            {[
              { title: "从零搭建 RAG 知识库系统", date: "2024-03", readTime: "15 min" },
              { title: "Dify 工作流实战：构建智能客服 Agent", date: "2024-02", readTime: "20 min" },
              { title: "Prompt Engineering 最佳实践指南", date: "2024-01", readTime: "12 min" },
            ].map((article) => (
              <a
                key={article.title}
                href={`https://blog.gouxinjie.com?q=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-[var(--color-border)] p-4 transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)]"
              >
                <div>
                  <h3 className="text-sm font-medium">{article.title}</h3>
                  <span className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {article.date} · {article.readTime}
                  </span>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-0.5"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
