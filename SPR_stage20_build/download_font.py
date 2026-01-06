import os
import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

# Updated URL: GitHub Raw for Noto Sans SC (Reliable mirror)
# Using jsdelivr or a specific commit hash can be more stable, but let's try a known valid raw URL
# This one is Noto Sans SC Regular
FONT_URL = "https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC-Regular.ttf"

# Alternative: WenQuanYi Micro Hei (Smaller, often used in Linux distros)
# FONT_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/maShanZheng/MaShanZheng-Regular.ttf" # Just testing another one if Noto fails

# Let's try a very standard one that is definitely there. 
# "Ma Shan Zheng" is a calligraphy font, maybe too fancy.
# Let's try Noto Sans SC again but check the URL carefully.
# The previous 404 might be due to directory structure changes in google/fonts repo.
# Let's use a CDN for stability.
FONT_URL = "https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf"

# Actually, let's use a smaller, guaranteed source.
# FONT_URL = "https://github.com/adobe-fonts/source-han-sans/raw/release/OTF/SimplifiedChinese/SourceHanSansSC-Regular.otf" # This is huge (Release page)

# Best bet: Use a specific raw file from a smaller repo or a CDN.
# Let's try to get it from a stable third party or use a different font.
# "ZCOOL XiaoWei" - readable and on Google Fonts.
FONT_URL = "https://github.com/google/fonts/raw/main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf"


DEST_DIR = "mirror/fonts"
DEST_FILE = os.path.join(DEST_DIR, "ZCOOLXiaoWei-Regular.ttf")

def download_font():
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)
        
    print(f"Downloading font from {FONT_URL}...")
    try:
        urllib.request.urlretrieve(FONT_URL, DEST_FILE)
        print(f"✅ Font downloaded successfully to: {DEST_FILE}")
        print(f"File size: {os.path.getsize(DEST_FILE) / 1024 / 1024:.2f} MB")
    except Exception as e:
        print(f"❌ Download failed: {e}")

if __name__ == "__main__":
    download_font()
