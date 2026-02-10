# 🚀 5 分钟快速启动 Keep-Alive

## 你的应用
**Streamlit**: https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app

---

## 选项 1️⃣: 本地后台运行（最简单）

```bash
# 一行命令启动
chmod +x start_keep_alive.sh && ./start_keep_alive.sh
```

**完成！** 会自动：
- ✅ 安装依赖
- ✅ 启动后台进程
- ✅ 显示实时日志

**查看日志**:
```bash
tail -f ~/.spr/logs/keep_alive.log
```

**停止**:
```bash
pkill -f 'python.*keep_alive.py'
```

---

## 选项 2️⃣: GitHub Actions（完全自动，推荐）

只需 1 分钟！

1. 打开: https://github.com/settings/secrets/actions
2. 点击 "New repository secret"
3. 填入:
   - **Name**: `STREAMLIT_APP_URL`
   - **Value**: `https://selfpromptlear_syaacpnx6umxrnf8uj5vwn.streamlit.app`
4. 点击 "Add secret"

**完成！** GitHub 会自动每 3 分钟 ping 一次你的应用。

查看运行状态: https://github.com/your-repo/actions

---

## 选项 3️⃣: 手动命令运行

```bash
pip install requests

export STREAMLIT_APP_URL="https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app"

python keep_alive.py
```

会输出：
```
✅ Ping 成功 (/) - 状态码: 200
⏳ 等待 240 秒后再次 ping...
```

---

## ✅ 验证

访问应用，确认不再显示 "your app is sleeping":
https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app

刷新几次，应该立即加载。

---

## 📊 工作原理

```
Extension (15-30 秒 ping)
    ↓
Python Keep-Alive (每 4 分钟 ping) 
    ↓
GitHub Actions (每 3 分钟 ping)

三层保护 = 永远不睡眠！
```

---

## 🆘 遇到问题？

| 问题 | 解决方案 |
|------|--------|
| Ping 失败 | 检查 URL，确认能访问应用 |
| 脚本报错 | `pip install requests` |
| 想停止 | `pkill -f 'python.*keep_alive.py'` |
| 查看日志 | `tail -f ~/.spr/logs/keep_alive.log` |

---

## 📁 相关文件

- `start_keep_alive.sh` - 一键启动脚本
- `keep_alive.py` - Python Keep-Alive 脚本
- `STREAMLIT_KEEP_ALIVE.md` - 详细文档
- `GITHUB_ACTIONS_SETUP.md` - GitHub Actions 配置指南

---

**就是这样！你的 Streamlit 应用现在 24/7 保持活跃。** ✨
