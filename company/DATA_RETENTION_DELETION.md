# DATA RETENTION & DELETION (v1.0) — Keep Less, Delete Reliably
# 数据保留与删除（v1.0）— 少留、可删、可证明

> Immutable data retention & deletion policy.
> 纲领性文件（定死）：把隐私原则工程化为“保留期限、删除能力、可证明”。

---

## 1) Principle / 原则 🧼

**English**
- Retain the minimum data for the minimum time.
- Deletion must be implementable, verifiable, and auditable.
- “We can delete” must mean: deletion actually happens in storage, not just UI.

**中文**
- 最小数据、最短时间
- 删除必须可实现、可验证、可审计
- “可删除”必须意味着底层存储真实删除，而不是 UI 假删

---

## 2) Required capabilities / 必备能力 ✅

**English**
When the product stores user data, the Company must support:
- delete user data (by user request),
- export user data (when applicable),
- define and enforce retention windows,
- redact logs and backups as feasible.

**中文**
只要产品存用户数据，公司必须支持：
- 用户数据删除
- 用户数据导出（适用时）
- 定义并执行保留期限
- 日志与备份尽可能脱敏/清理

---

## 3) Retention defaults / 默认保留策略 🕒

**English**
If retention is not explicitly required:
- default to short retention,
- prefer aggregated metrics over raw content,
- keep identifiers minimal.

**中文**
如果业务不要求长期保留：
- 默认短保留
- 指标优先于原始内容
- 标识符最小化

---

## 4) Deletion definition / 删除的定义 🔥

**English**
Deletion means:
- remove primary records,
- remove secondary indexes/derived tables where applicable,
- invalidate caches,
- ensure exports are consistent with deletion.

If full deletion is infeasible, document the limitation and require Founder sign-off.

**中文**
删除必须包括：
- 主记录删除
-（适用时）派生表/索引清理
- 缓存失效
- 导出结果与删除一致

若无法完全删除，必须记录限制并请示 Founder。

---

## 5) Auditability / 可审计性 📚

**English**
Each data-related feature must keep a data map:
- what data,
- where stored,
- retention window,
- deletion path,
- verification step.

**中文**
每个数据相关功能必须有数据地图：
- 收集什么
- 存哪里
- 保留多久
- 怎么删
- 怎么验证删了

