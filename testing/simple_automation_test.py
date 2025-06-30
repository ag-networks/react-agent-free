#!/usr/bin/env python3
"""
Agent Free Platform - Simple Automated Testing Script
Robust browser automation with better error handling
"""

import asyncio
import os
from datetime import datetime
from pathlib import Path
from playwright.async_api import async_playwright
import time

class SimpleAgentFreeTester:
    def __init__(self):
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.screenshots_dir = Path(f"agent_free_screenshots_{self.timestamp}")
        self.screenshots_dir.mkdir(exist_ok=True)
        
        # Application URLs
        self.radix_url = "https://ezlfspdv.manus.space"
        
        # Test credentials
        self.test_username = "manusrocks"
        self.test_password = "thankyoumanus"
        
        self.screenshot_count = 0

    async def safe_screenshot(self, page, name, description=""):
        """Take a screenshot with error handling"""
        try:
            self.screenshot_count += 1
            filename = f"{self.screenshot_count:02d}_{name}.png"
            filepath = self.screenshots_dir / filename
            
            await page.screenshot(path=str(filepath), full_page=True, timeout=10000)
            print(f"✅ Screenshot {self.screenshot_count}: {name}")
            return str(filepath)
        except Exception as e:
            print(f"❌ Failed to take screenshot {name}: {e}")
            return None

    async def test_application(self):
        """Test the deployed application"""
        print(f"\n🎯 Testing Agent Free Application")
        print(f"URL: {self.radix_url}")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(viewport={'width': 1920, 'height': 1080})
            page = await context.new_page()
            
            try:
                # Set longer timeout
                page.set_default_timeout(15000)
                
                # 1. Homepage
                print("📍 Loading homepage...")
                await page.goto(self.radix_url, wait_until='domcontentloaded')
                await asyncio.sleep(3)
                await self.safe_screenshot(page, "homepage", "Agent Free Homepage")
                
                # 2. Try to find and click Sign In
                print("📍 Looking for Sign In button...")
                try:
                    await page.click('text=Sign In', timeout=5000)
                    await asyncio.sleep(2)
                    await self.safe_screenshot(page, "login_page", "Login Page")
                    
                    # 3. Fill login form
                    print("📍 Filling login form...")
                    await page.fill('input[placeholder*="username"]', self.test_username)
                    await page.fill('input[placeholder*="password"]', self.test_password)
                    await self.safe_screenshot(page, "login_filled", "Login Form Filled")
                    
                    # 4. Submit login
                    print("📍 Submitting login...")
                    await page.click('button:has-text("Sign In")')
                    await asyncio.sleep(3)
                    await self.safe_screenshot(page, "dashboard", "User Dashboard")
                    
                except Exception as e:
                    print(f"⚠️ Login flow error: {e}")
                    await self.safe_screenshot(page, "current_state", "Current Page State")
                
                print(f"✅ Testing completed. Screenshots saved to: {self.screenshots_dir}")
                
            except Exception as e:
                print(f"❌ General error: {e}")
                await self.safe_screenshot(page, "error_state", "Error State")
            
            finally:
                await browser.close()

    def create_summary_report(self):
        """Create a simple text summary report"""
        report_file = f"agent_free_test_report_{self.timestamp}.txt"
        
        with open(report_file, 'w') as f:
            f.write("AGENT FREE PLATFORM - TESTING REPORT\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Application URL: {self.radix_url}\n")
            f.write(f"Screenshots Directory: {self.screenshots_dir}\n")
            f.write(f"Total Screenshots: {self.screenshot_count}\n\n")
            
            f.write("TEST CREDENTIALS:\n")
            f.write(f"Username: {self.test_username}\n")
            f.write(f"Password: {self.test_password}\n\n")
            
            f.write("SCREENSHOTS TAKEN:\n")
            for i, screenshot_file in enumerate(sorted(self.screenshots_dir.glob("*.png")), 1):
                f.write(f"{i}. {screenshot_file.name}\n")
            
            f.write("\nNOTES:\n")
            f.write("- Use these credentials to manually test the application\n")
            f.write("- Screenshots show the current state of the Radix UI version\n")
            f.write("- Material-UI version is under development\n")
        
        print(f"📄 Report saved: {report_file}")
        return report_file

async def main():
    tester = SimpleAgentFreeTester()
    await tester.test_application()
    tester.create_summary_report()

if __name__ == "__main__":
    asyncio.run(main())

