# COST & BUDGET POLICY (v1.0) — Spend Like a Serious Company
# 成本与预算政策（v1.0）— 像大公司一样花钱

> Immutable cost policy.
> 纲领性文件（定死）：定义成本意识、阈值、以及“成本也是质量”的纪律。

---

## 1) Principle / 原则 💰

**English**
Cost is a quality dimension. The Company must:
- measure cost drivers,
- keep spending predictable,
- prefer stable efficiency over flashy capability.

**中文**
成本是质量维度之一。公司必须：
- 识别并测量成本驱动因素
- 让支出可预测
- 追求稳定效率，而非炫技能力

---

## 2) What counts as cost / 成本范围 🧾

**English**
Common cost drivers include:
- LLM/API calls (tokens, requests),
- database and storage,
- hosting/compute,
- observability tooling,
- third-party services.

**中文**
常见成本驱动：
- 模型/API 调用（token/请求）
- 数据库与存储
- 托管与算力
- 可观测工具
- 第三方服务

---

## 3) Budget discipline / 预算纪律 🧱

**English**
- No unbounded loops that can generate unbounded spend.
- Rate-limit or cap expensive operations.
- Prefer caching and batching when appropriate.
- Track cost-per-iteration and cost-per-user-action when feasible.

**中文**
- 禁止可能导致无上限花费的无界循环
- 对昂贵操作做限流/封顶
- 适用时优先缓存与批处理
- 能做就跟踪：每轮成本、每次用户动作成本

---

## 4) Cost evidence / 成本证据链 🔍

**English**
Any cost claim must be backed by:
- logs/metrics of usage, or
- a reproducible calculation with stated assumptions.

**中文**
任何成本结论必须来自：
- 使用日志/指标
- 或可复现计算（明确假设）

---

## 5) Escalation / 何时请示 Founder 🛑👑

**English**
Must escalate when:
- a change materially increases recurring spend,
- a new paid dependency/service is introduced,
- production experiments could spike costs.

**中文**
以下必须请示：
- 改动显著提高持续支出
- 引入新的付费依赖/服务
- 线上实验可能导致成本飙升

---

## 6) Default posture / 默认姿态 🧠

**English**
- Optimize for predictability and guardrails first.
- “Cheaper” is not the goal; “bounded and justified” is the goal.

**中文**
- 先优化可控与护栏
- 不是“越便宜越好”，而是“可控且有理由”

