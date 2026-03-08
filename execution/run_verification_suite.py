#!/usr/bin/env python3
import subprocess
import sys

def run_command(name, cmd_list):
    print(f"\n--- Running {name} ---")
    try:
        result = subprocess.run(cmd_list, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"[OK] {name} passed.")
            return True, result.stdout
        else:
            print(f"[ERROR] {name} failed.")
            print(result.stdout)
            print(result.stderr)
            return False, result.stdout
    except Exception as e:
        print(f"[ERROR] Could not execute {name}: {e}")
        return False, str(e)

def main():
    print("Running QA Verification Suite...")
    
    # Run TypeScript compiler
    tsc_check, _ = run_command("TypeScript (tsc)", ["npx", "tsc", "--noEmit"])
    
    # Run ESLint
    lint_check, _ = run_command("ESLint", ["npx", "eslint", "src/"])
    
    # Run Unit Tests
    test_check, _ = run_command("Vitest", ["npx", "vitest", "run"])
    
    if tsc_check and lint_check and test_check:
        print("\n✅ All QA checks passed!")
        sys.exit(0)
    else:
        print("\n❌ Verification suite failed. See errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
