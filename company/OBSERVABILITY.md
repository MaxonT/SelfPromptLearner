# OBSERVABILITY (v1.0) — See the System, Don’t Guess
# 可观测性（v1.0）— 看见系统，而不是猜系统

> Immutable observability standards.
> 纲领性文件（定死）：定义日志/指标/告警的最低要求，支撑证据驱动的运维与复盘。

---

## 1) Principle / 原则 👀

**English**
If you can’t observe it, you can’t safely change it.
Observability reduces guesswork and accelerates reliable iteration.

**中文**
看不见，就无法安全改动。  
可观测性让迭代从“猜”变成“证据”。

---

## 2) Signals / 三类信号 📈

**English**
The Company prioritizes:
- **Logs**: structured, actionable, non-sensitive
- **Metrics**: latency, error rate, throughput, resource/cost
- **Alerts**: page-worthy only for real incidents; avoid noise

**中文**
公司优先建设：
- **日志**：结构化、可行动、不含敏感
- **指标**：延迟、错误率、吞吐、资源/成本
- **告警**：只对真实事故报警，避免噪声

---

## 3) Logging standards / 日志标准 🧾

**English**
- Structured logs preferred.
- Include: request id/correlation id when possible.
- Never log secrets or raw sensitive content by default.
- Errors must include context: where, what failed, next step.

**中文**
- 结构化日志优先
- 尽可能包含 request id/correlation id
- 默认不记录密钥/敏感原文
- 错误必须带上下文：位置/失败点/下一步

---

## 4) Metrics standards / 指标标准 📊

**English**
Minimum metrics targets:
- request latency (p50/p95),
- error rate,
- key operation throughput,
- queue/backlog (if any),
- cost signals (LLM/API calls) if applicable.

**中文**
最低指标：
- 请求延迟（p50/p95）
- 错误率
- 关键操作吞吐
- 队列/积压（如有）
- 成本信号（如模型/API 调用）

---

## 5) Alerting standards / 告警标准 🚨

**English**
- Alerts must be actionable.
- Prefer SLO-based alerts over raw thresholds.
- Track alert noise; reduce false positives.

**中文**
- 告警必须可执行
- 优先基于 SLO，而不是纯阈值
- 追踪告警噪声，降低误报

---

## 6) Observability is a gate / 可观测性也是闸门 ✅

**English**
If a change affects production behavior significantly, the Company must ensure adequate observability before shipping.

**中文**
若改动显著影响线上行为，必须先补足可观测性再发布。

