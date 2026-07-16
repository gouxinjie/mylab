---
title: 前端专用 AGENTS.md 模板
slug: agents-md-frontend
updated: 2026-07-15
---

# 前端专用 AGENTS.md 模板

下面是一份可直接复用的前端项目 AGENTS.md 模板，覆盖类型安全、代码风格、目录结构等常见约束。

## 模板内容

```markdown
# 前端开发规范（React / Vue3）

## 一、代码规范
- 必须使用 TypeScript，禁止使用 any
- 遵循 ESLint 规则，禁止使用 eslint-disable
- React 使用函数组件 + Hooks，禁止 class 组件
- Vue 统一使用 <script setup lang="ts"> 组合式 API
- 禁止 ../../ 相对路径，统一使用 @/ 别名

## 二、样式规范
- 优先使用 SCSS，组件样式必须 scoped
- 命名遵循 BEM，className 语义化
- SCSS 嵌套不超过 3 层

## 三、组件规范
- 公共组件放在 components/commons，独立文件夹
- 每个组件必须有头部注释（组件名、描述、作者）
- Props 必须定义类型并写注释

## 四、状态管理
- React 优先使用 Zustand，Vue 使用 Pinia（Setup Store）
- 禁止滥用全局状态

## 五、性能规范
- 列表必须使用稳定 key，禁止用 index
- 合理使用 useMemo / useCallback / computed
- 路由组件支持懒加载，图片资源懒加载
```

## 使用建议

1. 把上述内容保存为项目根目录的 `AGENTS.md`
2. 根据团队实际情况增删条目
3. 越具体的规则，AI 遵循得越好（例如给出正确/错误示例）

> 建议为关键规则补充"正例 / 反例"，AI 的还原度会明显更高。
