#!/usr/bin/env python3
import os
import sys
import json

def validate_json_file(filepath):
    """Validates that a JSON file is well-formed."""
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        print(f"[OK] {filepath} is valid JSON.")
        return True, data
    except Exception as e:
        print(f"[ERROR] Failed to parse {filepath}: {e}")
        return False, None

def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_response_schema.py <path_to_mock_json>")
        sys.exit(1)
        
    filepath = sys.argv[1]
    if not os.path.exists(filepath):
        print(f"[ERROR] File not found: {filepath}")
        sys.exit(1)
        
    validate_json_file(filepath)

if __name__ == "__main__":
    main()
