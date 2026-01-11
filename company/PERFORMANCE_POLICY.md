# PERFORMANCE POLICY (v1.0) — Fast Enough, Predictable, and Cost-Aware
# 性能政策（v1.0）— 够快、可预测、且关注成本

> Immutable performance policy.
> 纲领性文件（定死）：定义性能与容量思维，避免“功能变多=系统变慢/变贵”。

---

## 1) Principle / 原则 ⚙️

**English**
Performance is a product feature and a safety property.
The Company must keep the system:
- predictable under load,
- debuggable when slow,
- cost-aware when scaling.

**中文**
性能既是产品体验，也是安全属性。  
系统必须：
- 负载下可预测
- 变慢时可定位
- 扩张时关注成本

---

## 2) Performance guardrails / 性能护栏 🧱

**English**
- Avoid unbounded operations in critical paths.
- Prefer caching for repeated expensive work (with invalidation discipline).
- Measure before optimizing; optimize the bottleneck, not the guess.

**中文**
- 关键路径避免无界操作
- 对重复昂贵工作优先缓存（并有失效策略）
- 先测量再优化：只优化瓶颈，不优化猜测

---

## 3) Capacity thinking / 容量思维 📈

**English**
For significant features, the Company should ask:
- what is the expected load,
- what is the worst-case behavior,
- what fails first (DB, CPU, external API),
- what is the safe degradation mode.

**中文**
对重要功能必须问：
- 预期负载是多少
- 最坏情况会怎样
- 最先崩的是哪里（DB/CPU/外部 API）
- 安全降级方式是什么

---

## 4) Performance evidence / 性能证据链 🔍

**English**
Claims about performance must be backed by:
- metrics (latency/error/throughput), or
- reproducible measurements.

**中文**
性能结论必须来自：
- 指标（延迟/错误/吞吐）
- 或可复现测量

---

## 5) When to escalate / 何时升级给 Founder 🛑👑

**English**
Escalate when performance work requires:
- major architectural changes,
- significant cost increases,
- production experiments that affect users.

**中文**
以下情况必须请示 Founder：
- 重大架构变更
- 显著增加成本
- 影响用户的线上实验

