# Keep-Alive Service 通用模板

## 📋 概述

这是一个**通用的保活脚本模板**，可以用来定期 ping 任何服务，防止其进入睡眠状态。

包含两个文件：
- `keep-alive.template.py` — Python 脚本（核心逻辑）
- `keep-alive.template.launchd.plist` — macOS 后台服务配置

---

## 🚀 快速开始

### 第 1 步：复制并配置 Python 脚本

```bash
# 复制模板到你的新项目目录
cp keep-alive.template.py /path/to/your-project/keep-alive.py

# 编辑脚本，修改 CONFIG 部分
nano /path/to/your-project/keep-alive.py
```

### 修改这部分（第 30-36 行）：

```python
CONFIG = {
    "SERVICE_NAME": "MyService",  # 改成你的服务名
    "SERVICE_URL": "https://your-app.com/",  # 改成你的服务 URL
    "PING_INTERVAL": 300,  # ping 间隔（秒）
    "FAILURE_THRESHOLD": 3,  # 连续失败几次发送通知
    "ENABLE_NOTIFICATIONS": True,  # 是否启用通知
    "TIMEOUT": 10,  # 请求超时时间
}
```

### 第 2 步：测试脚本

```bash
cd /path/to/your-project
python3 keep-alive.py

# 运行几秒后按 Ctrl+C 停止
# 检查日志：
tail ~/.myservice-keepalive.out.log
```

### 第 3 步：配置 launchd

```bash
# 复制 plist 模板
cp keep-alive.template.launchd.plist ~/Library/LaunchAgents/com.tiger.myservice-keepalive.plist

# 编辑 plist，修改以下部分：
nano ~/Library/LaunchAgents/com.tiger.myservice-keepalive.plist
```

**必须修改的字段：**

1. **Label** — 唯一标识（保证不重复）
   ```xml
   <string>com.tiger.myservice-keepalive</string>
   ```

2. **ProgramArguments** — 脚本路径
   ```xml
   <string>/Library/Frameworks/Python.framework/Versions/3.13/bin/python3</string>
   <string>/path/to/your-project/keep-alive.py</string>
   ```

3. **WorkingDirectory** — 工作目录
   ```xml
   <string>/path/to/your-project</string>
   ```

4. **StandardOutPath** — 日志路径
   ```xml
   <string>/Users/yourname/.myservice-keepalive.out.log</string>
   ```

### 第 4 步：启用服务

```bash
# 加载服务
launchctl load -w ~/Library/LaunchAgents/com.tiger.myservice-keepalive.plist

# 验证运行状态
launchctl list | grep myservice-keepalive

# 查看日志
tail -f ~/.myservice-keepalive.out.log
```

---

## 📊 日志示例

```
[2026-01-29 07:06:02] 🚀 Starting keep-alive service: MyService
[2026-01-29 07:06:02] 📍 Target URL: https://example.com/
[2026-01-29 07:06:02] ⏱️  Ping interval: 300 seconds
[2026-01-29 07:06:02] ⚠️  Failure threshold: 3
[2026-01-29 07:06:02] ---
[2026-01-29 07:06:03] ✅ Ping #1 OK - Status: 200 (1245.32ms)
[2026-01-29 07:11:03] ✅ Ping #2 OK - Status: 200 (1089.44ms)
[2026-01-29 07:16:03] ⚠️ Ping #3 Warning - Status: 503 (5000ms)
[2026-01-29 07:21:03] 🔌 Ping #4 Connection Error
[2026-01-29 07:26:03] ⏱️ Ping #5 Timeout - Server might be waking up
```

---

## 🔧 常用命令

```bash
# 查看服务状态
launchctl list | grep myservice-keepalive

# 临时停止服务
launchctl unload ~/Library/LaunchAgents/com.tiger.myservice-keepalive.plist

# 重新启动服务
launchctl load -w ~/Library/LaunchAgents/com.tiger.myservice-keepalive.plist

# 完全删除服务
rm ~/Library/LaunchAgents/com.tiger.myservice-keepalive.plist
launchctl list | grep myservice-keepalive  # 验证已删除

# 查看标准输出日志
tail -f ~/.myservice-keepalive.out.log

# 查看错误日志
tail -f ~/.myservice-keepalive.err.log
```

---

## 🎯 配置选项详解

### SERVICE_NAME
- **用途**：服务的显示名称
- **影响**：日志文件名、通知标题
- **例子**：`"MyService"` → `~/.myservice-keepalive.out.log`

### SERVICE_URL
- **用途**：要 ping 的服务地址
- **格式**：完整 HTTP/HTTPS URL
- **例子**：`"https://example.com/"` 或 `"http://localhost:8080/health"`

### PING_INTERVAL
- **用途**：ping 的间隔时间（秒）
- **默认**：`300`（5分钟）
- **注意**：太频繁（<60秒）会浪费资源

