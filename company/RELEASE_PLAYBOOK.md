# RELEASE PLAYBOOK (v1.0) — Ship Only When It’s Safe
# 发布手册（v1.0）— 只在安全时发布

> Immutable release playbook.
> 纲领性文件（定死）：定义公司发布的标准步骤、门槛与回滚纪律。

---

## 1) Release principle / 发布原则 🚀

**English**
- Shipping is permissioned by gates.
- Every release must be reversible.
- Production changes are L3: require Founder confirmation.

**中文**
- 发布必须由闸门授权
- 每次发布必须可回滚
- 上生产属于 L3：必须 Founder 确认

---

## 2) Release checklist / 发布清单 ✅

**English**
A release is allowed only if:
- Gate 0–6 pass (see `GATES.md`),
- tests are green (minimum suite),
- risk review is completed (security/privacy/ops),
- docs/changelog are updated,
- rollback steps are written and feasible.

**中文**
允许发布的条件：
- 通过 Gate 0–6（见 `GATES.md`）
- 测试通过（最小套件）
- 风险审查完成（安全/隐私/运维）
- 文档与变更记录已更新
- 回滚步骤清晰且可执行

---

## 3) Versioning discipline / 版本纪律 🏷️

**English**
- Keep releases small and frequent.
- Prefer clear tags/versions when possible.
- Record what changed and why in changelog.

**中文**
- 小步频繁发布
- 尽可能用清晰的版本/标签
- 变更记录写清改了什么、为什么

---

## 4) Migration discipline / 迁移纪律 🧱

**English**
If schema/data migrations exist:
- migrations must be reversible or have a safe rollback strategy,
- migration steps must be tested in a safe environment,
- production migration requires explicit confirmation.

**中文**
涉及 schema/数据迁移时：
- 必须可回滚或有安全回滚策略
- 迁移步骤必须在安全环境验证
- 生产迁移必须明确确认

---

## 5) Post-release verification / 发布后验证 🔍

**English**
After release:
- verify core flows,
- monitor errors/latency/cost,
- be ready to rollback quickly if signals degrade.

**中文**
发布后：
- 验证主流程
- 监控错误/延迟/成本
- 指标变差立刻准备回滚

