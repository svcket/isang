#!/usr/bin/env python3
import os
import sys

def main():
    print("Auditing Security Rules...")
    
    errors = []
    
    # Check .env
    if os.path.exists(".env"):
        with open(".env", "r") as f:
            lines = f.readlines()
            for line in lines:
                if "NEXT_PUBLIC_" in line and "SECRET" in line.upper():
                    errors.append(f"Possible secret leaked to client via NEXT_PUBLIC_: {line.strip()}")
    else:
        print("[WARNING] No .env file found to audit locally.")

    # Check Next.js Config
    if os.path.exists("next.config.mjs"):
        with open("next.config.mjs", "r") as f:
            content = f.read()
            if "headers" not in content and "security_headers" not in content:
                print("[WARNING] Strict security headers are not aggressively applied in next.config.mjs")
                
    if errors:
        print("\n❌ Security Audit Failed:")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)
    else:
        print("\n✅ Security Audit Passed! No immediate red flags.")
        sys.exit(0)

if __name__ == "__main__":
    main()
