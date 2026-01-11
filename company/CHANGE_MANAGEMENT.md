# CHANGE MANAGEMENT (v1.0) — How the Company Changes the Repo Without Chaos
# 变更管理（v1.0）— 公司如何在不失控的情况下改动仓库

> Immutable change-control document.
> 纲领性文件（定死）：定义变更节奏、冻结策略、回滚、以及“质量先于功能”的硬执行规则。

---

## 1) Prime objective / 核心目标 🎯

**English**
Make progress without destabilizing the system:
- small, reversible changes,
- minimal blast radius,
- always auditable.

**中文**
在推进的同时保持系统稳定：
- 小步可回滚
- 最小影响面
- 全程可审计

---

## 2) Change units / 变更单位 🧩

**English**
An iteration is the smallest unit of change. It must include:
- Plan → Diff → Tests → Risk Notes → Docs → Rollback → Retro.

**中文**
“迭代轮次”是最小变更单位，必须包含：
- 计划 → 改动 → 测试 → 风险说明 → 文档 → 回滚 → 复盘

---

## 3) Default constraints / 默认约束（护栏未升级前）🪚

**English**
- Touch the fewest files possible.
- Avoid broad refactors.
- No “cleanup for aesthetics” while debugging.
- Any uncertainty → Discovery-first.

**中文**
- 能少改就少改
- 禁止大范围重构
- Debug 时不做“顺手美化式清理”
- 不确定 → 先识别再行动

---

## 4) Change classes / 变更类型分类 🏷️

**English**
- **Class A: Quality** — tests, correctness, reliability, docs clarity (preferred).
- **Class B: Safe Feature** — small scope, low risk, covered by tests.
- **Class C: Risky** — auth/permissions, data model, deployments, external integrations (L3 confirmation).

**中文**
- **A 类：质量**（优先）— 测试/正确性/可靠性/文档清晰
- **B 类：安全功能** — 小范围、低风险、有测试覆盖
- **C 类：高风险** — 鉴权/权限、数据模型、部署、外部集成（必须 L3 确认）

---

## 5) Freeze policy / 冻结策略 ❄️

**English**
When stability is threatened, the Company enters **Freeze Mode**:
- Only Class A changes allowed.
- No new features.
- Goal: restore gates passability and reduce risk surface.

Freeze triggers:
- failing or flaky critical tests,
- repeated regressions,
- unknown runtime behavior,
- security/privacy uncertainty.

**中文**
当稳定性受威胁，公司进入**冻结模式**：
- 只允许 A 类（质量）变更
- 不加新功能
- 目标：恢复闸门可通过性、降低风险面

触发条件：
- 关键测试失败或持续 flaky
- 反复回归
- 运行行为不确定
- 安全/隐私影响不确定

---

## 6) Rollback discipline / 回滚纪律 🔙

**English**
Every iteration must define rollback:
- how to revert code changes,
- how to revert migrations/config (if any),
- what signals confirm rollback success.

No rollback path → block shipping.

**中文**
每轮必须定义回滚：
- 如何撤销代码改动
- 如何撤销迁移/配置（如有）
- 用什么信号确认回滚成功

无回滚路径 → 禁止发布

---

## 7) Change approval / 变更批准 ✅

**English**
- Class A/B: Company may proceed if gates pass.
- Class C: must stop and get Founder confirmation (per decision policy).

**中文**
- A/B 类：过闸门即可推进
- C 类：必须停下请示 Founder（按决策政策）

