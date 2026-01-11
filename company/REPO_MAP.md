# REPO MAP (v1.0) — How the Company Understands Any Repository
# 仓库地图（v1.0）— 公司如何“读懂任何 repo”

> Immutable repo-understanding framework.
> 纲领性文件（定死）：这是“认知方法”，不是项目目录说明。项目具体目录由后续侦察产出。

---

## 1) Principle / 原则 🔍

**English**
Never guess the repo. Always map it by inspection.
If a folder is empty, explicitly declare it empty.

**中文**
不得臆测 repo。必须通过阅读建立地图。  
空目录必须明确声明为空。

---

## 2) What a repo map must include / Repo 地图必须包含 🗺️

**English**
A valid repo map answers:
- entry points (how to run),
- build system (how to build),
- test system (how to test),
- deployment surface (where/what deploys),
- data surface (where data is stored),
- secrets surface (where secrets are referenced),
- critical modules and interfaces,
- known weak points (flaky tests, fragile areas).

**中文**
一份合格的 repo 地图必须回答：
- 入口（怎么跑）
- 构建系统（怎么 build）
- 测试系统（怎么 test）
- 部署面（部署在哪里/什么被部署）
- 数据面（数据存在哪里）
- 密钥面（密钥在哪里被引用）
- 关键模块与接口
- 薄弱点（flaky/脆弱区域）

---

## 3) Discovery procedure / 识别流程（固定）🧭

**English**
1) List top-level dirs and key config files.
2) Locate package/build descriptors.
3) Find run scripts and environment config patterns.
4) Find test configs and minimal test command.
5) Identify storage and migrations.
6) Identify deployment configs (CI/CD, hosting).
7) Summarize into a repo map artifact.

**中文**
1）列出顶层目录与关键配置  
2）定位包管理/构建描述文件  
3）找到运行脚本与环境配置方式  
4）找到测试配置与最小测试命令  
5）识别存储与迁移  
6）识别部署配置（CI/CD/托管）  
7）汇总成 repo 地图产物

---

## 4) Output artifact / 输出产物 📄

**English**
The Company will generate a project-specific map later (not this file).
This file defines the method only.

**中文**
项目专属的 repo 地图将由后续侦察生成（不在本文件里）。
本文件只定义方法论。

