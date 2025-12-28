# 🚀 快速上线指南（5分钟版）

## ✅ 前置检查清单

- [ ] 代码已推送到 GitHub
- [ ] 有 Render 账号（免费注册：https://dashboard.render.com）

---

## 📝 步骤 1: 推送到 GitHub（如果还没推送）

```bash
# 检查状态
git status

# 如果有更改，提交并推送
git add .
git commit -m "准备部署"
git push origin main
```

---

## 🌐 步骤 2: 在 Render 创建应用（3分钟）

1. **访问 Render Dashboard**
   - 打开 https://dashboard.render.com
   - 用 GitHub 账号登录

2. **创建 Blueprint**
   - 点击右上角 **"New +"** → 选择 **"Blueprint"**
   - 选择你的 GitHub 仓库
   - 点击 **"Apply"**

3. **等待部署**
   - Render 会自动创建数据库和 Web 服务
   - 等待 5-10 分钟（首次部署较慢）

---

## 🗄️ 步骤 3: 初始化数据库（1分钟）

部署完成后：

1. 在 Render Dashboard，进入你的 **Web 服务**
2. 点击 **"Shell"** 标签
3. 运行命令：
   ```bash
   npm run db:push
   ```
4. 看到 "✓ Pushed" 表示成功

---

## ✅ 步骤 4: 测试（1分钟）

1. **测试健康检查**
   - 访问：`https://你的应用名.onrender.com/api/health`
   - 应该看到：`{"ok": true}`

2. **测试主页**
   - 访问：`https://你的应用名.onrender.com`
   - 应该看到登录页面

3. **注册账号**
   - 点击 "Register"
   - 输入邮箱和密码（至少8位）
   - **保存显示的 API Token**（重要！）

---

## 🔧 步骤 5: 配置扩展（1分钟）

1. **打开扩展**
   - Chrome: `chrome://extensions/`
   - 找到 SPR 扩展，点击图标

2. **设置配置**
   - **Server URL**: `https://你的应用名.onrender.com`
   - **API Token**: 粘贴步骤4中保存的 Token
   - **Auto sync**: ✅ 勾选

3. **测试捕获**
   - 访问 https://chat.openai.com
   - 输入提示词并发送
   - 打开扩展 Popup，应该看到新捕获的提示词

---

## 🎉 完成！

现在你的应用已经上线了！

**下一步**：
- 在 Dashboard 查看提示词
- 测试扩展同步功能
- 查看 Analytics 页面

---

## ⚠️ 如果遇到问题

### 部署失败？
- 查看 Render 的 **Logs** 标签
- 确保 Node.js 版本是 20+

### 数据库错误？
- 确保运行了 `npm run db:push`
- 检查 `DATABASE_URL` 环境变量

### 扩展无法同步？
- 检查 Server URL 是否正确（包含 `https://`）
- 检查 API Token 是否正确
- 查看扩展 Popup 中的错误信息

---

## 📚 详细文档

查看 `DEPLOYMENT.md` 获取更详细的部署说明和故障排查。

