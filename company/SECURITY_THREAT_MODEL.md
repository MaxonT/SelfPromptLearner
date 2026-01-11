# SECURITY THREAT MODEL (v1.0) — The Company’s Default Security Thinking
# 威胁建模（v1.0）— 公司的默认安全思维框架

> Immutable security threat model framework.
> 纲领性文件（定死）：给 OpenHands 一个统一的“安全视角”，每轮安全审查都按此思考。

---

## 1) Goal / 目标 🎯

**English**
Reduce the probability and impact of security incidents by:
- minimizing attack surface,
- enforcing least privilege,
- making risky actions confirmable and auditable.

**中文**
降低安全事故概率与损失：
- 最小攻击面
- 最小权限
- 高风险动作可确认、可审计

---

## 2) What we protect / 保护对象 🛡️

**English**
Primary assets:
- user data (content, identifiers),
- authentication secrets/tokens,
- billing and external API keys,
- production environment integrity,
- repository integrity and CI/CD pipeline.

**中文**
核心资产：
- 用户数据（内容、标识）
- 鉴权密钥/令牌
- 计费与外部 API key
- 生产环境完整性
- 仓库与 CI/CD 完整性

---

## 3) Threat surface checklist / 威胁面清单 ✅

**English**
Always consider:
- **AuthN/AuthZ**: session handling, access control, privilege escalation
- **Input handling**: injection (SQL/command), deserialization, file uploads
- **Data exposure**: logs, error messages, debug endpoints, backups
- **Dependencies**: vulnerable packages, supply chain, typosquatting
- **CI/CD**: secret leakage in pipelines, insecure build scripts
- **External integrations**: webhooks, OAuth, callbacks, third-party APIs
- **Client-side**: XSS, CSRF, token storage, unsafe redirects

**中文**
必须覆盖：
- **鉴权/权限**：会话、访问控制、权限提升
- **输入处理**：注入、反序列化、文件上传
- **数据暴露**：日志/报错/调试端点/备份
- **依赖**：漏洞包、供应链、拼写投毒
- **CI/CD**：流水线泄密、不安全脚本
- **外部集成**：webhook/OAuth/回调/第三方 API
- **前端安全**：XSS/CSRF/token 存储/重定向

---

## 4) Default controls / 默认控制措施 🔐

**English**
- Least privilege by default.
- Safe-by-default configs.
- Validate and sanitize inputs at boundaries.
- Secrets never in code/logs; only via dedicated mechanism.
- High-risk actions require confirmation (stop-and-ask).
- Security review is a gate, not a suggestion.

**中文**
- 默认最小权限
- 默认安全配置
- 边界处校验与净化输入
- 密钥不进代码/日志，只走专门机制
- 高风险动作必须确认
- 安全审查是闸门，不是建议

---

## 5) Security evidence / 安全证据链 📚

**English**
Each iteration’s security review must record:
- what changed,
- which threat surfaces are impacted,
- mitigations added/verified,
- remaining risks (explicit).

**中文**
每轮安全审查必须记录：
- 改了什么
- 影响哪些威胁面
- 做了哪些缓解并如何验证
- 剩余风险（明确写出）

