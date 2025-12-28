# SPR 上线部署指南

## 📋 部署前准备

### 1. 确保代码已提交到 Git

```bash
# 检查当前状态
git status

# 如果有未提交的更改，提交它们
git add .
git commit -m "准备部署到生产环境"

# 确保已推送到 GitHub
git push origin main
```

### 2. 修改 render.yaml（可选）

如果你想要自定义应用名称，可以修改 `render.yaml` 第3行和第17行：

```yaml
name: spr-fullstack  # 改为你想要的名称
APP_ORIGIN: https://spr-fullstack.onrender.com  # 会自动匹配你的应用名称
```

**注意**：Render 会自动根据应用名称生成 URL，所以 `APP_ORIGIN` 会在部署后自动设置。但如果你想提前知道 URL，可以保持默认或修改。

---

## 🚀 步骤 1: 在 Render 创建应用

### 1.1 登录 Render
1. 访问 [https://dashboard.render.com](https://dashboard.render.com)
2. 使用 GitHub 账号登录（如果没有账号，先注册）

### 1.2 创建 Blueprint
1. 点击 **"New +"** 按钮
2. 选择 **"Blueprint"**
3. 选择你的 GitHub 仓库（确保已经推送了代码）
4. Render 会自动检测 `render.yaml` 文件
5. 点击 **"Apply"**

### 1.3 等待部署
- Render 会自动：
  - 创建 PostgreSQL 数据库
  - 创建 Web 服务
  - 安装依赖
  - 构建应用
  - 启动服务

**预计时间**：5-10 分钟

---

## 🗄️ 步骤 2: 初始化数据库

部署完成后，需要运行数据库迁移：

### 方法 1: 使用 Render Shell（推荐）

1. 在 Render Dashboard 中，进入你的 Web 服务
2. 点击 **"Shell"** 标签
3. 在 Shell 中运行：

```bash
npm run db:push
```

### 方法 2: 本地运行（需要 DATABASE_URL）

1. 在 Render Dashboard 中，进入你的数据库服务
2. 复制 **"Internal Database URL"** 或 **"External Database URL"**
3. 在本地设置环境变量：

```bash
export DATABASE_URL="postgres://..."
npm run db:push
```

---

## ✅ 步骤 3: 验证部署

### 3.1 检查健康状态
访问：`https://你的应用名.onrender.com/api/health`

应该返回：
```json
{"ok": true}
```

### 3.2 检查主页
访问：`https://你的应用名.onrender.com`

应该看到登录页面。

### 3.3 测试注册
1. 点击 "Register"
2. 输入邮箱和密码（至少8位）
3. 注册成功后，会显示 API Token（**重要：保存这个 Token**）

---

## 🔧 步骤 4: 配置浏览器扩展

### 4.1 获取 API Token
1. 登录 Dashboard
2. 进入 **Settings** 页面
3. 复制 **API Token**

### 4.2 配置扩展
1. 打开 Chrome 扩展管理页面：`chrome://extensions/`
2. 找到 SPR 扩展
3. 点击扩展图标，打开 Popup
4. 设置：
   - **Server URL**: `https://你的应用名.onrender.com`
   - **API Token**: 粘贴刚才复制的 Token
   - **Auto sync**: 勾选（启用自动同步）

### 4.3 测试扩展
1. 访问 `https://chat.openai.com` 或 `https://claude.ai`
2. 输入一个提示词并发送
3. 打开扩展 Popup，应该看到：
   - "Recent captures" 中显示刚捕获的提示词
   - "pending: 1" 表示正在同步
4. 等待几秒后刷新 Dashboard，应该能看到新提示词

---

## 🔐 步骤 5: 配置 CORS（如果需要）

如果你的扩展需要从不同域名访问，需要设置 `EXTENSION_ORIGIN`：

1. 在 Render Dashboard 中，进入你的 Web 服务
2. 进入 **"Environment"** 标签
3. 添加环境变量：
   - **Key**: `EXTENSION_ORIGIN`
   - **Value**: `chrome-extension://你的扩展ID`
4. 点击 **"Save Changes"**（会自动重新部署）

**如何获取扩展 ID**：
- 在 `chrome://extensions/` 中，启用"开发者模式"
- 扩展卡片下方会显示 ID

---

## 📊 步骤 6: 监控和日志

### 查看日志
1. 在 Render Dashboard 中，进入你的 Web 服务
2. 点击 **"Logs"** 标签
3. 可以看到实时日志（JSON 格式）

### 监控指标
- **Health**: 在 Dashboard 中查看服务状态
- **Metrics**: 查看 CPU、内存使用情况

---

## 🐛 常见问题排查

### 问题 1: 部署失败
**检查**：
- 确保 `package.json` 中的脚本正确
- 查看 Render 日志中的错误信息
- 确保 Node.js 版本是 20+

### 问题 2: 数据库连接失败
**检查**：
- 确保数据库已创建
- 检查 `DATABASE_URL` 环境变量是否正确
- 运行 `npm run db:push` 初始化表结构

### 问题 3: 扩展无法同步
**检查**：
1. 扩展 Popup 中：
   - Server URL 是否正确（包含 `https://`）
   - API Token 是否正确
   - 查看 "last sync error" 是否有错误信息
2. Render 日志中：
   - 查看是否有 401/403 错误（认证失败）
   - 查看是否有 429 错误（速率限制）

### 问题 4: CORS 错误
**解决**：
- 设置 `EXTENSION_ORIGIN` 环境变量
- 确保 `APP_ORIGIN` 正确设置

---

## 🔄 更新部署

当你修改代码后：

```bash
# 1. 提交更改
git add .
git commit -m "更新功能"
git push origin main

# 2. Render 会自动检测并重新部署
# 或者手动触发：在 Render Dashboard 点击 "Manual Deploy"
```

---

## 📝 环境变量说明

| 变量名 | 说明 | 必需 | 默认值 |
|--------|------|------|--------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | ✅ | 自动从数据库服务获取 |
| `SESSION_SECRET` | Session 加密密钥 | ✅ | Render 自动生成 |
| `APP_ORIGIN` | 应用域名（用于 CORS） | ✅ | `https://spr-fullstack.onrender.com` |
| `EXTENSION_ORIGIN` | 扩展 ID（用于 CORS） | ❌ | 空 |
| `NODE_ENV` | 环境模式 | ✅ | `production` |
| `PORT` | 服务端口 | ❌ | `5000`（Render 自动设置） |
| `SENTRY_DSN` | Sentry 错误追踪 | ❌ | 空 |
| `INGEST_RATE_LIMIT_PER_MIN` | 每分钟请求限制 | ❌ | `120` |

---

## 🎉 完成！

部署成功后，你可以：
- ✅ 访问 Dashboard 查看和分析提示词
- ✅ 使用扩展自动捕获提示词
- ✅ 导出数据（JSON/CSV）
- ✅ 查看分析统计

**下一步**：
- 考虑设置自定义域名
- 配置 Sentry 进行错误追踪
- 根据使用情况调整速率限制

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Render 日志
2. 检查浏览器控制台（F12）
3. 查看扩展 Service Worker 日志（`chrome://extensions/` → 扩展详情 → Service Worker）

