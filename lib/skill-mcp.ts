/**
 * @file skill-mcp.ts
 * @description Skill / MCP（AI 生态能力资产）数据与类型定义
 * @author gouxinjie
 * @created 2026-08-14
 */

import type { LocalizedText } from "@/lib/projects";

/** 能力类型（区别于「Web 项目」，突出 npm 包 / 技能 / 服务形态） */
export type SkillMcpType = "skill" | "mcp";

/**
 * 单个 Skill / MCP 条目
 * @description 面向 npm 包 / Skill / MCP Server 这类「能力资产」，不含部署路径、端口等 Web 项目专属字段
 */
export interface SkillMcpItem {
  /** 作品唯一标识（通常为仓库名） */
  id: string;
  /** 作品名称（npm 包名，专有名词，不翻译） */
  name: string;
  /** 能力类型：skill（技能）/ mcp（MCP 服务） */
  type: SkillMcpType;
  /** 一句话简介（双语） */
  brief: LocalizedText;
  /** 详细描述（双语） */
  description: LocalizedText;
  /** GitHub 仓库地址 */
  repoUrl: string;
  /** npm 包名（用于生成安装命令与徽章，可选） */
  npmPackage?: string;
  /** 安装命令（如 `npx xinjie-review`、`npm i -g xinjie-review`） */
  installCmd: string;
  /** 技术标签（技术名词不翻译） */
  tags: string[];
  /** 排序权重（数值越小越靠前） */
  order: number;
  /** 品牌强调色（卡片类型徽章、标签、复制按钮等） */
  accent: string;
}

/**
 * Skill / MCP 能力资产清单
 * @description 集中维护我发布的 Skill 与 MCP 能力资产，供「Skill/MCP」模块展示
 */
export const skillMcpItems: SkillMcpItem[] = [
  {
    id: "xinjie-review",
    name: "xinjie-review",
    type: "skill",
    brief: {
      zh: "CodeBuddy 全能代码与文档审查技能",
      en: "All-in-one Code & Document Review Skill for CodeBuddy",
    },
    description: {
      zh: "一个 CodeBuddy 技能（Skill），提供系统性的代码与文档质量审查能力。覆盖前端、后端、CSS 样式、Markdown 文档、流程图与依赖安全等维度，输出结构化分级审查报告（阻断 / 严重 / 建议 / 风格），并支持基于 git diff 的 PR/MR 审查结论。",
      en: "A CodeBuddy skill providing systematic code and document quality review. It covers frontend, backend, CSS, Markdown, flowcharts and dependency security, producing a structured graded review report (Blocker / Critical / Suggestion / Style), with PR/MR review conclusions based on git diff.",
    },
    repoUrl: "https://github.com/gouxinjie/review-skill",
    npmPackage: "xinjie-review",
    installCmd: "npm i -g xinjie-review",
    tags: ["CodeBuddy", "Skill", "审查", "Node.js"],
    order: 0,
    accent: "#10B981",
  },
  {
    id: "local-time-mcp",
    name: "local-time-mcp",
    type: "mcp",
    brief: {
      zh: "本地时间 MCP Server（MCP 协议学习范本）",
      en: "Local-time MCP Server (a learning reference for the MCP protocol)",
    },
    description: {
      zh: "一个用于学习和测试 MCP（Model Context Protocol）协议的入门级 Node.js MCP Server，提供 4 个时间相关工具：获取当前时间、格式化时间、计算时间差、列出时区。完整演示了 MCP Server 从编写到发布 npm 再到配置到 AI 助手的全流程。",
      en: "An entry-level Node.js MCP Server for learning and testing the Model Context Protocol, offering 4 time-related tools: get current time, format time, calculate time difference, and list timezones. It fully demonstrates the journey from authoring, publishing to npm, and configuring into an AI assistant.",
    },
    repoUrl: "https://github.com/gouxinjie/local-time-mcp",
    npmPackage: "local-time-mcp-server",
    installCmd: "npx local-time-mcp-server@latest",
    tags: ["MCP", "Node.js", "stdio", "时间工具"],
    order: 1,
    accent: "#3B82F6",
  },
];

/** 能力类型的展示配置（类型徽章文案），供组件渲染 */
export const skillMcpTypeMeta: Record<SkillMcpType, { label: LocalizedText }> = {
  skill: {
    label: { zh: "Skill", en: "Skill" },
  },
  mcp: {
    label: { zh: "MCP Server", en: "MCP Server" },
  },
};
