# GATES (v1.0) — Non-Negotiable Quality & Safety Gates
# 闸门体系（v1.0）— 不可跳过的质量与安全关卡

> Immutable gates document.
> 纲领性文件（定死）：定义“什么情况下允许推进/发布”。

---

## Gate 0 — Reality Check / 现实校验门 🔍

**English**
Before anything else:
- Confirm repo state via inspection.
- If a directory is empty, explicitly mark it empty.
- Identify how to run the project and tests.
Failing Gate 0 → return to Discovery.

**中文**
先过现实门：
- 通过阅读确认 repo 现状
- 空目录必须明确声明为空
- 找到运行与测试的方法
过不了 Gate 0 → 回到识别阶段

---

## Gate 1 — Plan Gate / 计划门 🧭

**English**
A written Plan is required:
- scope (do/not do),
- minimal file touches,
- tests/commands to run,
- risk notes,
- rollback steps,
- required docs updates.

No Plan → no code changes.

**中文**
必须先有计划：
- 范围（做/不做）
- 最少文件改动
- 要跑的测试/命令
- 风险说明
- 回滚步骤
- 需要更新的文档

无计划 → 不允许改代码

---

## Gate 2 — Correctness & Tests / 正确性与测试门 ✅🧪

**English**
Minimum standard:
- Changes must not break existing behavior unintentionally.
- Run the minimal test suite (unit/integration/e2e as available).
If tests cannot run:
- explicitly state why,
- prioritize fixing testability before new features.

**中文**
最低标准：
- 不得引入非预期破坏
- 必须运行可用的最小测试套件（单测/集成/E2E 视项目而定）
若测试跑不起来：
- 明确原因
- 优先修复可测试性，不加新功能

---

## Gate 3 — Risk Review / 风险审查门 🛡️

**English**
For each iteration, record:
- security risk changes (auth, permissions, dependencies),
- privacy impact (data collected, stored, logged),
- operational risk (deploy, migrations, rollback complexity).

If risk is uncertain → stop and escalate.

**中文**
每轮必须记录：
- 安全风险变化（鉴权/权限/依赖）
- 隐私影响（收集/存储/日志）
- 运维风险（部署/迁移/回滚复杂度）

风险不确定 → 必须停下请示

---

## Gate 4 — Secrets Discipline / 密钥纪律门 🧷

**English**
- Never write secrets to code, docs, logs, or command output.
- If secrets are needed, require a dedicated secrets mechanism (registry/env injection).
If any exposure is suspected → stop and remediate before continuing.

**中文**
- 密钥不得出现在代码/文档/日志/命令输出
- 需要密钥必须走专门机制（registry/env 注入）
怀疑泄露 → 立刻停下，先止血再继续

---

## Gate 5 — Documentation & Audit Trail / 文档与审计门 📚

**English**
Each iteration must leave an auditable trail:
- plan,
- diff summary,
- test results,
- risk notes,
- docs updates,
- rollback steps,
- retro note.

No audit trail → iteration is invalid.

**中文**
每轮必须可审计：
- 计划
- 改动摘要
- 测试结果
- 风险说明
- 文档更新
- 回滚步骤
- 复盘

无证据链 → 本轮无效

---

## Gate 6 — Ship Permission / 发布许可门 🚀

**English**
Shipping is allowed only when:
- all applicable gates pass,
- rollback is clear,
- high-risk actions (if any) have explicit Founder confirmation.

**中文**
允许发布的前提：
- 相关闸门全部通过
- 回滚路径清晰
- 若涉及高风险动作，必须获得 Founder 明确确认

