# Keep-Alive Service 模板文件说明

## 📦 完整的模板包

你现在拥有一套**完整的保活脚本模板系统**，可以用来快速部署任何需要防休眠的服务。

### 📄 模板文件清单

```
✅ keep-alive.template.py
   └─ 通用 Python 脚本（参数化配置，即插即用）

✅ keep-alive.template.launchd.plist
   └─ macOS 后台服务配置（支持开机自启 + 崩了自救）

✅ KEEP-ALIVE-TEMPLATE.md
   └─ 详细文档（140+ 行，涵盖所有场景和细节）

✅ QUICK-REFERENCE.md
   └─ 快速参考卡（3分钟快速部署）

✅ keep_alive.py
   └─ 你的 Streamlit Cloud 实现（实际运行中）
```

---

## 🎯 使用场景

### 场景 1: 部署第二个保活脚本（另一个服务）

```bash
# 1. 复制模板
cp keep-alive.template.py ~/myservice/keep-alive.py

# 2. 编辑 CONFIG 部分（15 秒钟）
nano ~/myservice/keep-alive.py

# 3. 复制 plist 模板
cp keep-alive.template.launchd.plist ~/Library/LaunchAgents/com.tiger.myservice.plist

# 4. 编辑 plist（改 4 个字段，2 分钟）
nano ~/Library/LaunchAgents/com.tiger.myservice.plist

# 5. 启动（10 秒钟）
launchctl load -w ~/Library/LaunchAgents/com.tiger.myservice.plist

# ✅ Done! 总共 5 分钟
```

### 场景 2: 在 VPS/Linux 上部署

```bash
# Python 脚本完全通用（只是通知需要改）
# plist 只是 macOS，Linux 用 systemd

# Linux 的等价品：
# /etc/systemd/system/myservice-keepalive.service
# systemctl enable myservice-keepalive
# systemctl start myservice-keepalive
```

### 场景 3: 给团队分享

```bash
# 直接发给团队：
# 1. keep-alive.template.py
# 2. keep-alive.template.launchd.plist
# 3. QUICK-REFERENCE.md

# 他们可以按 5 分钟快速部署指南在 5 分钟内部署任何服务
```

---

## 🔄 模板 vs 实现

### 你现在有两个版本：

#### `keep_alive.py` — Streamlit 特定实现
- ✅ 已测试并正在运行
- ✅ 针对 Streamlit Cloud 优化
- ✅ 日志已验证工作正常
- 用途：参考和备份

#### `keep-alive.template.py` — 通用模板
- ✅ 完全参数化
- ✅ 注释详细
- ✅ 支持任何服务
- 用途：快速部署新服务

---

## 📊 对比表

| 特性 | keep_alive.py | keep-alive.template.py |
|------|-------------|----------------------|
| 针对 | Streamlit Cloud | 任何服务 |
| 配置难度 | 直接使用 | 改 6 行代码 |
| 可复用性 | 仅 Streamlit | 通用 |
| 日志 | 已验证 ✅ | 相同逻辑 ✅ |
| 通知 | 已配置 ✅ | 相同功能 ✅ |
| 推荐用途 | 生产运行 | 克隆新实例 |

---

## 🚀 实际应用步骤

### 假设你要保活第二个 Streamlit App

**第 1 步：创建新目录**
```bash
mkdir ~/my-second-app
cd ~/my-second-app
```

**第 2 步：复制模板**
```bash
cp ~/Desktop/Github/SelfPromptLearner/SPR_stage20_build/keep-alive.template.py ./keep-alive.py
```

**第 3 步：编辑 CONFIG（改这 6 行）**
```bash
nano keep-alive.py
```

改成：
```python
CONFIG = {
    "SERVICE_NAME": "MySecondApp",
    "SERVICE_URL": "https://my-second-app.streamlit.app/",
    "PING_INTERVAL": 300,
    "FAILURE_THRESHOLD": 3,
    "ENABLE_NOTIFICATIONS": True,
    "TIMEOUT": 10,
}
```

