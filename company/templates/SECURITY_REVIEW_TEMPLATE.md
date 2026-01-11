# SECURITY REVIEW TEMPLATE (v1.0)
# 安全审查模板（v1.0）

> Use this template for every iteration’s security review.
> 每轮必须做安全审查（哪怕很小），作为 Gate 的证据。

---

## 1) Summary / 概要

- What changed:
- Why it changed:
- Scope / blast radius:

---

## 2) Threat Surface Impact / 威胁面影响（必填）

Check all that apply and add notes:

- [ ] AuthN/AuthZ (sessions, permissions, roles)
- [ ] Input handling (injection, uploads, parsing)
- [ ] Data exposure (logs, errors, debug endpoints)
- [ ] Dependencies / supply chain
- [ ] CI/CD and build scripts
- [ ] External integrations (webhooks, OAuth, callbacks)
- [ ] Client-side security (XSS, CSRF, redirects)
- [ ] Storage/backups/caches

Notes:
- 

---

## 3) Risks & Mitigations / 风险与缓解（前三）

- Risk 1:
  - Mitigation:
  - Verification:
- Risk 2:
  - Mitigation:
  - Verification:
- Risk 3:
  - Mitigation:
  - Verification:

---

## 4) Secrets Check / 密钥检查 ✅

- Any secret touched? (yes/no)
- If yes, mechanism used (must be approved):
- Any chance secrets appear in logs/output? (yes/no)
- Redaction applied (if applicable):

---

## 5) Permissions & Least Privilege / 权限与最小权限

- Any permission changes? (yes/no)
- If yes: what changed and why:
- Least privilege rationale:

---

## 6) Verification / 验证证据

- Scans performed (if any):
- Tests run:
- Reproducible manual checks:

---

## 7) Decision / 结论

- Can we pass security gate? (yes/no)
- If no: what blocks shipping?
- Any L3 confirmation needed? (yes/no) — specify exact ask:

