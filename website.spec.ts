import { expect, test } from '@playwright/test';

// Test the homepage
test('homepage has correct title and links', async ({ page }) => {
  await page.goto('/');
  
  // Check title
  await expect(page).toHaveTitle(/Schedulo Pro Audit/);
  
  // Check main heading
  const heading = page.locator('h1');
  await expect(heading).toContainText('Schedulo Pro Audit');
  
  // Check navigation links
  await expect(page.locator('nav')).toContainText('Home');
  await expect(page.locator('nav')).toContainText('Methodology');
  await expect(page.locator('nav')).toContainText('Findings');
  await expect(page.locator('nav')).toContainText('Code');
  await expect(page.locator('nav')).toContainText('Improvements');
  
  // Check main content sections
  await expect(page.locator('main')).toContainText('Security Vulnerabilities');
  await expect(page.locator('main')).toContainText('Performance Bottlenecks');
  await expect(page.locator('main')).toContainText('Error Handling Deficiencies');
  await expect(page.locator('main')).toContainText('Testing Gaps');
});

// Test the findings page
test('findings page displays categories correctly', async ({ page }) => {
  await page.goto('/findings');
  
  // Check title
  await expect(page).toHaveTitle(/Findings/);
  
  // Check main heading
  const heading = page.locator('h1');
  await expect(heading).toContainText('Audit Findings');
  
  // Check category cards
  await expect(page.locator('main')).toContainText('Security Vulnerabilities');
  await expect(page.locator('main')).toContainText('Performance Bottlenecks');
  await expect(page.locator('main')).toContainText('Error Handling Deficiencies');
  await expect(page.locator('main')).toContainText('Testing Gaps');
  
  // Test navigation to a category
  await page.click('text=Security Vulnerabilities');
  await expect(page).toHaveURL(/\/findings\/security/);
});

// Test the code showcase page
test('code showcase page displays code examples correctly', async ({ page }) => {
  await page.goto('/code');
  
  // Check title
  await expect(page).toHaveTitle(/Code Showcase/);
  
  // Check main heading
  const heading = page.locator('h1');
  await expect(heading).toContainText('Code Showcase');
  
  // Check category cards
  await expect(page.locator('main')).toContainText('Security Code');
  await expect(page.locator('main')).toContainText('Performance Code');
  await expect(page.locator('main')).toContainText('Error Handling Code');
  await expect(page.locator('main')).toContainText('Testing Code');
  
  // Test navigation to a category
  await page.click('text=Security Code');
  await expect(page).toHaveURL(/\/code\/security/);
  
  // Check code examples
  await expect(page.locator('main')).toContainText('Secure Token Management');
});

// Test the theme toggle functionality
test('theme toggle switches between light and dark mode', async ({ page }) => {
  await page.goto('/');
  
  // Get the initial theme
  const initialTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  
  // Click the theme toggle button
  await page.click('button[aria-label="Toggle theme"]');
  
  // Wait for theme change to take effect
  await page.waitForTimeout(500);
  
  // Get the new theme
  const newTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  
  // Verify theme changed
  expect(newTheme).not.toEqual(initialTheme);
});

// Test mobile navigation
test('mobile navigation menu works correctly', async ({ page }) => {
  // Set viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto('/');
  
  // Mobile menu should be closed initially
  await expect(page.locator('text=Home').first()).toBeVisible();
  await expect(page.locator('text=Findings').nth(1)).not.toBeVisible();
  
  // Open mobile menu
  await page.click('button[aria-label="Toggle menu"]');
  
  // Menu items should now be visible
  await expect(page.locator('text=Findings').nth(1)).toBeVisible();
  
  // Test navigation through mobile menu
  await page.click('text=Findings >> nth=1');
  await expect(page).toHaveURL(/\/findings/);
});

// Test sidebar navigation
test('sidebar navigation works correctly', async ({ page }) => {
  await page.goto('/findings');
  
  // Check sidebar is visible
  await expect(page.locator('text=Overview')).toBeVisible();
  
  // Test collapsing sidebar
  const collapseButton = page.locator('button[aria-label="Collapse sidebar"]');
  await collapseButton.click();
  
  // Sidebar should be collapsed
  await expect(page.locator('text=Security Vulnerabilities')).not.toBeVisible();
  
  // Test expanding sidebar
  const expandButton = page.locator('button[aria-label="Expand sidebar"]');
  await expandButton.click();
  
  // Sidebar should be expanded
  await expect(page.locator('text=Security Vulnerabilities')).toBeVisible();
});

// Test code block copy functionality
test('code block copy button works correctly', async ({ page }) => {
  await page.goto('/code/security');
  
  // Find a copy button
  const copyButton = page.locator('text=Copy code').first();
  
  // Click the copy button
  await copyButton.click();
  
  // Check for copied confirmation (this would normally check clipboard content,
  // but that's not easily accessible in Playwright without additional setup)
  await expect(page.locator('text=Copied!')).toBeVisible();
});

// Test responsive layout
test('layout is responsive', async ({ page }) => {
  // Test desktop layout
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/findings');
  
  // Sidebar should be visible on desktop
  await expect(page.locator('nav >> text=Overview')).toBeVisible();
  
  // Test mobile layout
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/findings');
  
  // Sidebar should be replaced with dropdown on mobile
  await expect(page.locator('select')).toBeVisible();
  await expect(page.locator('nav >> text=Overview')).not.toBeVisible();
});

// Test metadata and SEO elements
test('page has correct metadata', async ({ page }) => {
  await page.goto('/');
  
  // Check meta description
  const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
  expect(metaDescription).toContain('Schedulo Pro');
  
  // Check Open Graph tags
  const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
  expect(ogTitle).toContain('Schedulo Pro Audit');
  
  const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
  expect(ogImage).toContain('/api/og');
});
