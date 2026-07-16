---
title: 什么是 MCP 协议
slug: mcp
updated: 2026-07-15
---

# 什么是 MCP 协议

## 定义

**MCP（Model Context Protocol，模型上下文协议）**是一套开放标准，用于规范大语言模型（或 AI 应用）与外部数据源、工具之间的连接方式。可以把它理解为 **"AI 世界的 USB-C 接口"**——统一的插口，让模型能即插即用地接入各种能力。

## 解决了什么问题

在 MCP 出现之前，每接入一个工具（数据库、文件系统、第三方 API），都要写一套定制的对接代码。工具越多，维护成本越高，形成 **M×N 的集成难题**。

MCP 把它简化为 **M+N**：

- 工具方只需实现一次 **MCP Server**
- AI 应用只需实现一次 **MCP Client**
- 两者通过统一协议通信

## 核心概念

| 概念 | 说明 |
| --- | --- |
| MCP Host | 运行 AI 的宿主应用（如 IDE、桌面客户端） |
| MCP Client | 宿主内负责与 Server 通信的模块 |
| MCP Server | 对外暴露能力的服务 |
| Tools | Server 提供的可调用函数 |
| Resources | Server 提供的可读取数据 |
| Prompts | Server 预置的提示词模板 |

## 通信方式

```text
Host(Client)  ⇄  MCP Server
        标准化的 JSON-RPC 消息
     （支持 stdio / SSE 等传输方式）
```

> MCP 的意义：**让 AI 与外部世界的连接标准化、可复用、可组合。**
