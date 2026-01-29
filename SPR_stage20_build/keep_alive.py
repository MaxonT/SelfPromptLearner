#!/usr/bin/env python3
"""
Streamlit Cloud Keep-Alive Script with Notifications
定期 ping Streamlit Cloud 应用，防止休眠，并发送通知
"""

import requests
import time
import sys
import subprocess
import os
from datetime import datetime


def log_message(message):
    """写入日志文件"""
    log_file = os.path.expanduser("~/.streamlit-keepalive.out.log")
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
        log_message(f"通知已发送: {title} - {message}")
    except Exception as e:
        log_message(f"通知发送失败: {e}")


def keep_alive():
    url = "https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app/"

    log_message(f"Starting keep-alive service for {url}")
    log_message("Keep-alive service started. Press Ctrl+C to stop.")

    consecutive_failures = 0
    max_consecutive_failures = 3  # 连续失败3次发送通知

    while True:
        try:
            start_time = time.time()
            response = requests.get(url, timeout=10)
            end_time = time.time()
            response_time = round((end_time - start_time) * 1000, 2)  # 毫秒

            if response.status_code == 200:
                consecutive_failures = 0  # 重置失败计数
                log_message(f"✅ Ping OK - Status: {response.status_code} ({response_time}ms)")
            else:
                consecutive_failures += 1
                log_message(f"⚠️ Ping Warning - Status: {response.status_code} ({response_time}ms)")

            # 如果连续失败达到阈值，发送通知
            if consecutive_failures >= max_consecutive_failures:
                send_notification(
                    "Streamlit Keep-Alive Alert",
                    f"连续 {consecutive_failures} 次 ping 失败！请检查网络或应用状态。"
                )
                consecutive_failures = 0  # 重置计数，避免重复通知

        except requests.exceptions.Timeout:
            consecutive_failures += 1
            log_message("⏱️ Timeout - Server might be waking up")
            if consecutive_failures >= max_consecutive_failures:
                send_notification("Streamlit Keep-Alive Alert", "网络超时！应用可能需要更长时间启动。")
                consecutive_failures = 0

        except requests.exceptions.ConnectionError:
            consecutive_failures += 1
            log_message("🔌 Connection Error")
            if consecutive_failures >= max_consecutive_failures:
                send_notification("Streamlit Keep-Alive Alert", "网络连接错误！请检查网络连接。")
                consecutive_failures = 0

        except Exception as e:
            consecutive_failures += 1
            log_message(f"❌ Error: {type(e).__name__}: {e}")
            if consecutive_failures >= max_consecutive_failures:
                send_notification("Streamlit Keep-Alive Alert", f"未知错误: {type(e).__name__}")
                consecutive_failures = 0

        # 每 5 分钟 ping 一次
        time.sleep(300)


if __name__ == "__main__":
    try:
        keep_alive()
    except KeyboardInterrupt:
        log_message("Keep-alive service stopped manually.")
        send_notification("Streamlit Keep-Alive", "服务已手动停止")
        sys.exit(0)