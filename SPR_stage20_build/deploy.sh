#!/bin/bash

# SPR 部署辅助脚本
# 这个脚本帮助你检查部署前的准备工作

echo "🚀 SPR 部署前检查"
echo "=================="
echo ""

# 检查 Git 状态
echo "📦 检查 Git 状态..."
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ 工作区干净，没有未提交的更改"
else
    echo "⚠️  发现未提交的更改："
    git status --short
    echo ""
    read -p "是否要提交这些更改？(y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "输入提交信息: " commit_msg
        git commit -m "${commit_msg:-准备部署}"
    fi
fi

# 检查是否已推送到远程
echo ""
echo "🌐 检查远程仓库..."
if git rev-parse --abbrev-ref --symbolic-full-name @{u} > /dev/null 2>&1; then
    echo "✅ 已设置远程分支"
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})
    if [ "$LOCAL" = "$REMOTE" ]; then
        echo "✅ 本地代码已是最新，已推送到远程"
    else
        echo "⚠️  本地有未推送的提交"
        read -p "是否要推送到远程？(y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push origin $(git branch --show-current)
        fi
    fi
else
    echo "⚠️  未设置远程分支"
    read -p "是否要添加远程仓库？(y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "输入远程仓库 URL: " remote_url
        git remote add origin "$remote_url"
        git push -u origin $(git branch --show-current)
    fi
fi

# 检查 render.yaml
echo ""
echo "📄 检查 render.yaml..."
if [ -f "render.yaml" ]; then
    echo "✅ render.yaml 存在"
    # 检查 APP_ORIGIN 是否已更新
    if grep -q "spr-fullstack.onrender.com" render.yaml; then
        echo "⚠️  APP_ORIGIN 仍使用默认值"
        echo "   部署后，如果应用名称不同，请在 Render Dashboard 中更新 APP_ORIGIN 环境变量"
    fi
else
    echo "❌ render.yaml 不存在！"
    exit 1
fi

# 检查 package.json
echo ""
echo "📦 检查 package.json..."
if [ -f "package.json" ]; then
    echo "✅ package.json 存在"
    # 检查关键脚本
    if grep -q '"build"' package.json && grep -q '"start"' package.json; then
        echo "✅ 构建和启动脚本已配置"
    else
        echo "❌ 缺少必要的脚本"
        exit 1
    fi
else
    echo "❌ package.json 不存在！"
    exit 1
fi

# 总结
echo ""
echo "=================="
echo "✅ 检查完成！"
echo ""
echo "📝 下一步："
echo "1. 访问 https://dashboard.render.com"
echo "2. 点击 'New +' → 'Blueprint'"
echo "3. 选择你的 GitHub 仓库"
echo "4. 点击 'Apply' 开始部署"
echo ""
echo "📚 详细说明请查看 DEPLOYMENT.md 或 QUICK_START.md"

