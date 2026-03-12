#!/usr/bin/env python3
"""
Echelon Screenshot Exporter

Takes a 2x PNG screenshot of every screen in the app.
Outputs to ./screenshots/ folder.

Usage:
    cd backend && source .venv/bin/activate
    python ../take_screenshots.py
"""

import os
import json
import time
import requests
from playwright.sync_api import sync_playwright

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")
BASE_URL = "http://localhost:3000"
API_URL = "http://localhost:8000/api"

WIDTH = 393
HEIGHT = 850

SCREENS = [
    {"id": "01_splash",      "path": "/",                    "needs_auth": False, "wait": 2},
    {"id": "02_login",       "path": "/login",               "needs_auth": False, "wait": 2},
    {"id": "03_onboarding",  "path": "/onboarding",          "needs_auth": True,  "wait": 3},
    {"id": "04_discover",    "path": "/dashboard/discover",   "needs_auth": True,  "wait": 6},
    {"id": "05_tracker",     "path": "/dashboard/tracker",    "needs_auth": True,  "wait": 5},
    {"id": "06_alerts",      "path": "/dashboard/alerts",     "needs_auth": True,  "wait": 4},
    {"id": "07_profile",     "path": "/dashboard/profile",    "needs_auth": True,  "wait": 4},
]


def get_token():
    """Get JWT token from the API."""
    r = requests.post(
        f"{API_URL}/auth/login",
        data={"username": "demo@echelon.ai", "password": "demo123"}
    )
    r.raise_for_status()
    return r.json()["access_token"]


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"\nEchelon Screenshot Exporter")
    print(f"Output: {OUTPUT_DIR}/")
    print(f"Size: {WIDTH}x{HEIGHT} @2x\n")

    # Get auth token via API
    print("Getting auth token...")
    token = get_token()
    print(f"Got token\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # ── Non-auth screens (clean context, no token) ──
        print("--- Non-auth screens ---")
        ctx = browser.new_context(
            viewport={"width": WIDTH, "height": HEIGHT},
            device_scale_factor=2,
        )
        page = ctx.new_page()

        for screen in SCREENS:
            if screen["needs_auth"]:
                continue
            name = screen["id"]
            url = BASE_URL + screen["path"]
            print(f"  [{name}] {url}")
            page.goto(url, wait_until="networkidle")
            time.sleep(screen["wait"])
            filepath = os.path.join(OUTPUT_DIR, f"{name}.png")
            page.screenshot(path=filepath, full_page=False)
            size_kb = os.path.getsize(filepath) // 1024
            print(f"  [{name}] Saved ({size_kb} KB)")

        ctx.close()

        # ── Auth screens (inject token into localStorage) ──
        print("\n--- Auth screens ---")
        ctx2 = browser.new_context(
            viewport={"width": WIDTH, "height": HEIGHT},
            device_scale_factor=2,
        )
        page2 = ctx2.new_page()

        # Navigate to base URL first so localStorage is on the right origin
        page2.goto(BASE_URL, wait_until="networkidle")
        time.sleep(1)

        # Inject token into localStorage
        page2.evaluate(f"""() => {{
            localStorage.setItem('token', '{token}');
        }}""")
        print("  Token injected into localStorage")

        for screen in SCREENS:
            if not screen["needs_auth"]:
                continue
            name = screen["id"]
            url = BASE_URL + screen["path"]
            print(f"  [{name}] {url}")

            page2.goto(url, wait_until="networkidle")
            time.sleep(screen["wait"])

            filepath = os.path.join(OUTPUT_DIR, f"{name}.png")
            page2.screenshot(path=filepath, full_page=False)
            size_kb = os.path.getsize(filepath) // 1024
            print(f"  [{name}] Saved ({size_kb} KB)")

        ctx2.close()
        browser.close()

    print(f"\n{'=' * 50}")
    print(f"Done! {len(SCREENS)} screenshots saved to ./screenshots/")
    print(f"{'=' * 50}")
    for f in sorted(os.listdir(OUTPUT_DIR)):
        if f.endswith(".png"):
            size_kb = os.path.getsize(os.path.join(OUTPUT_DIR, f)) // 1024
            print(f"  {f}  ({size_kb} KB)")


if __name__ == "__main__":
    main()
