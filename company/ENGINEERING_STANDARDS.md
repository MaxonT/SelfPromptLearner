# ENGINEERING STANDARDS (v1.0) — Engineering Discipline for the Company
# 工程规范（v1.0）— 公司的工程纪律

> Immutable engineering standards.
> 纲领性文件（定死）：定义最低工程质量线，确保“质量完美才加功能”。

---

## 1) Quality bar / 质量底线 ✅

**English**
- No silent failures: errors must be handled or surfaced.
- Deterministic behavior where possible.
- Clear boundaries: modules and responsibilities are explicit.
- Tests are first-class: add tests with fixes when feasible.

**中文**
- 不允许静默失败：错误必须被处理或被明确暴露
- 尽可能确定性行为
- 边界清晰：模块与职责明确
- 测试是第一公民：修 bug 尽量补测试

---

## 2) Logging & errors / 日志与错误 🧾

**English**
- Prefer structured logs.
- Avoid logging sensitive payloads.
- Error messages must be actionable: what failed, where, and what to do next.

**中文**
- 优先结构化日志
- 避免记录敏感 payload
- 错误信息要可执行：失败点/位置/下一步建议

---

## 3) API discipline / API 纪律 🧱

**English**
- Validate inputs at boundaries.
- Prefer explicit schemas/contracts when available.
- Backward compatibility or versioning for breaking changes.

**中文**
- 边界校验输入
-（可用时）用明确的 schema/契约
- 破坏性变更必须兼容或版本化

---

## 4) Config discipline / 配置纪律 🔧

**English**
- No hardcoded environment-specific values.
- Use environment variables and document required keys (without values).
- Keep configs minimal and auditable.

**中文**
- 不硬编码环境相关值
- 用环境变量，并记录所需 key（不写真实值）
- 配置尽量少且可审计

---

## 5) Minimal-change rule / 最小改动规则 🪚

**English**
- Fix the smallest surface that solves the problem.
- Avoid broad refactors unless required for correctness/safety.
- Keep diffs reviewable.

**中文**
- 只修最小必要面
- 除非正确性/安全需要，否则不做大重构
- diff 必须可审阅