**第 4 步：测试**
```bash
python3 keep-alive.py
# 按 Ctrl+C 停止
tail ~/.mysecondapp-keepalive.out.log
```

**第 5 步：配置 launchd**
```bash
cp ~/Desktop/Github/SelfPromptLearner/SPR_stage20_build/keep-alive.template.launchd.plist ~/Library/LaunchAgents/com.tiger.mysecondapp.plist
```

**第 6 步：编辑 plist（改 4 个字段）**
```bash
nano ~/Library/LaunchAgents/com.tiger.mysecondapp.plist
```

改成：
```xml
<string>com.tiger.mysecondapp</string>  <!-- Label -->
<string>/Library/Frameworks/Python.framework/Versions/3.13/bin/python3</string>  <!-- Python 路径 -->
<string>/Users/yangming/my-second-app/keep-alive.py</string>  <!-- 脚本路径 -->
<string>/Users/yangming/my-second-app</string>  <!-- WorkingDirectory -->
<string>/Users/yangming/.mysecondapp-keepalive.out.log</string>  <!-- Log -->
```

**第 7 步：启动**
```bash
launchctl load -w ~/Library/LaunchAgents/com.tiger.mysecondapp.plist
launchctl list | grep mysecondapp
tail -f ~/.mysecondapp-keepalive.out.log
```

**✅ 完成！** 新服务现在 24/7 保活中。

---

## 🎓 文档导航

### 快速上手（5 分钟）
→ 看 [QUICK-REFERENCE.md](QUICK-REFERENCE.md)

### 详细配置（30 分钟）
→ 看 [KEEP-ALIVE-TEMPLATE.md](KEEP-ALIVE-TEMPLATE.md)

### 故障排除
→ 看 KEEP-ALIVE-TEMPLATE.md 的"常见问题"部分

### 实际参考
→ 看 [keep_alive.py](keep_alive.py)（当前运行的实现）

---

## ✨ 模板的优势

### 比起手工搭建：
- ⏱️ **节省 80% 时间**（5 分钟 vs 30 分钟）
- ✅ **降低配置错误**（模板已验证）
- 📚 **完整文档**（140 行细节）
- 🔄 **即插即用**（改几行代码就能跑）

### 比起复制现有脚本：
- 🎯 **灵活**（任何服务都能用）
- 📝 **清晰的注释**（知道为什么这样做）
- 🔧 **可配置**（不需要每次修改代码逻辑）
- 📖 **有文档**（快速参考 + 详细指南）

---

## 🔐 安全建议

如果你的服务需要认证：

```python
# 方法 1：环境变量
import os
api_key = os.environ.get("API_KEY")
headers = {"Authorization": f"Bearer {api_key}"}
response = requests.get(url, headers=headers, timeout=timeout)

# 方法 2：.env 文件
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("API_KEY")
```

---

## 📦 分享给团队

```bash
# 打包模板
tar czf keep-alive-templates.tar.gz \
  keep-alive.template.py \
  keep-alive.template.launchd.plist \
  QUICK-REFERENCE.md \
  KEEP-ALIVE-TEMPLATE.md

# 分享给团队
# 他们可以 5 分钟内部署任何服务 🚀
```

---

## 总结

你现在有了一个**生产级别的保活脚本系统**：

1. **通用模板** → 快速克隆任何服务
2. **详细文档** → 从 5 分钟快速指南到 30 分钟完整指南
3. **实际实现** → `keep_alive.py` 作为参考
4. **即插即用** → 改几行代码就能跑

**下次再部署新的保活服务，只需 5 分钟！** ⚡

---

## 文件清单

```
✅ keep-alive.template.py              (5.4 KB) - Python 脚本模板
✅ keep-alive.template.launchd.plist   (2.0 KB) - launchd 配置模板  
✅ KEEP-ALIVE-TEMPLATE.md              (7.7 KB) - 完整文档
✅ QUICK-REFERENCE.md                  (4.4 KB) - 快速参考
✅ keep_alive.py                       (当前运行中)
✅ KEEP-ALIVE-SYSTEM.md                (本文件)
```

---

**现在你可以轻松克隆这个保活系统到任何服务！** 🎉
