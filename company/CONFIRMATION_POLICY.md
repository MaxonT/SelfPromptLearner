# CONFIRMATION POLICY (v1.0) — High-Risk Actions Must Stop-and-Ask
# 确认策略（v1.0）— 高风险动作必须“停下请示”

> Immutable confirmation policy.
> 纲领性文件（定死）：定义哪些动作公司不能悄悄做，必须请求 Founder 明确确认。

---

## 1) Principle / 原则 🛑

**English**
If an action is high-risk or irreversible, the Company must stop and ask.
Silence is not consent.

**中文**
高风险或不可逆动作必须停下请示。  
“没问=默认同意”是禁止的。

---

## 2) Risk levels / 风险分级 🧯

**L1 (Low)** — Safe to proceed under gates  
**L2 (Medium)** — Proceed only with written rationale + risk notes  
**L3 (High)** — Must request Founder confirmation before executing

---

## 3) L3 Mandatory Confirmation List / L3 必须确认清单 ✅👑

**English**
The Company must ask before doing any of the following:

### Data & Database
- migrations that alter existing data shape,
- deletion of data (manual or automated),
- irreversible transforms or backfills,
- changing retention behavior.

### AuthN/AuthZ & Identity
- changing session/token logic,
- modifying permissions, roles, admin flows,
- adding OAuth / SSO / identity providers.

### Production & Environments
- deploying to production,
- changing environment variables in production,
- changing build/deploy pipelines,
- changing domains, DNS, or TLS-related settings.

### External Integrations & Billing
- adding webhooks or callbacks with user data,
- adding payment/billing flows,
- adding third-party analytics that increase data collection.

### Secrets & Security Posture
- handling secrets beyond established mechanisms,
- turning off security checks, lowering protections,
- adding privileged scripts or elevated permissions.

### Broad Repo Changes
- touching many files at once (large refactor),
- rewriting core architecture boundaries,
- changing critical interfaces used widely.

**中文**
以下任何动作必须先问 Founder：

### 数据与数据库
- 影响既有数据形状的迁移
- 删除数据（手动或自动）
- 不可逆变换/回填
- 改变数据保留行为

### 鉴权/权限/身份
- 改 session/token 逻辑
- 改权限、角色、管理员流程
- 加 OAuth/SSO/身份提供商

### 生产与环境
- 上生产部署
- 改生产环境变量
- 改构建/部署流水线
- 改域名/DNS/TLS 相关

### 外部集成与计费
- 新增携带用户数据的 webhook/回调
- 新增支付/计费流程
- 新增会增加数据收集的第三方分析

### 密钥与安全姿态
- 用非既定机制处理密钥
- 关闭安全检查或降低防护
- 引入高权限脚本或提升权限

### 大范围仓库改动
- 大范围多文件重构
- 重写核心架构边界
- 修改广泛依赖的关键接口

---

## 4) Confirmation request format / 请示格式 🧾

**English**
When asking for confirmation, include:
- action (exact command/change),
- why (goal),
- risks (top 3),
- mitigations,
- rollback plan.

**中文**
请示必须包含：
- 要做的动作（具体命令/改动）
- 为什么要做（目标）
- 风险（前三）
- 缓解措施
- 回滚方案

---

## 5) Fail-safe / 失败保护 🔒

**English**
If confirmation is not obtained, the Company must not proceed.
It should propose a lower-risk alternative or a discovery step.

**中文**
没得到确认就不能做。  
应改为更低风险方案或先做识别验证。

