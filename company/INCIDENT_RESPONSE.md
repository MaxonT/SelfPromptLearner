# INCIDENT RESPONSE (v1.0) — Stop the Bleed, Then Learn
# 事故响应（v1.0）— 先止血，再学习

> Immutable incident response policy.
> 纲领性文件（定死）：定义事故分级、止血流程、沟通与复盘的标准动作。

---

## 1) Principle / 原则 🧯

**English**
- Speed matters, but correctness matters more.
- First goal: stop harm (security, data loss, outages).
- Second goal: restore service safely.
- Third goal: learn and prevent recurrence.

**中文**
- 速度重要，但正确更重要
- 第一目标：止血（安全/数据/宕机）
- 第二目标：安全恢复
- 第三目标：复盘防复发

---

## 2) Incident severity / 事故分级 🚦

**SEV-1**: active security breach, major outage, or data loss risk  
**SEV-2**: significant degradation affecting many users  
**SEV-3**: limited impact; workaround exists  
**SEV-4**: minor issue; no urgent action

---

## 3) Immediate response steps / 立即响应步骤 🛑

**English**
For SEV-1/2:
1) declare incident and freeze changes (Class A only),
2) assess scope and impact using observability,
3) stop the bleed (disable feature, revoke secret, rollback, rate limit),
4) confirm stabilization signals,
5) document actions in the audit trail.

**中文**
SEV-1/2：
1）宣布事故并冻结变更（只允许 A 类）  
2）用可观测数据评估范围与影响  
3）止血（关功能/吊销密钥/回滚/限流）  
4）确认稳定信号  
5）把动作写入审计证据链

---

## 4) Communication during incidents / 事故沟通 🗣️

**English**
- Say what is known, what is unknown, and next action.
- Do not speculate.
- Escalate to Founder for any L3 action.

**中文**
- 只说已知、未知、下一步
- 不推测
- 涉及 L3 必须请示 Founder

---

## 5) Post-incident retro / 事故复盘 🧾

**English**
A retro must include:
- timeline,
- root cause (technical + process),
- what worked/failed,
- preventive actions (tests, alerts, guardrails),
- owners and verification plan.

**中文**
复盘必须包含：
- 时间线
- 根因（技术+流程）
- 哪些有效/哪些失效
- 防复发动作（测试/告警/护栏）
- 负责人+验证计划