### FAILURE_THRESHOLD
- **用途**：连续失败多少次才发送通知
- **默认**：`3`（连续失败 3 次发送通知）
- **说明**：防止偶发错误导致通知轰炸

### ENABLE_NOTIFICATIONS
- **用途**：是否启用 macOS 通知
- **默认**：`True`
- **说明**：如果在 Linux 等其他系统上，建议设为 `False`

### TIMEOUT
- **用途**：HTTP 请求的超时时间（秒）
- **默认**：`10`
- **说明**：超过这个时间就认为请求超时

---

## ⚠️ 常见问题

### 1. 日志文件是空的？
- 检查脚本是否在运行：`ps aux | grep keep_alive`
- 检查 Python 路径是否正确：`which python3`
- 检查 plist 中的 WorkingDirectory 路径

### 2. 通知没有出现？
- 确保 `ENABLE_NOTIFICATIONS` 是 `True`
- 检查 macOS 通知设置
- 查看错误日志：`cat ~/.myservice-keepalive.err.log`

### 3. 服务没有自动启动？
- 验证 plist 文件位置：`~/Library/LaunchAgents/`
- 验证 plist 加载状态：`launchctl list | grep label-name`
- 确保 `-w` 参数用了：`launchctl load -w [plist路径]`

### 4. 进程一直崩溃？
- 检查 Python 脚本有无语法错误：`python3 -m py_compile keep-alive.py`
- 查看错误日志：`tail ~/.myservice-keepalive.err.log`
- 尝试手动运行：`python3 keep-alive.py`

---

## 📝 实际应用示例

### 示例 1：Streamlit Cloud 应用

```python
CONFIG = {
    "SERVICE_NAME": "Streamlit",
    "SERVICE_URL": "https://your-app.streamlit.app/",
    "PING_INTERVAL": 300,
    "FAILURE_THRESHOLD": 3,
    "ENABLE_NOTIFICATIONS": True,
    "TIMEOUT": 10,
}
```

### 示例 2：自己的后端 API

```python
CONFIG = {
    "SERVICE_NAME": "MyBackend",
    "SERVICE_URL": "https://api.example.com/health",
    "PING_INTERVAL": 600,  # 10分钟
    "FAILURE_THRESHOLD": 2,  # 更严格
    "ENABLE_NOTIFICATIONS": True,
    "TIMEOUT": 15,  # API 可能较慢
}
```

### 示例 3：内网服务

```python
CONFIG = {
    "SERVICE_NAME": "InternalService",
    "SERVICE_URL": "http://192.168.1.100:3000/status",
    "PING_INTERVAL": 300,
    "FAILURE_THRESHOLD": 5,  # 内网不稳定，容许更多失败
    "ENABLE_NOTIFICATIONS": False,  # 不需要通知
    "TIMEOUT": 5,  # 内网响应快
}
```

---

## 🔐 安全注意事项

1. **敏感信息**：不要在脚本中硬编码密钥或密码
   - 使用环境变量：`os.environ.get('API_KEY')`
   - 或使用配置文件：`.env`

2. **日志文件权限**：日志文件会包含请求信息
   ```bash
   chmod 600 ~/.myservice-keepalive.out.log
   ```

3. **监听端口**：如果在公网，确保 URL 是安全的（HTTPS）

4. **请求头**：可以添加 User-Agent 或认证
   ```python
   headers = {'User-Agent': 'Keep-Alive Service'}
   response = requests.get(url, headers=headers, timeout=timeout)
   ```

---

## 📚 扩展功能

如果你需要更多功能，可以修改 Python 脚本：

### 添加自定义请求头
```python
headers = {
    'User-Agent': 'MyService-KeepAlive/1.0',
    'Authorization': f'Bearer {os.environ.get("API_KEY", "")}'
}
response = requests.get(service_url, headers=headers, timeout=timeout)
```

### 添加 Webhook 通知
```python
def send_webhook(message):
    webhook_url = os.environ.get("WEBHOOK_URL")
    if webhook_url:
        requests.post(webhook_url, json={"text": message})
```

### 添加数据库记录
```python
import sqlite3
db = sqlite3.connect('keepalive.db')
cursor = db.cursor()
cursor.execute('INSERT INTO pings VALUES (?, ?, ?)', (datetime.now(), response.status_code, response_time))
db.commit()
```

---

## ✨ 总结

这个模板可以快速部署任何服务的保活脚本：

1. **复制** → 修改 CONFIG → **测试** → **部署**
2. **完全自动化**：开机自启、崩了自救、支持通知
3. **最小化资源**：每 5 分钟只运行几秒钟
4. **易于维护**：日志清晰、命令简单

祝你的服务永不休眠！🚀
