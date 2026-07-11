import urllib.request
import urllib.error
import json
import time

API_URL = "https://apivale.com/v1/chat/completions"
API_KEY = "sk-1ah8EaFuZiLDmq7YbSEKgUigAyfgaQef59VztvfeWX8h0hw6"

MODELS = ["gpt-5.6-luna", "gpt-5.6-terra", "gpt-5.6-sol"]

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

payload_template = {
    "messages": [
        {"role": "system", "content": "You are a coding assistant. Reply with only the code."},
        {"role": "user", "content": "Write a Python function to calculate the Fibonacci sequence up to N."}
    ]
}

print("Running benchmarks...")
for model in MODELS:
    payload = payload_template.copy()
    payload["model"] = model
    data = json.dumps(payload).encode('utf-8')
    
    req = urllib.request.Request(API_URL, data=data, headers=headers, method='POST')
    
    start_time = time.time()
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            end_time = time.time()
            latency = (end_time - start_time) * 1000 # in ms
            
            resp_data = json.loads(response.read().decode('utf-8'))
            usage = resp_data.get("usage", {})
            prompt_tokens = usage.get("prompt_tokens", 0)
            completion_tokens = usage.get("completion_tokens", 0)
            print(f"Model: {model}")
            print(f"  Latency: {latency:.2f} ms")
            print(f"  Input Tokens: {prompt_tokens}")
            print(f"  Output Tokens: {completion_tokens}")
            print(f"  Success: True\n")
    except urllib.error.HTTPError as e:
        print(f"Model: {model}")
        print(f"  Failed: HTTP {e.code}")
        print(f"  Response: {e.read().decode('utf-8')}\n")
    except Exception as e:
        print(f"Model: {model}")
        print(f"  Failed: {e}\n")
