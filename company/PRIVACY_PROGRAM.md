# PRIVACY PROGRAM (v1.0) — Privacy as Product Behavior, Not Just Text
# 隐私治理总纲（v1.0）— 隐私是产品行为，不是文案

> Immutable privacy program.
> 纲领性文件（定死）：定义公司对数据的基本伦理与工程化要求。

---

## 1) Objective / 目标 🎯

**English**
Build user trust by:
- collecting the minimum data needed,
- making data handling explicit and controllable,
- enabling deletion/export,
- minimizing retention,
- preventing accidental exposure.

**中文**
通过以下方式建立信任：
- 数据最小化
- 数据处理显式可控
- 支持删除/导出
- 最小保留
- 防止意外暴露

---

## 2) Privacy principles / 隐私原则 🧼

**English**
- **Data minimization**: do not collect what you don’t need.
- **Purpose limitation**: use data only for stated purposes.
- **User control**: export/delete where applicable.
- **Least retention**: retain only as long as needed.
- **Safe logging**: redact PII, avoid sensitive payloads.

**中文**
- **最小化**：不需要就不收集
- **目的限制**：只用于声明用途
- **用户控制**：能导出就导出，能删除就删除
- **最小保留**：只保留必要时间
- **安全日志**：脱敏 PII，避免记录敏感内容

---

## 3) Data mapping requirement / 数据地图要求 🗺️

**English**
For any feature touching data, the Company must be able to answer:
- what data is collected,
- where it is stored,
- how long it is retained,
- who can access it,
- how it is deleted/exported.

**中文**
任何涉及数据的功能，公司必须回答：
- 收集什么
- 存哪里
- 保留多久
- 谁能访问
- 如何删除/导出

---

## 4) Privacy gate / 隐私闸门 ✅

**English**
No shipping if privacy impact is unknown.
Any increase in data collection/retention/logging is L3: must escalate to Founder.

**中文**
隐私影响不清楚 → 禁止发布  
增加数据收集/保留/日志 → L3 必须请示 Founder

---

## 5) Logging redaction baseline / 日志脱敏基线 🧽

**English**
- Never log secrets.
- Avoid logging raw user content unless strictly necessary and justified.
- Prefer structured logs with redacted fields.

**中文**
- 不记录密钥
- 不记录原始用户内容（除非必要且有理由）
- 优先结构化日志 + 字段脱敏

