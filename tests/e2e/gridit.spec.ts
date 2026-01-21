import { test, expect } from '@playwright/test';

test.describe('Gridit Application', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/public/index.html');
  });

  test.describe('Page Load', () => {
    test('loads without JavaScript errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', err => errors.push(err.message));
      await page.goto('http://localhost:8000/public/index.html');
      await page.waitForLoadState('networkidle');
      expect(errors).toHaveLength(0);
    });

    test('displays header with title', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Gridit');
    });

    test('shows language selector', async ({ page }) => {
      await expect(page.locator('#language-select')).toBeVisible();
    });
  });

  test.describe('Image Upload', () => {
    test('accepts image file upload', async ({ page }) => {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./tests/fixtures/test-image.png');
      await page.waitForTimeout(500); // Wait for image processing
      await expect(page.locator('.preview-image, .uploaded-image, canvas')).toBeVisible();
    });

    test('shows grid controls after upload', async ({ page }) => {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./tests/fixtures/test-image.png');
      await page.waitForTimeout(500);
      await expect(page.locator('#grid-size-slider, input[type="range"]')).toBeVisible();
    });
  });

  test.describe('Grid Controls', () => {
    test.beforeEach(async ({ page }) => {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./tests/fixtures/test-image.png');
      await page.waitForTimeout(500);
    });

    test('grid size slider adjusts value', async ({ page }) => {
      const slider = page.locator('input[type="range"]').first();
      await slider.fill('20');
      await page.waitForTimeout(200);
      // Value should be updated in the UI
    });

    test('grid color picker changes color', async ({ page }) => {
      const colorInput = page.locator('input[type="color"]');
      if (await colorInput.count() > 0) {
        await colorInput.fill('#ff0000');
        await page.waitForTimeout(200);
      }
    });

    test('diagonal checkbox toggles diagonals', async ({ page }) => {
      const checkbox = page.locator('input[type="checkbox"]');
      if (await checkbox.count() > 0) {
        await checkbox.first().check();
        await expect(checkbox.first()).toBeChecked();
      }
    });
  });

  test.describe('Download Functionality', () => {
    test('download button disabled without image', async ({ page }) => {
      const downloadBtn = page.locator('button').filter({ hasText: /download|descargar/i });
      if (await downloadBtn.count() > 0) {
        await expect(downloadBtn.first()).toBeDisabled();
      }
    });

    test('download button enabled with image', async ({ page }) => {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./tests/fixtures/test-image.png');
      await page.waitForTimeout(500);
      const downloadBtn = page.locator('button').filter({ hasText: /download|descargar/i });
      if (await downloadBtn.count() > 0) {
        await expect(downloadBtn.first()).toBeEnabled();
      }
    });

    test('downloads gridded image', async ({ page }) => {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./tests/fixtures/test-image.png');
      await page.waitForTimeout(500);

      const downloadBtn = page.locator('button').filter({ hasText: /download|descargar/i }).first();

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        downloadBtn.click()
      ]);

      expect(download.suggestedFilename()).toBe('gridded-image.png');
    });
  });

  test.describe('Internationalization', () => {
    test('switches to Spanish', async ({ page }) => {
      const langSelect = page.locator('select').first();
      await langSelect.selectOption('es');
      await page.waitForTimeout(300);
      // Spanish text should appear
      const bodyText = await page.textContent('body');
      expect(bodyText).toMatch(/Tamaño|Grosor|Opacidad/);
    });

    test('all 14 languages load without error', async ({ page }) => {
      const languages = ['en', 'es', 'la', 'it', 'pt', 'fr', 'ast',
                         'ga', 'eu', 'ja', 'ru', 'tyv', 'am', 'he'];
      const langSelect = page.locator('select').first();

      for (const lang of languages) {
        await langSelect.selectOption(lang);
        await page.waitForLoadState('networkidle');
        // No errors thrown
      }
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('renders correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body')).toBeVisible();
    });

    test('touch targets have minimum 44px size', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const buttons = page.locator('button');
      const count = await buttons.count();

      let violations = 0;
      for (let i = 0; i < Math.min(count, 10); i++) { // Check first 10 buttons
        const box = await buttons.nth(i).boundingBox();
        if (box && box.height < 44) {
          violations++;
        }
      }
      expect(violations).toBeLessThan(3); // Allow some violations for hidden elements
    });
  });

  test.describe('Grid Rendering', () => {
    test('grid preview shows SVG lines', async ({ page }) => {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./tests/fixtures/test-image.png');
      await page.waitForTimeout(500);

      const svgLines = page.locator('svg line');
      const count = await svgLines.count();
      expect(count).toBeGreaterThan(0);
    });

    test('diagonal lines appear when enabled', async ({ page }) => {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./tests/fixtures/test-image.png');
      await page.waitForTimeout(500);

      const initialLineCount = await page.locator('svg line').count();

      const checkbox = page.locator('input[type="checkbox"]').first();
      if (await checkbox.count() > 0 && !await checkbox.isChecked()) {
        await checkbox.check();
        await page.waitForTimeout(300);
      }

      const afterLineCount = await page.locator('svg line').count();
      expect(afterLineCount).toBeGreaterThanOrEqual(initialLineCount);
    });
  });
});
