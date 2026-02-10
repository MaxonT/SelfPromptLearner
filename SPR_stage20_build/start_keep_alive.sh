#!/bin/bash
# 🚀 SPR Keep-Alive 一键启动 - 已预配置
# 此脚本已配置为你的 Streamlit 应用：
# https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app

set -e

APP_URL="https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app"
LOG_DIR="$HOME/.spr/logs"
CONFIG_DIR="$HOME/.spr"

echo "🚀 SPR Streamlit Keep-Alive 一键启动"
echo "======================================"
echo "应用: $APP_URL"
echo ""

# 检查依赖
if ! python3 -c "import requests" 2>/dev/null; then
    echo "📥 安装依赖: requests"
    pip3 install requests
fi

# 创建日志目录
mkdir -p "$LOG_DIR"

# 检查是否已在运行
if pgrep -f "python.*keep_alive.py" > /dev/null; then
    echo "⚠️  已有 keep_alive 进程在运行"
    read -p "是否要停止并重启？ (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🛑 停止现有进程..."
        pkill -f "python.*keep_alive.py" || true
        sleep 1
    else
        echo "✅ 保持现有进程运行"
        tail -f "$LOG_DIR/keep_alive.log"
        exit 0
    fi
fi

# 创建启动脚本
cat > "$CONFIG_DIR/keep_alive_launcher.sh" << 'LAUNCHER_SCRIPT'
#!/bin/bash
export STREAMLIT_APP_URL="https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app"
export KEEP_ALIVE_INTERVAL=240
cd "$(dirname "$0")/../../Desktop/Github/SelfPromptLearner/SPR_stage20_build" || cd ~
python3 keep_alive.py >> "$HOME/.spr/logs/keep_alive.log" 2>&1
LAUNCHER_SCRIPT
chmod +x "$CONFIG_DIR/keep_alive_launcher.sh"

# 后台启动
echo "🔧 启动 Keep-Alive..."
nohup "$CONFIG_DIR/keep_alive_launcher.sh" > /dev/null 2>&1 &
sleep 1

# 验证
if pgrep -f "python.*keep_alive.py" > /dev/null; then
    echo ""
    echo "✅ Keep-Alive 已启动！"
    echo ""
    echo "📊 实时监控:"
    echo "  tail -f $LOG_DIR/keep_alive.log"
    echo ""
    echo "🛑 停止 Keep-Alive:"
    echo "  pkill -f 'python.*keep_alive.py'"
    echo ""
    echo "📍 应用地址: $APP_URL"
    echo ""
    sleep 2
    echo "📺 显示实时日志..."
    echo "======================================"
    tail -f "$LOG_DIR/keep_alive.log"
else
    echo "❌ 启动失败，请检查日志:"
    cat "$LOG_DIR/keep_alive.log" 2>/dev/null || echo "无日志输出"
    exit 1
fi
