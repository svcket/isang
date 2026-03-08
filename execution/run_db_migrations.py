#!/usr/bin/env python3
import subprocess
import sys
import os

def main():
    print("Running Supabase Database Migrations...")
    
    if not os.path.exists("supabase/migrations/"):
        print("[ERROR] Supabase migrations folder not found. Are we tracking DB locally?")
        sys.exit(1)
        
    cmd = ["npx", "supabase", "migration", "up"]
    # Fallback to general execution output if command lacks context
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"[OK] Migrations applied successfully.")
            print(result.stdout)
            sys.exit(0)
        else:
            print(f"[ERROR] Migrations failed.")
            print(result.stdout)
            print(result.stderr)
            sys.exit(1)
    except Exception as e:
        print(f"[ERROR] Could not run supabase migration: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
