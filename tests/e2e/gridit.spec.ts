import { test, expect } from '@playwright/test';

async function uploadImage(page) {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('[data-testid="upload-button"]').click()
  ]);
  await fileChooser.setFiles('./tests/fixtures/test-image.png');
}

test.describe('Gridit Application', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/public/index.html');
    await page.waitForLoadState('networkidle');
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
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
    });

    test('shows grid controls after upload', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('input[type="range"]').first()).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Grid Controls', () => {
    test.beforeEach(async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
    });

    test('grid size slider adjusts value', async ({ page }) => {
      const slider = page.locator('input[type="range"]').first();
      await slider.fill('20');
      await expect(slider).toHaveValue('20');
    });

    test('grid color picker changes color', async ({ page }) => {
      const colorInput = page.locator('input[type="color"]');
      await expect(colorInput).toBeVisible();
      await colorInput.fill('#ff0000');
      await expect(colorInput).toHaveValue('#ff0000');
    });

    test('diagonal checkbox toggles diagonals', async ({ page }) => {
      const checkbox = page.locator('#diagonals');
      await expect(checkbox).not.toBeChecked();
      await checkbox.check();
      await expect(checkbox).toBeChecked();
    });
  });

  test.describe('Download Functionality', () => {
    test('download button not visible without image', async ({ page }) => {
      await expect(page.locator('.button-download')).not.toBeVisible();
    });

    test('download button enabled with image', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      const downloadBtn = page.locator('.button-download');
      await expect(downloadBtn.first()).toBeEnabled();
    });

    test('downloads gridded image', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      const downloadBtn = page.locator('.button-download').first();

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        downloadBtn.click()
      ]);

      expect(download.suggestedFilename()).toMatch(/gridded.*\.png$/);
    });
  });

  test.describe('Internationalization', () => {
    test('switches to Spanish', async ({ page }) => {
      const langSelect = page.locator('#language-select');
      await langSelect.selectOption('spanish');
      await expect(page.locator('body')).toContainText(/Elegir Archivo|Subi una imagen/);
    });

    test('all 14 languages load without error', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', err => errors.push(err.message));

      const languages = [
        'english', 'spanish', 'latin', 'italian', 'portuguese', 'french',
        'asturiano', 'gaelic', 'euskara', 'japanese', 'russian', 'tuvan',
        'amharic', 'hebrew'
      ];
      const langSelect = page.locator('#language-select');

      for (const lang of languages) {
        await langSelect.selectOption(lang);
        await expect(page.locator('h1')).toContainText('Gridit');
      }

      expect(errors).toHaveLength(0);
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('renders correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.main-content')).toBeVisible();
    });

    test('touch targets have minimum 44px size', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      // Exclude inline buttons (like collapsible headers) that inherit parent sizing
      const buttons = page.locator('button:visible:not(.card-title-collapsible):not([aria-expanded])');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const box = await buttons.nth(i).boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });

  test.describe('Grid Rendering', () => {
    test('grid preview shows SVG lines', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      // Use .grid-overlay to avoid matching SVG icon lines
      await expect(async () => {
        const count = await page.locator('.grid-overlay line').count();
        expect(count).toBeGreaterThan(0);
      }).toPass({ timeout: 5000 });
    });

    test('diagonal lines appear when enabled', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      await expect(async () => {
        const count = await page.locator('.grid-overlay line').count();
        expect(count).toBeGreaterThan(0);
      }).toPass({ timeout: 5000 });

      const initialLineCount = await page.locator('.grid-overlay line').count();

      const checkbox = page.locator('#diagonals');
      await checkbox.check();
      await expect(checkbox).toBeChecked();

      await expect(async () => {
        const afterLineCount = await page.locator('.grid-overlay line').count();
        expect(afterLineCount).toBeGreaterThan(initialLineCount);
      }).toPass({ timeout: 5000 });
    });
  });
});
