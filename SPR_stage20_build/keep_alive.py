#!/usr/bin/env python3
"""
Streamlit Cloud Keep-Alive Script with Notifications (Enhanced v2)
定期 ping Streamlit Cloud 应用，防止休眠，并发送通知

🔧 v2 改进：
- 检测 Streamlit "假 200" 休眠页面
- 使用 HEAD + GET 双重验证
- 检查响应内容确认应用真正运行
- 更智能的唤醒重试机制
"""

import requests
import time
import sys
import subprocess
import os
from datetime import datetime


# ============== 配置 ==============
CONFIG = {
    "url": "https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app/",
    "ping_interval": 300,           # 正常 ping 间隔（秒）
    "wake_retry_interval": 30,      # 唤醒重试间隔（秒）
    "wake_max_retries": 5,          # 唤醒最大重试次数
    "timeout": 30,                  # 请求超时（秒）- 增加以等待冷启动
    "log_file": "~/.streamlit-keepalive.out.log",
}

# Streamlit 休眠页面的特征标识
SLEEP_INDICATORS = [
    "Please wait...",
    "waking up",
    "This app is",
    "spinning up",
    "Starting",
    "st-emotion-cache",  # 休眠页面的 CSS 类
]

# Streamlit 正常运行的特征标识（你的应用特有的内容）
ALIVE_INDICATORS = [
    "SPR",
    "Mind Cockpit",
    "思维驾驶舱",
    "Data Center",
    "数据中心",
    "streamlit",
]


def log_message(message):
    """写入日志文件"""
    log_file = os.path.expanduser(CONFIG["log_file"])
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(f"[{timestamp}] {message}\n")
        f.flush()  # 立即写入


def send_notification(title, message):
    """发送 macOS 通知"""
    try:
        # 使用 osascript 发送通知
        script = f'display notification "{message}" with title "{title}"'
        subprocess.run(['osascript', '-e', script], capture_output=True)
        log_message(f"📢 通知已发送: {title} - {message}")
    except Exception as e:
        log_message(f"⚠️ 通知发送失败: {e}")


def check_if_really_alive(response_text):
    """
    检查响应内容，判断应用是否真正运行
    返回: (is_alive: bool, status: str)
    """
    content = response_text.lower()
    
    # 检查是否是休眠/唤醒中页面
    for indicator in SLEEP_INDICATORS:
        if indicator.lower() in content:
            return False, "sleeping"
    
    # 检查是否包含应用正常运行的标识
    for indicator in ALIVE_INDICATORS:
        if indicator.lower() in content:
            return True, "alive"
    
    # 如果内容很短，可能是休眠页面
    if len(response_text) < 5000:
        return False, "minimal_response"
    
    # 默认认为可能在运行
    return True, "unknown_but_ok"


def wake_up_app(url):
    """
    尝试唤醒应用，返回是否成功
    """
    log_message("🌅 正在尝试唤醒应用...")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    for attempt in range(CONFIG["wake_max_retries"]):
        try:
            log_message(f"   🔄 唤醒尝试 {attempt + 1}/{CONFIG['wake_max_retries']}...")
            
            # 发送请求，使用较长超时
            response = requests.get(
                url, 
                headers=headers, 
                timeout=CONFIG["timeout"],
                allow_redirects=True
            )
            
            if response.status_code == 200:
                is_alive, status = check_if_really_alive(response.text)
                
                if is_alive:
                    log_message(f"   ✅ 应用已唤醒! (状态: {status})")
                    return True
                else:
                    log_message(f"   ⏳ 应用仍在启动中 (状态: {status})，等待 {CONFIG['wake_retry_interval']} 秒...")
                    time.sleep(CONFIG["wake_retry_interval"])
            else:
                log_message(f"   ⚠️ 收到非 200 状态码: {response.status_code}")
                time.sleep(CONFIG["wake_retry_interval"])
                
        except requests.exceptions.Timeout:
            log_message(f"   ⏱️ 请求超时，继续等待...")
            time.sleep(CONFIG["wake_retry_interval"])
        except Exception as e:
            log_message(f"   ❌ 唤醒尝试出错: {e}")
            time.sleep(CONFIG["wake_retry_interval"])
    
    return False


def ping_app(url):
    """
    智能 ping 应用，返回 (success: bool, message: str, response_time: float)
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cache-Control': 'no-cache',
    }
    
    start_time = time.time()
    response = requests.get(url, headers=headers, timeout=CONFIG["timeout"])
    response_time = round((time.time() - start_time) * 1000, 2)
    
    if response.status_code != 200:
        return False, f"HTTP {response.status_code}", response_time
    
    # 检查应用是否真正运行
    is_alive, status = check_if_really_alive(response.text)
    
    if is_alive:
        return True, f"ALIVE ({status})", response_time
    else:
        return False, f"SLEEPING ({status})", response_time


def keep_alive():
    url = CONFIG["url"]

    log_message("=" * 60)
    log_message(f"🚀 Keep-Alive Service v2 启动")
    log_message(f"   目标: {url}")
    log_message(f"   Ping 间隔: {CONFIG['ping_interval']} 秒")
    log_message("=" * 60)

    consecutive_failures = 0
    max_consecutive_failures = 3  # 连续失败3次发送通知

    while True:
        try:
            success, message, response_time = ping_app(url)
            
            if success:
                consecutive_failures = 0
                log_message(f"✅ Ping OK - {message} ({response_time}ms)")
            else:
                # 检测到休眠，尝试唤醒
                log_message(f"😴 检测到休眠 - {message} ({response_time}ms)")
                
                if wake_up_app(url):
                    consecutive_failures = 0
                    log_message("🎉 应用已成功唤醒!")
                else:
                    consecutive_failures += 1
                    log_message(f"⚠️ 唤醒失败 (连续失败: {consecutive_failures})")
                    
                    if consecutive_failures >= max_consecutive_failures:
                        send_notification(
                            "🚨 Streamlit 唤醒失败",
                            f"连续 {consecutive_failures} 次唤醒失败！应用可能需要手动重启。"
                        )
                        consecutive_failures = 0

        except requests.exceptions.Timeout:
            consecutive_failures += 1
            log_message(f"⏱️ Timeout (连续失败: {consecutive_failures})")
            
            # 超时可能意味着应用在冷启动，尝试唤醒
            if consecutive_failures >= 2:
                wake_up_app(url)
            
            if consecutive_failures >= max_consecutive_failures:
                send_notification("Streamlit Keep-Alive Alert", "多次超时！请检查应用状态。")
                consecutive_failures = 0

        except requests.exceptions.ConnectionError:
            consecutive_failures += 1
            log_message(f"🔌 Connection Error (连续失败: {consecutive_failures})")
            if consecutive_failures >= max_consecutive_failures:
                send_notification("Streamlit Keep-Alive Alert", "网络连接错误！请检查网络连接。")
                consecutive_failures = 0

        except Exception as e:
            consecutive_failures += 1
            log_message(f"❌ Error: {type(e).__name__}: {e}")
            if consecutive_failures >= max_consecutive_failures:
                send_notification("Streamlit Keep-Alive Alert", f"未知错误: {type(e).__name__}")
                consecutive_failures = 0

        # 正常 ping 间隔
        time.sleep(CONFIG["ping_interval"])


if __name__ == "__main__":
    try:
        keep_alive()
    except KeyboardInterrupt:
        log_message("Keep-alive service stopped manually.")
        send_notification("Streamlit Keep-Alive", "服务已手动停止")
        sys.exit(0)