import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

print("Logging in...")
login_data = urllib.parse.urlencode({
    "username": "test4@example.com",
    "password": "Password123!"
}).encode('utf-8')

req = urllib.request.Request(f"{BASE_URL}/auth/login", data=login_data, method="POST")
req.add_header("Content-Type", "application/x-www-form-urlencoded")

try:
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode())
        token = res_data.get("access_token")
        print(f"Token acquired.")
except urllib.error.HTTPError as e:
    print(f"Login failed: {e.code} {e.read().decode()}")
    sys.exit(1)

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

print("Swiping on scholarship ID 1...")
swipe_payload = json.dumps({"scholarship_id": 1, "action": "save"}).encode('utf-8')
req2 = urllib.request.Request(f"{BASE_URL}/swipe", data=swipe_payload, headers=headers, method="POST")

try:
    with urllib.request.urlopen(req2) as response:
        print("Swipe returned:", response.status, response.read().decode())
except urllib.error.HTTPError as e:
    print("Swipe failed:", e.code, e.read().decode())

print("Fetching applications...")
req3 = urllib.request.Request(f"{BASE_URL}/applications", headers=headers, method="GET")
try:
    with urllib.request.urlopen(req3) as response:
        print("Apps returned:", response.status, response.read().decode())
except urllib.error.HTTPError as e:
    print("Apps failed:", e.code, e.read().decode())
