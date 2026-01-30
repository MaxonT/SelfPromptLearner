# Keep-Alive Service 快速参考卡

## 一句话总结
**复制 → 改 CONFIG → 测试 → 部署 → Done!**

---

## 3 分钟快速部署

### Step 1️⃣: 复制并编辑脚本
```bash
cp keep-alive.template.py /path/to/project/keep-alive.py
nano /path/to/project/keep-alive.py

# 修改这部分（约第 30-36 行）
CONFIG = {
    "SERVICE_NAME": "MyApp",
    "SERVICE_URL": "https://my-app.com/",
    "PING_INTERVAL": 300,
    "FAILURE_THRESHOLD": 3,
    "ENABLE_NOTIFICATIONS": True,
    "TIMEOUT": 10,
}
```

### Step 2️⃣: 测试脚本
```bash
python3 /path/to/project/keep-alive.py &
sleep 3
kill %1
tail ~/.myapp-keepalive.out.log
```

### Step 3️⃣: 配置并启用 launchd
```bash
# 复制 plist
cp keep-alive.template.launchd.plist ~/Library/LaunchAgents/com.tiger.myapp.plist

# 编辑 plist，修改这 4 个字段：
# 1. Label: com.tiger.myapp
# 2. ProgramArguments 中的 python3 路径和脚本路径
# 3. WorkingDirectory: /path/to/project
# 4. StandardOutPath: ~/.myapp-keepalive.out.log

# 启用
launchctl load -w ~/Library/LaunchAgents/com.tiger.myapp.plist

# 验证
launchctl list | grep myapp
tail -f ~/.myapp-keepalive.out.log
```

---

## 核心配置字段

| 字段 | 说明 | 例子 |
|------|------|------|
| `SERVICE_NAME` | 服务名字 | `"Streamlit"` |
| `SERVICE_URL` | 要 ping 的 URL | `"https://app.streamlit.app/"` |
| `PING_INTERVAL` | ping 间隔（秒） | `300`（5分钟） |
| `FAILURE_THRESHOLD` | 失败几次发通知 | `3` |
| `ENABLE_NOTIFICATIONS` | 是否要通知 | `True` |
| `TIMEOUT` | 超时时间（秒） | `10` |

---

## 常用命令速查

```bash
# 🔍 查看状态
launchctl list | grep myapp

# ▶️ 启动
launchctl load -w ~/Library/LaunchAgents/com.tiger.myapp.plist

# ⏸️ 停止
launchctl unload ~/Library/LaunchAgents/com.tiger.myapp.plist

# 📊 查看日志
tail -f ~/.myapp-keepalive.out.log

# ❌ 删除服务
rm ~/Library/LaunchAgents/com.tiger.myapp.plist
```

---

## 日志含义

```
✅ OK              → 成功（状态码 200）
⚠️  Warning        → 异常状态码（非 200）
⏱️  Timeout        → 网络超时
🔌 Connection Error → 连接失败
❌ Error           → 其他错误
📲 Notification    → 通知已发送
```

---

## 关键点检查清单

- [ ] Python 路径正确？`which python3` 
- [ ] 脚本路径正确？`ls -la /path/to/keep-alive.py`
- [ ] plist 在正确位置？`ls ~/Library/LaunchAgents/`
- [ ] launchctl 已加载？`launchctl list | grep myapp`
- [ ] 日志文件有内容？`cat ~/.myapp-keepalive.out.log`
- [ ] 进程在运行？`ps aux | grep keep_alive`

---

## 故障排除

| 问题 | 排查 |
|------|------|
| 日志为空 | `ps aux \| grep keep_alive` 检查进程 |
| 没有通知 | 检查 `ENABLE_NOTIFICATIONS=True` |
| 服务不启动 | 检查 plist 语法：`plutil -lint file.plist` |
| 脚本崩溃 | 运行 `python3 keep-alive.py` 看错误 |

---

## 文件位置

```
项目目录/
├── keep-alive.py                    ← 修改 CONFIG 这个
├── keep-alive.template.py           ← 模板
├── keep-alive.template.launchd.plist ← 模板
└── KEEP-ALIVE-TEMPLATE.md           ← 详细文档

~/.myapp-keepalive.out.log           ← 日志输出
~/Library/LaunchAgents/
└── com.tiger.myapp.plist            ← launchd 配置
```

---

## 实战示例

### 📱 Streamlit Cloud

```python
CONFIG = {
    "SERVICE_NAME": "StreamlitApp",
    "SERVICE_URL": "https://your-app.streamlit.app/",
    "PING_INTERVAL": 300,
    "FAILURE_THRESHOLD": 3,
    "ENABLE_NOTIFICATIONS": True,
    "TIMEOUT": 10,
}
```

### 🌐 自己的后端

```python
CONFIG = {
    "SERVICE_NAME": "MyBackend",
    "SERVICE_URL": "https://api.example.com/health",
    "PING_INTERVAL": 600,
    "FAILURE_THRESHOLD": 2,
    "ENABLE_NOTIFICATIONS": True,
    "TIMEOUT": 15,
}
```

### 🏢 内网服务

```python
CONFIG = {
    "SERVICE_NAME": "LocalService",
    "SERVICE_URL": "http://192.168.1.100:3000/status",
    "PING_INTERVAL": 300,
    "FAILURE_THRESHOLD": 5,
    "ENABLE_NOTIFICATIONS": False,
    "TIMEOUT": 5,
}
```

---

## 🎯 完成标志

- [x] 日志开始输出
- [x] 每隔 N 秒看到一条 `✅ Ping OK`
- [x] launchctl 显示进程在运行
- [x] 开机后自动启动（重启验证）
- [x] 进程崩了会自动重启（kill 后查看 launchctl list）

**恭喜！你的服务现在永不休眠了！** 🚀

---

💡 **更多细节？** 看 `KEEP-ALIVE-TEMPLATE.md`
