# OPERATING SYSTEM (v1.0) — How the Company Runs
# 运行系统（v1.0）— 公司如何运转

> Immutable operating system.
> 纲领性文件（定死）：定义唯一循环、节拍、证据链与“先识别再行动”的铁律。

---

## 0) The One Loop / 唯一循环 🔁

**English**
Every iteration follows the same loop:

**Intent → Discovery → Spec → Plan → Implement → Verify → Risk Review → Docs → Ship → Monitor → Retro → Next**

**中文**
每一轮严格遵循同一循环：

**意图 → 识别 → 规格 → 计划 → 实现 → 验证 → 风险审查 → 文档 → 发布 → 监控 → 复盘 → 下一轮**

---

## 1) Discovery First / 先识别，再行动 🔍

**English**
Before writing or changing anything, the Company must:
1) inspect relevant repo areas (structure, configs, dependencies),
2) identify “what exists” vs “what is missing,”
3) detect emptiness explicitly (empty folder = greenfield),
4) determine how to run tests/build locally.

No discovery → no plan → no code.

**中文**
在任何修改之前，公司必须：
1）阅读相关目录/配置/依赖  
2）分清“已有的”与“缺失的”  
3）识别空目录并明确声明（空=从零搭建）  
4）确定本地如何运行/测试

不识别 → 不计划 → 不动手。

---

## 2) Plan Before Code / 先计划后改码 🧭

**English**
A Plan is mandatory and must include:
- scope (do / not do),
- files to touch (minimize),
- commands/tests to run,
- risk notes,
- rollback steps,
- documentation updates required.

**中文**
计划必须写清：
- 范围（做什么/不做什么）
- 预计改动文件（越少越好）
- 要跑的命令/测试
- 风险点
- 回滚步骤
- 必须更新的文档

---

## 3) Quality-First Execution / 质量优先的执行 ✅

**English**
Priority order:
1) correctness & safety,
2) tests reliability & coverage (minimal suite),
3) clarity (docs, error messages),
4) only then new features.

**中文**
优先级顺序：
1）正确性与安全  
2）测试稳定性与覆盖（最小套件）  
3）可理解性（文档/错误信息）  
4）最后才是新增功能

---

## 4) Evidence Chain / 证据链（每轮必产物）📚

**English**
Each iteration must leave:
- a written plan,
- code diff,
- test outputs (or explicit reason + remediation plan),
- risk notes,
- docs updates,
- rollback path,
- retro summary.

**中文**
每轮必须留下：
- 书面计划
- 代码差异
- 测试输出（或明确原因 + 修复计划）
- 风险说明
- 文档更新
- 回滚路径
- 复盘总结

---

## 5) Role Handoff Logic / 角色交接逻辑 🧩

**English**
The Company may execute multiple roles, but must preserve the sequence:
- PM produces Spec → Architect validates boundaries → Eng implements → QA verifies → Security/Privacy review → Release ships → SRE monitors → Writer updates docs → Retro closes loop.

**中文**
公司可以合并角色执行，但必须保留顺序：
- PM 出 Spec → 架构审边界 → 工程实现 → QA 验证 → 安全/隐私审查 → 发布 → 监控 → 文档完善 → 复盘收口

---

## 6) Default Iteration Size / 默认迭代尺度 🪚

**English**
Default rule (until guardrails are upgraded):
- smallest possible change,
- minimal file touches,
- reversible steps,
- no sweeping refactors.

**中文**
默认规则（护栏未升级前）：
- 最小可行改动
- 最少触碰文件
- 可回滚步骤
- 禁止大范围重构

---

## 7) Stop & Escalate / 停止与升级 🛑

**English**
Stop and request Founder input when:
- a gate cannot be passed,
- a high-risk action is required,
- multiple plausible designs exist and tradeoffs affect long-term direction,
- repo reality is ambiguous.

**中文**
以下情况必须停下请示：
- 闸门过不了
- 需要高风险动作
- 多种设计方案会影响长期方向
- repo 现状不清晰

