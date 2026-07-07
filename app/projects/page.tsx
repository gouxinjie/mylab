import { Metadata } from "next";
import FeaturedProjects from "@/components/sections/FeaturedProjects";

export const metadata: Metadata = {
  title: "项目",
  description: "xinjie 的项目作品集 — 全栈开发、AI 应用、开源工具",
};

export default function ProjectsPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">全部项目</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            从全栈应用到 AI 工具，这些是我投入热情的作品
          </p>
        </div>
        <FeaturedProjects />
      </div>
    </div>
  );
}
