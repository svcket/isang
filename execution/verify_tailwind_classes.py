#!/usr/bin/env python3
import os
import sys
import subprocess

def main():
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "src/components/"
    print(f"Running Tailwind verification on: {target_dir}")
    print("Checking for inline styles...")
    
    # Simple check for inline styles
    cmd = ["grep", "-rn", "style={{", target_dir]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.stdout:
            print("[WARNING] Found potential inline styles. Prefer Tailwind utility classes:")
            print(result.stdout)
        else:
            print("[OK] No inline styles detected.")
    except Exception as e:
        print(f"Error checking styles: {e}")

if __name__ == "__main__":
    main()
