#!/usr/bin/env python3
import os
import subprocess
import sys

def main():
    """Runs a targeted state store test using Vitest."""
    if len(sys.argv) < 2:
        print("Usage: python test_zustand_store.py <store_name>")
        print("Example: python test_zustand_store.py panel-store")
        sys.exit(1)
        
    store_name = sys.argv[1]
    test_path = f"tests/unit/{store_name}.test.ts"
    
    if not os.path.exists(test_path):
        print(f"[ERROR] Test file not found: {test_path}")
        print("Falling back to full unit test suite matching '*store*'...")
        test_path = "store"
        
    print(f"Running state orchestration tests for: {test_path}")
    cmd = ["npx", "vitest", "run", test_path]
    
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Tests failed with exit code: {e.returncode}")
        sys.exit(e.returncode)

if __name__ == "__main__":
    main()
