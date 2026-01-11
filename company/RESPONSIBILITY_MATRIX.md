# RESPONSIBILITY MATRIX (v1.0) — RACI for Company Artifacts
# 责任矩阵（v1.0）— 公司产物的 RACI 归属

> Immutable responsibility matrix.
> 纲领性文件（定死）：定义每类产物由谁负责、谁审批、谁咨询、谁知会。

Legend:
- **R** = Responsible (produces)
- **A** = Accountable (final owner)
- **C** = Consulted
- **I** = Informed

---

## RACI Table / RACI 表格 📌

| Artifact / 产物 | PM | Architect | Backend | Frontend | QA | Security | Privacy | Release/DevOps | SRE | Writer | Founder |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Iteration Spec (Spec + acceptance) / 规格与验收 | R/A | C | C | C | C | C | C | I | I | I | I |
| Architecture Note (boundaries, data flow) / 架构说明 | C | R/A | C | C | I | C | C | I | C | I | I |
| Implementation (code changes) / 代码实现 | I | C | R/A* | R/A* | C | C | C | I | I | I | I |
| Test Plan & Results / 测试计划与结果 | C | I | C | C | R/A | C | I | I | I | I | I |
| Security Review (threats, deps, permissions) / 安全审查 | I | C | C | C | C | R/A | C | I | C | I | I |
| Privacy Review (data map, retention, export/delete) / 隐私审查 | I | I | C | C | I | C | R/A | I | I | I | I |
| Release Plan (CI/deploy/migrate/rollback) / 发布计划 | I | I | C | C | C | C | C | R/A | C | I | A (L3) |
| Observability/Alerts update / 可观测与告警 | I | I | C | C | I | C | C | C | R/A | I | I |
| Docs & Changelog / 文档与变更记录 | C | C | C | C | C | C | C | C | C | R/A | I |
| Retro (what happened, why, next) / 复盘 | C | C | C | C | C | C | C | C | C | R | I |

\* Engineering ownership is split: Backend owns backend scope, Frontend owns frontend scope.

---

## Founder accountability / Founder 的责任点 👑

**English**
Founder is **Accountable** only for:
- confirming L3 actions (high-risk) per governance,
- changing immutable governance docs (amendments).

Founder is not responsible for writing specs, code, or tests.

**中文**
Founder 只对以下内容承担最终责任：
- L3 高风险动作确认
- 纲领性文件的修订批准

Founder 不负责写 spec/代码/测试。

---

## “No bypass” rule / 不可绕过规则 🛑

**English**
If any artifact required by gates is missing, shipping is blocked.

**中文**
闸门要求的产物缺失，就不允许发布。

