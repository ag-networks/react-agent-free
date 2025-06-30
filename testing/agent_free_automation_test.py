#!/usr/bin/env python3
"""
Agent Free Platform - Automated Testing Script
Comprehensive browser automation using Playwright to test both Radix UI and Material-UI versions
Generates PDF report with screenshots of all screens for focus group testing
"""

import asyncio
import os
from datetime import datetime
from pathlib import Path
from playwright.async_api import async_playwright
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from PIL import Image as PILImage
import time

class AgentFreeAutomationTester:
    def __init__(self):
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.screenshots_dir = Path(f"screenshots_{self.timestamp}")
        self.screenshots_dir.mkdir(exist_ok=True)
        
        # Application URLs
        self.radix_url = "https://ezlfspdv.manus.space"
        self.mui_url = "http://localhost:5174"  # Will update if MUI is deployed
        
        # Test credentials
        self.test_username = "manusrocks"
        self.test_password = "thankyoumanus"
        
        # Screenshot counter
        self.screenshot_count = 0
        self.screenshots = []

    async def take_screenshot(self, page, name, description=""):
        """Take a screenshot and save it with metadata"""
        self.screenshot_count += 1
        filename = f"{self.screenshot_count:02d}_{name}.png"
        filepath = self.screenshots_dir / filename
        
        await page.screenshot(path=str(filepath), full_page=True)
        
        self.screenshots.append({
            'path': str(filepath),
            'name': name,
            'description': description,
            'timestamp': datetime.now().strftime("%H:%M:%S")
        })
        
        print(f"📸 Screenshot {self.screenshot_count}: {name}")
        return str(filepath)

    async def wait_and_screenshot(self, page, name, description="", wait_time=2):
        """Wait for page to load and take screenshot"""
        await page.wait_for_load_state('networkidle')
        await asyncio.sleep(wait_time)
        return await self.take_screenshot(page, name, description)

    async def test_radix_application(self, browser):
        """Test the Radix UI version of Agent Free"""
        print("\n🎯 Testing Radix UI Application")
        print(f"URL: {self.radix_url}")
        
        context = await browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = await context.new_page()
        
        try:
            # 1. Homepage
            await page.goto(self.radix_url)
            await self.wait_and_screenshot(page, "radix_homepage", 
                "Radix UI Homepage - Clean, professional design with savings messaging")
            
            # 2. Navigate to Login
            await page.click('text=Sign In')
            await self.wait_and_screenshot(page, "radix_login_page", 
                "Radix UI Login Page - Demo credentials displayed")
            
            # 3. Test Login Flow
            await page.fill('input[placeholder="Enter your username"]', self.test_username)
            await page.fill('input[placeholder="Enter your password"]', self.test_password)
            await self.wait_and_screenshot(page, "radix_login_filled", 
                "Radix UI Login Form - Credentials entered")
            
            # 4. Submit Login
            await page.click('button:has-text("Sign In")')
            await self.wait_and_screenshot(page, "radix_dashboard", 
                "Radix UI Dashboard - Main user interface with transactions and stats")
            
            # 5. Test Navigation - Scroll to see more content
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight/2)")
            await asyncio.sleep(1)
            await self.take_screenshot(page, "radix_dashboard_scrolled", 
                "Radix UI Dashboard - Scrolled view showing transaction details")
            
            # 6. Test Logout
            await page.click('button:has-text("Sign Out")')
            await self.wait_and_screenshot(page, "radix_after_logout", 
                "Radix UI After Logout - Redirected to homepage")
            
            print("✅ Radix UI testing completed successfully")
            
        except Exception as e:
            print(f"❌ Error testing Radix UI: {e}")
            await self.take_screenshot(page, "radix_error", f"Error occurred: {e}")
        
        finally:
            await context.close()

    async def test_mui_application(self, browser):
        """Test the Material-UI version of Agent Free"""
        print("\n🎯 Testing Material-UI Application")
        print(f"URL: {self.mui_url}")
        
        context = await browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = await context.new_page()
        
        try:
            # Check if MUI app is available
            response = await page.goto(self.mui_url)
            if response.status != 200:
                print("⚠️ MUI application not available, creating placeholder screenshots")
                await self.create_mui_placeholder_screenshots()
                return
            
            # 1. Homepage
            await self.wait_and_screenshot(page, "mui_homepage", 
                "Material-UI Homepage - Warm, inviting Material Design aesthetic")
            
            # 2. Navigate to Login (if available)
            try:
                await page.click('text=Sign In', timeout=5000)
                await self.wait_and_screenshot(page, "mui_login_page", 
                    "Material-UI Login Page - Material Design form components")
                
                # 3. Test Login Flow
                await page.fill('input[name="username"]', self.test_username)
                await page.fill('input[name="password"]', self.test_password)
                await self.wait_and_screenshot(page, "mui_login_filled", 
                    "Material-UI Login Form - Credentials entered")
                
                # 4. Submit Login
                await page.click('button:has-text("Sign In")')
                await self.wait_and_screenshot(page, "mui_dashboard", 
                    "Material-UI Dashboard - Material Design interface")
                
            except Exception as e:
                print(f"⚠️ MUI navigation limited: {e}")
                await self.take_screenshot(page, "mui_current_state", 
                    "Material-UI Current State - Available interface")
            
            print("✅ Material-UI testing completed")
            
        except Exception as e:
            print(f"❌ Error testing Material-UI: {e}")
            await self.create_mui_placeholder_screenshots()
        
        finally:
            await context.close()

    async def create_mui_placeholder_screenshots(self):
        """Create placeholder screenshots for MUI if not available"""
        print("📝 Creating MUI placeholder information")
        self.screenshots.append({
            'path': None,
            'name': "mui_placeholder",
            'description': "Material-UI Version: Under development - will feature warm, inviting Material Design aesthetic with familiar Google-style components for consumer-friendly experience",
            'timestamp': datetime.now().strftime("%H:%M:%S")
        })

    async def test_responsive_design(self, browser):
        """Test responsive design on different screen sizes"""
        print("\n📱 Testing Responsive Design")
        
        # Test mobile viewport
        context = await browser.new_context(viewport={'width': 375, 'height': 667})
        page = await context.new_page()
        
        try:
            await page.goto(self.radix_url)
            await self.wait_and_screenshot(page, "radix_mobile", 
                "Radix UI Mobile View - Responsive design for mobile devices")
            
            # Test tablet viewport
            await page.set_viewport_size({'width': 768, 'height': 1024})
            await page.reload()
            await self.wait_and_screenshot(page, "radix_tablet", 
                "Radix UI Tablet View - Responsive design for tablet devices")
            
        except Exception as e:
            print(f"❌ Error testing responsive design: {e}")
        
        finally:
            await context.close()

    def generate_pdf_report(self):
        """Generate comprehensive PDF report with all screenshots"""
        print("\n📄 Generating PDF Report")
        
        pdf_filename = f"agent_free_testing_report_{self.timestamp}.pdf"
        doc = SimpleDocTemplate(pdf_filename, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        # Title page
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.HexColor('#2563EB'),
            alignment=1  # Center
        )
        
        story.append(Paragraph("Agent Free Platform", title_style))
        story.append(Paragraph("Automated Testing Report", title_style))
        story.append(Spacer(1, 20))
        
        # Report info
        info_style = ParagraphStyle(
            'Info',
            parent=styles['Normal'],
            fontSize=12,
            spaceAfter=10,
            alignment=1
        )
        
        story.append(Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", info_style))
        story.append(Paragraph(f"Total Screenshots: {len([s for s in self.screenshots if s['path']])}", info_style))
        story.append(Paragraph("Radix UI vs Material-UI Comparison", info_style))
        story.append(PageBreak())
        
        # Add screenshots
        for screenshot in self.screenshots:
            if screenshot['path'] and os.path.exists(screenshot['path']):
                # Add screenshot title
                story.append(Paragraph(f"{screenshot['name'].replace('_', ' ').title()}", styles['Heading2']))
                story.append(Paragraph(f"Time: {screenshot['timestamp']}", styles['Normal']))
                story.append(Paragraph(screenshot['description'], styles['Normal']))
                story.append(Spacer(1, 10))
                
                # Resize image to fit page
                try:
                    img = PILImage.open(screenshot['path'])
                    img_width, img_height = img.size
                    
                    # Calculate scaling to fit page width
                    max_width = 7 * inch
                    max_height = 9 * inch
                    
                    scale = min(max_width / img_width, max_height / img_height)
                    new_width = img_width * scale
                    new_height = img_height * scale
                    
                    story.append(Image(screenshot['path'], width=new_width, height=new_height))
                    story.append(PageBreak())
                    
                except Exception as e:
                    story.append(Paragraph(f"Error loading image: {e}", styles['Normal']))
                    story.append(PageBreak())
            else:
                # Add placeholder info
                story.append(Paragraph(f"{screenshot['name'].replace('_', ' ').title()}", styles['Heading2']))
                story.append(Paragraph(screenshot['description'], styles['Normal']))
                story.append(PageBreak())
        
        # Build PDF
        doc.build(story)
        print(f"✅ PDF Report generated: {pdf_filename}")
        return pdf_filename

    async def run_comprehensive_test(self):
        """Run the complete test suite"""
        print("🚀 Starting Agent Free Platform Automated Testing")
        print(f"Timestamp: {self.timestamp}")
        print(f"Screenshots directory: {self.screenshots_dir}")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            
            try:
                # Test both applications
                await self.test_radix_application(browser)
                await self.test_mui_application(browser)
                await self.test_responsive_design(browser)
                
                print(f"\n📊 Testing Summary:")
                print(f"Total screenshots taken: {len([s for s in self.screenshots if s['path']])}")
                print(f"Screenshots saved to: {self.screenshots_dir}")
                
                # Generate PDF report
                pdf_file = self.generate_pdf_report()
                
                print(f"\n🎉 Testing completed successfully!")
                print(f"📄 PDF Report: {pdf_file}")
                print(f"📁 Screenshots: {self.screenshots_dir}")
                
                return pdf_file, self.screenshots_dir
                
            finally:
                await browser.close()

# CLI interface
async def main():
    tester = AgentFreeAutomationTester()
    await tester.run_comprehensive_test()

if __name__ == "__main__":
    asyncio.run(main())

