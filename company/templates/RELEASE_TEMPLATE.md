# RELEASE TEMPLATE (v1.0)
# 发布模板（v1.0）

> Use this template for every release candidate.
> 每次准备发布都必须填：它是“发布证据链”的收口。

---

## 1) Release summary / 发布概要

- Version/tag (if used):
- Scope:
- User impact:

---

## 2) Gates checklist / 闸门检查 ✅

- Gate status: (pass/fail)
- Tests executed:
- Security review completed: (yes/no) — link/path
- Privacy review completed: (yes/no) — link/path
- Docs updated: (yes/no) — link/path
- Observability adequate: (yes/no)

---

## 3) Deployment plan / 部署计划 🚀

- Target environment:
- Commands/steps:
- Config changes (if any):
- Migration steps (if any):

---

## 4) Rollback plan / 回滚方案 🔙

- Rollback steps:
- Rollback triggers (signals):
- Verification that rollback worked:

---

## 5) Post-release verification / 发布后验证 🔍

- Core flows to check:
- Metrics to watch (latency/errors/cost):
- Alert readiness:

---

## 6) Confirmation / 确认 🛑👑

- Is this an L3 action? (production deploy) (yes/no)
- Founder confirmation obtained? (yes/no) — record method/time:

