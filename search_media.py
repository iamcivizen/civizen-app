import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

log_path = r"C:\Users\harsh\.gemini\antigravity\brain\be08a976-92c8-438d-aff9-5c291993aecf\.system_generated\logs\transcript_full.jsonl"

matches = []
with open(log_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'media__' in line or '1782376358183' in line or 'preview' in line.lower():
            try:
                data = json.loads(line)
                content = data.get('content', '')[:400]
                matches.append((i, data.get('type', ''), len(data.get('tool_calls', [])), content, data.get('tool_calls', [])))
            except Exception as e:
                matches.append((i, 'error', 0, str(e), []))

print(f"Total matches in previous conversation: {len(matches)}")
for m in matches:
    print(f"Line {m[0]} | Type: {m[1]} | Tools: {m[2]} calls")
    print(f"  Content: {m[3]}")
    if m[4]:
        print(f"  Tool Calls: {m[4]}")
    print("-" * 50)
