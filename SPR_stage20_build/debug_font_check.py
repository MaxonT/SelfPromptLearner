import os
import platform

print(f"System: {platform.system()}")

candidates = [
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/Library/Fonts/Arial Unicode.ttf",
    "/System/Library/Fonts/Hiragino Sans.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/STHeiti Medium.ttc",
    "/System/Library/Fonts/STHeiti Light.ttc",
    "/System/Library/Fonts/AppleGothic.ttf"
]

for path in candidates:
    exists = os.path.exists(path)
    print(f"Path: '{path}' -> Exists: {exists}")
    if not exists:
        # Try to list directory to see what IS there
        dirname = os.path.dirname(path)
        basename = os.path.basename(path)
        if os.path.exists(dirname):
            print(f"  Dir '{dirname}' exists. Listing match:")
            try:
                files = os.listdir(dirname)
                for f in files:
                    if basename.lower() in f.lower():
                        print(f"    Found similar: {f}")
            except Exception as e:
                print(f"    Error listing dir: {e}")
        else:
            print(f"  Dir '{dirname}' does NOT exist.")
