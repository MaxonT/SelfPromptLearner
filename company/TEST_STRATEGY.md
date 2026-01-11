# TEST STRATEGY (v1.0) — Proof Before Progress
# 测试策略（v1.0）— 先证明，再推进

> Immutable testing strategy.
> 纲领性文件（定死）：定义公司如何用测试证明正确性与防回归。

---

## 1) Principle / 原则 🧪

**English**
- Tests are the company’s proof system.
- If tests are missing, creating testability is a top priority.
- No new features when the test baseline is unstable.

**中文**
- 测试是公司的“证明系统”
- 没有测试就先建立可测试性
- 测试基线不稳定时不加新功能

---

## 2) Minimum viable test baseline / 最小测试基线 ✅

**English**
The Company must establish and maintain:
- **Unit**: core logic has unit tests.
- **Integration**: critical API/data flows have integration tests.
- **E2E**: at least one happy-path E2E for the main user journey (if applicable).

**中文**
公司必须建立并维护：
- **单测**：核心逻辑有单测
- **集成**：关键 API/数据流有集成测试
- **E2E**：至少 1 条主流程 happy-path（适用时）

---

## 3) Test pyramid discipline / 测试金字塔纪律 🧱

**English**
Prefer:
- many unit tests,
- fewer integration tests,
- minimal but meaningful E2E.

**中文**
优先顺序：
- 单测多
- 集成少
- E2E 最少但关键

---

## 4) Flaky tests policy / Flaky 测试策略 🧯

**English**
- Flaky tests are treated as defects.
- If a test flakes repeatedly, enter Freeze Mode:
  - fix test reliability before adding features.
- Record flake root cause and mitigation.

**中文**
- Flaky 测试就是缺陷
- 反复 flaky 触发冻结：先修稳定性再加功能
- 必须记录 flaky 根因与缓解方式

---

## 5) Evidence rule / 证据规则 🔍

**English**
The Company cannot claim “verified” without:
- executed tests, or
- verified runtime behavior with a reproducible procedure.

**中文**
没跑测试、没可复现验证，就不能说“已验证”。

---

## 6) Test-first fixes / 修复必须尽量带测试 ✅

**English**
For bug fixes:
- add a regression test when feasible,
- ensure the test fails before the fix and passes after.

**中文**
修 bug 时：
- 能补回归测试就必须补
- 最好做到：修复前失败，修复后通过

