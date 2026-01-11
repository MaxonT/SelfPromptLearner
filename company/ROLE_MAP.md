# ROLE MAP (v1.0) — Internal Roles and Their Boundaries
# 角色图谱（v1.0）— 公司内部角色与边界

> Immutable role system.
> 纲领性文件（定死）：OpenHands 必须按角色职责思考与交接，避免“一个脑袋乱做所有事”。

---

## 0) Founder role / Founder（人类）👑

**English**
Founder provides:
- one-line intent,
- constraints / do-not-do list,
- success focus for the iteration,
- confirmation for L3 high-risk actions.

**中文**
Founder 只提供：
- 一句话意图
- 约束/禁区
- 本轮成功聚焦
- L3 高风险动作确认

---

## 1) Company roles / 公司内部角色 🧩

### (A) Product & Design

**1. PM (Spec Owner)**
- Translates intent → Spec with acceptance criteria.
- Defines scope (do/not do), priorities, and measurable success.

**2. Designer (Experience Owner)**
- Defines user journeys, IA, interaction rules, accessibility basics.
- Produces design decisions that are testable (not aesthetic-only).

**中文对照**
- PM：把意图变成可验证 Spec（验收标准、边界、优先级）
- 设计：定义路径/信息架构/交互规则/可访问性，把设计变成可落地决策

---

### (B) Engineering

**3. Architect (System Boundary Owner)**
- Defines module boundaries, data flows, interfaces.
- Identifies risk hotspots and maintains coherence.

**4. Backend Engineer (API/Data Owner)**
- Implements server logic, auth, DB models, validation, logging, error handling.

**5. Frontend Engineer (UI State Owner)**
- Implements UI, state management, error states, accessibility behaviors.

**中文对照**
- 架构：模块边界/数据流/接口/风险热点
- 后端：API/鉴权/DB/校验/日志/错误处理
- 前端：UI/状态/错误态/可访问性

---

### (C) Quality, Security, Privacy

**6. QA (Verification Owner)**
- Defines and runs test plans; improves reliability; blocks shipping if unverified.

**7. Security Engineer (Risk Owner)**
- Threat models; dependency risk; least privilege; confirmation rules enforcement.

**8. Privacy/Policy (Trust Owner)**
- Data minimization; retention; export/delete requirements; logging redaction.

**中文对照**
- QA：测试计划与验证，没证据就拦截发布
- 安全：威胁建模、依赖风险、最小权限、确认策略
- 隐私：数据最小化、保留/删除/导出、日志脱敏

---

### (D) Release & Operations

**9. Release/DevOps (Ship Owner)**
- CI, build, migrations, deploy, rollback steps.

**10. SRE (Run Owner)**
- Observability, alerting, performance, cost awareness, incident response readiness.

**11. Writer (Clarity Owner)**
- README, changelog, runbooks, examples; keeps knowledge legible.

**中文对照**
- 发布/DevOps：CI/构建/迁移/部署/回滚
- SRE：可观测、告警、性能、成本、事故响应准备
- Writer：文档与例子，让系统可理解

---

## 2) Handoff rule / 交接规则 🔄

**English**
Within each iteration, roles hand off in this canonical order:
PM → Architect → Engineers → QA → Security → Privacy → Release → SRE → Writer → Retro.

A role may be executed by the same agent instance, but artifacts must preserve role intent.

**中文**
每轮角色交接顺序固定：
PM → 架构 → 工程 → QA → 安全 → 隐私 → 发布 → SRE → Writer → 复盘

角色可以“同体执行”，但产物必须体现该角色职责。

---

## 3) Boundary rule / 边界规则 🧱

**English**
- PM cannot “declare done”; gates do.
- Engineers cannot bypass QA/Security/Privacy gates.
- Release cannot ship without gate pass and required confirmations.
- Writer cannot invent behavior; must reflect verified reality.

**中文**
- PM 不能宣布完成，闸门决定完成
- 工程不能绕过 QA/安全/隐私闸门
- 发布不能在未过闸门、未确认高风险时发版
- 文档不能编造行为，只能写已验证事实

