---
title: Agent Skills
slug: agent-skills
updated: 2026-07-15
---

# Agent Skills

## 什么是 Agent Skills

**Agent Skills（智能体技能）**是为 AI Agent 扩展的、领域特定的能力包。每个 Skill 通常包含：

- **领域知识**：某个专业领域的背景与最佳实践
- **标准流程（SOP）**：完成某类任务的固定步骤
- **可执行工具/脚本**：辅助 Agent 高效完成任务

可以把 Skill 理解为给 Agent "安装的插件"——需要时加载，用完即走。

## 为什么需要 Skills

通用大模型什么都懂一点，但面对特定任务时往往不够专业、不够稳定。Skills 通过注入专门的知识与流程，让 Agent 在垂直场景中表现得像"专家"。

## Skill 的典型结构

```text
skill-name/
├── SKILL.md        技能说明与触发条件
├── scripts/        可执行脚本
└── assets/         模板、示例等资源
```

## 何时加载 Skill

一个设计良好的 Skill 会声明触发条件，例如：

- 任务涉及特定文件格式（PDF、Excel 等）
- 任务属于某个专业领域
- 使用该 Skill 能显著提升正确率或效率

```text
用户："帮我处理这个 xlsx 文件"
  ↓ 命中 Excel 相关 Skill 的触发条件
  ↓ 加载 Skill，按其 SOP 执行
```

## 与工具调用的关系

- **工具（Tool）**：单个原子能力，如"执行代码"
- **Skill**：一组知识 + 流程 + 工具的**组合封装**，面向完整任务

> 一句话：**Tool 是零件，Skill 是把零件组装好的"专业工具箱"。**
