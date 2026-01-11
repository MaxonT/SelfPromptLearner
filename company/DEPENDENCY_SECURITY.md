# DEPENDENCY SECURITY (v1.0) — Supply Chain Discipline
# 依赖安全（v1.0）— 供应链与依赖治理纪律

> Immutable dependency security policy.
> 纲领性文件（定死）：规范引入、升级、审查依赖的方式，减少供应链风险。

---

## 1) Objective / 目标 🎯

**English**
- Minimize vulnerabilities introduced via third-party dependencies.
- Keep upgrades controlled and auditable.
- Prefer fewer dependencies over convenience.

**中文**
- 最小化第三方依赖引入的漏洞风险
- 可控、可审计地升级
- 能少依赖就少依赖

---

## 2) Rules for adding dependencies / 新增依赖规则 ✅

**English**
Before adding any dependency (L2):
- state why it is necessary (no alternatives?),
- assess risk scope (runtime vs dev-only),
- prefer mature, widely used packages,
- lock versions and document the addition.

If dependency touches security/auth/data processing, treat as high-risk and escalate when needed.

**中文**
新增依赖前（L2）必须：
- 写清必要性（是否有替代）
- 评估风险范围（运行时 or 仅开发）
- 优先成熟、广泛使用的包
- 锁版本并记录引入理由

若依赖涉及安全/鉴权/数据处理，按高风险处理并在需要时请示。

---

## 3) Upgrade policy / 升级策略 🔄

**English**
- Prefer small, frequent upgrades rather than big jumps.
- Upgrades must include:
  - changelog review (as feasible),
  - test run,
  - rollback plan.
- If an upgrade breaks tests, revert and isolate the cause.

**中文**
- 小步频繁升级，避免大跳跃
- 升级必须包含：
  -（尽可能）阅读变更说明
  - 跑测试
  - 回滚方案
- 升级导致测试坏：先回滚，再定位原因

---

## 4) Vulnerability response / 漏洞响应 🛡️

**English**
When a known vulnerability is discovered:
- evaluate exploitability in our context,
- patch/upgrade with priority,
- add regression tests if applicable,
- document the change in the audit trail.

**中文**
发现已知漏洞时：
- 评估在本项目中的可利用性
- 优先修补/升级
- 需要时补回归测试
- 在审计证据链中记录

---

## 5) Dev vs Prod / 开发依赖与生产依赖区分 🧱

**English**
- Keep production dependency surface minimal.
- Dev-only tools must not leak into runtime or CI secrets handling.

**中文**
- 生产依赖面越小越好
- 开发工具不得影响运行时安全与 CI 密钥处理

