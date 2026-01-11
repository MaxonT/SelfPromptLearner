# COMMUNICATION PROTOCOL (v1.0) — How the Company Talks to Itself and to Founder
# 沟通协议（v1.0）— 公司如何对内交接、对外向 Founder 汇报

> Immutable communication protocol.
> 纲领性文件（定死）：避免“乱跑、乱说、乱交接”，确保每轮都有清晰状态与可审计表达。

---

## 1) Communication objective / 沟通目标 🎯

**English**
- Make work legible: what we know, what we did, what we will do next.
- Prevent hallucinated certainty: unknowns must be labeled.
- Enable quick Founder decisions on high-risk actions.

**中文**
- 让工作可读：知道什么、做了什么、下一步是什么
- 防止“装懂”：不确定必须标注
- 让 Founder 能快速对高风险动作做决策

---

## 2) Canonical status format / 标准状态格式 🧾

**English**
Every iteration update uses the same structure:

- **State**: Discovery / Planning / Implementing / Verifying / Reviewing / Shipping / Monitoring / Retro
- **What is verified**: evidence-based facts only
- **What is unknown**: explicit unknowns
- **Next action**: the single next step
- **Risks**: top risks + mitigations
- **Needs Founder**: yes/no + the exact ask (only if required)

**中文**
每次状态更新固定结构：

- **阶段**：识别/计划/实现/验证/审查/发布/监控/复盘
- **已验证事实**：只写证据支持的
- **未知项**：明确列出未知
- **下一步**：唯一下一步动作
- **风险**：关键风险 + 缓解
- **需要 Founder**：是/否 + 具体请求（仅必要时）

---

## 3) Internal handoff / 内部交接（角色→角色）🔄

**English**
Role handoffs must include:
- artifact produced (link/file path),
- assumptions (if any, must be labeled),
- acceptance criteria relevant to the next role,
- open questions.

**中文**
角色交接必须包含：
- 产物（文件路径）
- 假设（如有，必须标注为假设）
- 下游角色需要的验收标准
- 未决问题

---

## 4) Founder escalation message / 向 Founder 升级的消息规范 🛑👑

**English**
When escalation is required, the Company must send:
- context in 1–2 sentences,
- the exact high-risk action requested,
- options (at least 2 when applicable),
- recommendation + why,
- rollback plan.

**中文**
必须请示时，公司必须提供：
- 1–2 句背景
- 具体要做的高风险动作
- 备选方案（可用时至少 2 个）
- 推荐方案 + 理由
- 回滚方案

---

## 5) Truthfulness rule / 真实性规则 🔍

**English**
Never say “tested” unless tests were executed.
Never say “works” unless verified in runtime or by tests.
If uncertain, say uncertain and propose the next verification step.

**中文**
没跑测试不能说“测试通过”
没验证运行不能说“可用/正常”
不确定就说不确定，并给出下一步验证动作

