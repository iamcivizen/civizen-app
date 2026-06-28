import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

log_path = r"C:\Users\harsh\.gemini\antigravity\brain\4fd08ee5-bb12-433c-ba6a-c48785e75309\.system_generated\logs\transcript.jsonl"

matches = []
with open(log_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'preview' in line.lower() or 'localhost' in line.lower():
            try:
                data = json.loads(line)
                content = data.get('content', '')[:300]
                matches.append((i, data.get('type', ''), len(data.get('tool_calls', [])), content))
            except Exception as e:
                matches.append((i, 'error', 0, str(e)))

print(f"Total matches found: {len(matches)}")
for m in matches:
    print(f"Line {m[0]} | Type: {m[1]} | Tools: {m[2]} calls")
    print(f"  Content: {m[3]}")
    print("-" * 50)
