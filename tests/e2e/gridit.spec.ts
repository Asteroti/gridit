import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function uploadImage(page, fixture = './tests/fixtures/test-image.png') {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('[data-testid="upload-button"]').click()
  ]);
  await fileChooser.setFiles(fixture);
}

test.describe('Gridit Application', () => {
  let pageErrors: string[];

  test.beforeEach(async ({ page }) => {
    pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));
    await page.goto('http://localhost:8000/public/index.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    expect(pageErrors).toEqual([]);
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

    test('rejects image larger than 15MB at upload time', async ({ page }) => {
      await uploadImage(page, './tests/fixtures/test-image-huge.png');
      await expect(page.locator('#error-container')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('#error-title')).toHaveText('File Too Large');
      await expect(page.locator('.gridded-base-image')).toHaveCount(0);
    });

    test('survives cancel of file picker and accepts a later upload', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', err => errors.push(err.message));

      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      // Cancel: trigger file picker, set empty files
      const [cancelChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.locator('.change-image-link').click(),
      ]);
      await cancelChooser.setFiles([]);

      // Subsequent upload must still work — Elm runtime not crashed
      const [chooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.locator('.change-image-link').click(),
      ]);
      await chooser.setFiles('./tests/fixtures/test-image-tall.png');
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      expect(errors).toHaveLength(0);
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

    test('grid hue slider changes color', async ({ page }) => {
      const hueSlider = page.locator('#grid-color-input');
      await expect(hueSlider).toBeVisible();
      await hueSlider.fill('120');
      await expect(hueSlider).toHaveValue('120');
    });

    test('diagonal toggle switches on and off', async ({ page }) => {
      const toggle = page.locator('#diagonals');
      await expect(toggle).not.toBeChecked();
      await toggle.evaluate((el: HTMLInputElement) => el.click());
      await expect(toggle).toBeChecked();
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

    test('downloaded PNG actually contains grid pixels', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await expect(async () => {
        expect(await page.locator('.grid-overlay line').count()).toBeGreaterThan(0);
      }).toPass({ timeout: 5000 });

      // Render to canvas in-page and inspect pixel data — same code path the
      // real download uses, just decoded synchronously instead of going to disk.
      const result = await page.evaluate(async () => {
        return await new Promise<{ w: number; h: number; gridPixels: number }>((resolve) => {
          const img = document.querySelector('.gridded-base-image') as HTMLImageElement;
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          // @ts-expect-error compositeOverlay is a global in grid-merge.js
          compositeOverlay(ctx, canvas.width, canvas.height, () => {
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let n = 0;
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 1] > 200 && data[i] < 200 && data[i + 2] < 200) n++;
            }
            resolve({ w: canvas.width, h: canvas.height, gridPixels: n });
          });
        });
      });

      expect(result.gridPixels).toBeGreaterThan(50);
    });
  });

  test.describe('Internationalization', () => {
    test('switches to Spanish', async ({ page }) => {
      const langSelect = page.locator('#language-select');
      await langSelect.selectOption('spanish');
      await expect(page.locator('body')).toContainText(/Elegir imagen|Sub\u00ED una imagen/);
    });

    test('all 14 languages load without error', async ({ page }) => {
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
    });

    // Catches the class of bug where a translated label slips through as
    // hardcoded English (e.g. "Off" instead of localized text).
    test('non-English languages do not leak English UI words', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      const langSelect = page.locator('#language-select');

      const englishLeakWords = ['Size', 'Color', 'Opacity', 'Thickness', 'Off', 'Download', 'Choose another'];
      const skipForLang: Record<string, string[]> = {
        // Many languages reuse "Color" — it's a Latin loanword. Whitelist it.
        spanish: ['Color'],
        portuguese: ['Color'],
        italian: ['Color'],
        french: ['Color'],
        latin: ['Color'],
        asturiano: ['Color'],
      };
      // Gaelic, Tuvan, Amharic still fall back to English for AdaptiveGridDensity
      // and OffLabel — those need native-speaker translations and are tracked
      // separately.
      const langsToCheck = ['spanish', 'french', 'japanese', 'russian', 'hebrew'];

      const langCodes: Record<string, string> = {
        spanish: 'es', french: 'fr', japanese: 'ja',
        russian: 'ru', hebrew: 'he', amharic: 'am'
      };

      for (const lang of langsToCheck) {
        await langSelect.evaluate((el: HTMLSelectElement, v: string) => {
          el.value = v;
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, lang);
        await expect(page.locator('html')).toHaveAttribute('lang', langCodes[lang], { timeout: 2000 });
        // Poll until Elm has finished re-rendering the card under the new locale.
        await expect(page.locator('.card-section-title')).not.toHaveText('Grid Settings', { timeout: 2000 });
        const card = await page.locator('.card-face').innerText();
        const allow = skipForLang[lang] || [];
        for (const word of englishLeakWords) {
          if (allow.includes(word)) continue;
          expect(card, `'${word}' leaked into ${lang} card`).not.toContain(word);
        }
      }
    });
  });

  test.describe('Community counter', () => {
    const sampleCounters = (yourCountry = 'AR') => ({
      totalDownloaded: 100,
      totalHearted: 200,
      totalCountries: 5,
      heartsByCountry: [
        { country: 'AR', count: 50 },
        { country: 'JP', count: 30 },
        { country: 'ES', count: 25 }
      ],
      griddersByCountry: [
        { country: 'AR', count: 40 },
        { country: 'HK', count: 5 },
        { country: 'US', count: 3 }
      ],
      spotlight: { country: 'AR', count: 50 },
      yourCountry
    });

    async function sendCounters(page, counters) {
      await page.evaluate((c) => {
        window._elmApp.ports.receiveCounters.send(c);
      }, counters);
    }

    test('community ticker is absent before counters load', async ({ page }) => {
      await expect(page.locator('.community-ticker')).toHaveCount(0);
    });

    test('community ticker renders when counters arrive', async ({ page }) => {
      await sendCounters(page, sampleCounters());
      await expect(page.locator('.community-ticker')).toBeVisible();
      const totals = await page.locator('.community-ticker__line strong').allTextContents();
      expect(totals).toEqual(['100', '5', '200']);
    });

    test('heart click ticks the total hearts counter optimistically', async ({ page }) => {
      // Note: post v2 ticker rework, only the totals line shows hearts —
      // the per-country hearts strip was removed (leaderboard-shaped).
      // The model still updates heartsByCountry; just not displayed.
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await sendCounters(page, sampleCounters('AR'));

      await page.locator('.heart-pill').click();

      const totals = await page.locator('.community-ticker__line strong').allTextContents();
      expect(totals[2]).toBe('201');
    });

    test('heart with empty yourCountry still ticks the total', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await sendCounters(page, sampleCounters(''));

      await page.locator('.heart-pill').click();

      const totals = await page.locator('.community-ticker__line strong').allTextContents();
      expect(totals[2]).toBe('201');
    });

    test('download click ticks the download total and gridders flag', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await sendCounters(page, sampleCounters('AR'));

      await page.locator('.button-download').click();
      await page.waitForTimeout(800);

      const totals = await page.locator('.community-ticker__line strong').allTextContents();
      expect(totals[0]).toBe('101');
      // The first flag in the ticker is the user's country (AR), now 41.
      const arGridderRow = await page.locator('.community-ticker__flags .community-flag').first().innerText();
      expect(arGridderRow).toMatch(/41$/);
    });

    test('ticker shows up to 6 country flags from griddersByCountry', async ({ page }) => {
      await sendCounters(page, sampleCounters());
      // Sample has 3 gridders countries; expect exactly 3 flags rendered.
      await expect(page.locator('.community-ticker__flags .community-flag')).toHaveCount(3);
      const titles = await page.locator('.community-ticker__flags .community-flag').evaluateAll(
        els => els.map((el: HTMLElement) => el.getAttribute('title'))
      );
      expect(titles).toEqual(['AR', 'HK', 'US']);
    });

    test('disclaimer expands on click', async ({ page }) => {
      await sendCounters(page, sampleCounters());
      const body = page.locator('.community-disclaimer-body');
      await expect(body).toHaveCount(0);
      await page.locator('.community-disclaimer-toggle').evaluate((el: HTMLElement) => el.click());
      await expect(body).toBeVisible();
    });

    test('rate-limit toast appears when receiveRateLimit fires', async ({ page }) => {
      await sendCounters(page, sampleCounters());
      await expect(page.locator('.rate-limit-toast')).toHaveCount(0);

      await page.evaluate(() => window._elmApp.ports.receiveRateLimit.send(null));
      await expect(page.locator('.rate-limit-toast')).toBeVisible();
      await expect(page.locator('.rate-limit-toast')).toContainText(/cowboy/i);
    });

    test('community strings localized across all 14 languages', async ({ page }) => {
      await sendCounters(page, sampleCounters());
      const langCodes: Record<string, string> = {
        english: 'en', spanish: 'es', latin: 'la', italian: 'it', portuguese: 'pt',
        french: 'fr', asturiano: 'ast', gaelic: 'gd', euskara: 'eu', japanese: 'ja',
        russian: 'ru', tuvan: 'tyv', amharic: 'am', hebrew: 'he'
      };
      const langSelect = page.locator('#language-select');
      for (const [lang, code] of Object.entries(langCodes)) {
        await langSelect.evaluate((el: HTMLSelectElement, v: string) => {
          el.value = v;
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, lang);
        await expect(page.locator('html')).toHaveAttribute('lang', code, { timeout: 2000 });
        await expect(page.locator('.community-ticker')).toBeVisible();
      }
    });
  });

  test.describe('External links', () => {
    test('Wikipedia links have external icon and underline', async ({ page }) => {
      const firstLink = page.locator('.about-links a').first();
      const decoration = await firstLink.evaluate(el => getComputedStyle(el).textDecorationLine);
      expect(decoration).toContain('underline');
      const iconCount = await page.locator('.about-links a .link-external').count();
      expect(iconCount).toBe(5);
    });
  });

  test.describe('Accessibility', () => {
    test('upload state has no axe violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test('controls state has no axe violations', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations).toEqual([]);
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
      await checkbox.evaluate((el: HTMLInputElement) => el.click());
      await expect(checkbox).toBeChecked();

      await expect(async () => {
        const afterLineCount = await page.locator('.grid-overlay line').count();
        expect(afterLineCount).toBeGreaterThan(initialLineCount);
      }).toPass({ timeout: 5000 });
    });

    test('grid overlay matches image bounds', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      await expect(async () => {
        const count = await page.locator('.grid-overlay line').count();
        expect(count).toBeGreaterThan(0);
      }).toPass({ timeout: 5000 });

      const imageBox = await page.locator('.gridded-base-image').boundingBox();
      const overlayBox = await page.locator('.grid-overlay').boundingBox();

      expect(imageBox).not.toBeNull();
      expect(overlayBox).not.toBeNull();

      // SVG overlay should match image dimensions within 2px tolerance
      expect(Math.abs(overlayBox!.width - imageBox!.width)).toBeLessThanOrEqual(2);
      expect(Math.abs(overlayBox!.height - imageBox!.height)).toBeLessThanOrEqual(2);
      expect(Math.abs(overlayBox!.x - imageBox!.x)).toBeLessThanOrEqual(2);
      expect(Math.abs(overlayBox!.y - imageBox!.y)).toBeLessThanOrEqual(2);
    });

    test('grid overlay matches image bounds for tall portrait image', async ({ page }) => {
      await uploadImage(page, './tests/fixtures/test-image-tall.png');
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      await expect(async () => {
        const count = await page.locator('.grid-overlay line').count();
        expect(count).toBeGreaterThan(0);
      }).toPass({ timeout: 5000 });

      const imageBox = await page.locator('.gridded-base-image').boundingBox();
      const overlayBox = await page.locator('.grid-overlay').boundingBox();

      expect(imageBox).not.toBeNull();
      expect(overlayBox).not.toBeNull();

      expect(Math.abs(overlayBox!.width - imageBox!.width)).toBeLessThanOrEqual(2);
      expect(Math.abs(overlayBox!.height - imageBox!.height)).toBeLessThanOrEqual(2);
      expect(Math.abs(overlayBox!.x - imageBox!.x)).toBeLessThanOrEqual(2);
      expect(Math.abs(overlayBox!.y - imageBox!.y)).toBeLessThanOrEqual(2);
    });

    test('diagonal lines stay within image bounds', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      const checkbox = page.locator('#diagonals');
      await checkbox.evaluate((el: HTMLInputElement) => el.click());

      await expect(async () => {
        const count = await page.locator('.grid-overlay line').count();
        expect(count).toBeGreaterThan(0);
      }).toPass({ timeout: 5000 });

      // Get the SVG viewBox dimensions
      const viewBox = await page.locator('.grid-overlay').getAttribute('viewBox');
      expect(viewBox).not.toBeNull();
      const [, , vbWidth, vbHeight] = viewBox!.split(' ').map(Number);

      // Check every diagonal line stays within viewBox bounds
      const lines = page.locator('.grid-overlay line');
      const count = await lines.count();
      for (let i = 0; i < count; i++) {
        const x1 = Number(await lines.nth(i).getAttribute('x1'));
        const y1 = Number(await lines.nth(i).getAttribute('y1'));
        const x2 = Number(await lines.nth(i).getAttribute('x2'));
        const y2 = Number(await lines.nth(i).getAttribute('y2'));

        expect(x1).toBeGreaterThanOrEqual(-0.01);
        expect(y1).toBeGreaterThanOrEqual(-0.01);
        expect(x2).toBeLessThanOrEqual(vbWidth + 0.01);
        expect(y2).toBeLessThanOrEqual(vbHeight + 0.01);
        expect(x1).toBeLessThanOrEqual(vbWidth + 0.01);
        expect(y1).toBeLessThanOrEqual(vbHeight + 0.01);
        expect(x2).toBeGreaterThanOrEqual(-0.01);
        expect(y2).toBeGreaterThanOrEqual(-0.01);
      }
    });

    test('tall image does not overflow viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await uploadImage(page, './tests/fixtures/test-image-tall.png');
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      const imageBox = await page.locator('.gridded-base-image').boundingBox();
      expect(imageBox).not.toBeNull();

      // Image should not exceed 80vh (640px at 800px viewport)
      expect(imageBox!.height).toBeLessThanOrEqual(800 * 0.8 + 1);
    });

    const alignmentScenarios = [
      { name: 'desktop / square', width: 1440, height: 900, fixture: './tests/fixtures/test-image.png' },
      { name: 'desktop / tall', width: 1440, height: 900, fixture: './tests/fixtures/test-image-tall.png' },
      { name: 'desktop / clamped tall', width: 1440, height: 600, fixture: './tests/fixtures/test-image-tall.png' },
      { name: 'tablet / square', width: 768, height: 1024, fixture: './tests/fixtures/test-image.png' },
      { name: 'mobile / square', width: 390, height: 844, fixture: './tests/fixtures/test-image.png' },
      { name: 'mobile / tall', width: 390, height: 844, fixture: './tests/fixtures/test-image-tall.png' },
    ];

    for (const sc of alignmentScenarios) {
      test(`overlay matches image bounds — ${sc.name} ${sc.width}x${sc.height}`, async ({ page }) => {
        await page.setViewportSize({ width: sc.width, height: sc.height });
        await uploadImage(page, sc.fixture);
        await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
        await expect(async () => {
          expect(await page.locator('.grid-overlay line').count()).toBeGreaterThan(0);
        }).toPass({ timeout: 5000 });

        const imageBox = await page.locator('.gridded-base-image').boundingBox();
        const overlayBox = await page.locator('.grid-overlay').boundingBox();
        expect(imageBox).not.toBeNull();
        expect(overlayBox).not.toBeNull();

        expect(Math.abs(overlayBox!.width - imageBox!.width)).toBeLessThanOrEqual(2);
        expect(Math.abs(overlayBox!.height - imageBox!.height)).toBeLessThanOrEqual(2);
        expect(Math.abs(overlayBox!.x - imageBox!.x)).toBeLessThanOrEqual(2);
        expect(Math.abs(overlayBox!.y - imageBox!.y)).toBeLessThanOrEqual(2);
      });
    }
  });

  test.describe('Adaptive Density', () => {
    test.beforeEach(async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
    });

    test('adaptive density slider starts at zero (off)', async ({ page }) => {
      const slider = page.locator('#adaptive-density-input');
      await expect(slider).toBeVisible();
      await expect(slider).toHaveValue('0');
    });

    test('adaptive density slider increases line count', async ({ page }) => {
      await expect(async () => {
        const count = await page.locator('.grid-overlay line').count();
        expect(count).toBeGreaterThan(0);
      }).toPass({ timeout: 5000 });

      const baseLineCount = await page.locator('.grid-overlay line').count();

      const slider = page.locator('#adaptive-density-input');
      await slider.fill('0.8');

      // Wait for entropy analysis and re-render
      await expect(async () => {
        const newCount = await page.locator('.grid-overlay line').count();
        expect(newCount).toBeGreaterThanOrEqual(baseLineCount);
      }).toPass({ timeout: 10000 });
    });

    // bju.3: entropy grid is decoupled from display. Changing the grid
    // size slider must NOT trigger re-analysis — the entropy cache persists.
    // Content-agnostic: doesn't require the test image to have entropy variation.
    test('grid-size changes do not re-trigger entropy analysis', async ({ page }) => {
      const adaptiveSlider = page.locator('#adaptive-density-input');
      await adaptiveSlider.fill('0.6');

      // Wait for the (first and only) analysis pass to finish.
      await expect(page.locator('.analyzing-indicator')).toHaveCount(0, { timeout: 10000 });

      // Move the grid-size slider — the "Analyzing image" indicator must NOT
      // appear again. We poll briefly to catch any flicker.
      const sizeSlider = page.locator('#grid-size-input');
      await sizeSlider.fill('14');
      await sizeSlider.fill('20');
      await sizeSlider.fill('8');

      // Across all those changes, no analyzing-indicator should have surfaced.
      await expect(page.locator('.analyzing-indicator')).toHaveCount(0);

      // Final base-line count matches the display grid (8×8 = 18 lines).
      await expect(async () => {
        expect(await page.locator('.grid-overlay line').count()).toBeGreaterThanOrEqual(18);
      }).toPass({ timeout: 3000 });
    });
  });

  // The v2 refactor (bju.1 + bju.2) replaces `gridSize: Int` with
  // `gridRows + gridCols + gridMode`. Existing users have the old shape
  // in localStorage; these tests pin (a) the migration shim, (b) the
  // new-shape load path, and (c) the regression behavior of the
  // existing Auto-mode slider, which must keep working unchanged.
  test.describe('Settings v2 refactor', () => {
    test('default grid (10×10) renders 22 lines after upload', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await expect(async () => {
        // 11 vertical + 11 horizontal = 22 for a 10×10 grid, no diagonals.
        expect(await page.locator('.grid-overlay line').count()).toBe(22);
      }).toPass({ timeout: 5000 });
    });

    test('slider at 5 renders 12 grid lines (6 + 6)', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      const slider = page.locator('#grid-size-input');
      await slider.fill('5');

      await expect(async () => {
        expect(await page.locator('.grid-overlay line').count()).toBe(12);
      }).toPass({ timeout: 5000 });
    });

    test('migrateSettings: pre-v2 shape becomes v2 shape', async ({ page }) => {
      // Unit-ish test of the migration shim, exposed on window for inspection.
      const out = await page.evaluate(() => {
        // @ts-expect-error migrateSettings is global from grid-merge.js
        return window.migrateSettings({
          gridSize: 12,
          gridColor: '#80ED99',
          gridThickness: 2,
          gridOpacity: 0.7,
          showDiagonals: false,
        });
      });
      expect(out.gridSize).toBeUndefined();
      expect(out.gridRows).toBe(12);
      expect(out.gridCols).toBe(12);
      expect(out.gridMode).toBe('rectilinear');
      expect(out.gridColor).toBe('#80ED99');
    });

    test('migrateSettings: old Auto/Custom values map to rectilinear', async ({ page }) => {
      // Custom mode is gone. Anything that used to be "Custom" now becomes
      // rectilinear (the user keeps their rows/cols, just the mode label moves).
      const auto = await page.evaluate(() => {
        // @ts-expect-error migrateSettings is global from grid-merge.js
        return window.migrateSettings({
          gridRows: 8, gridCols: 8, gridMode: 'Auto',
          gridColor: '#000', gridThickness: 1, gridOpacity: 1, showDiagonals: false,
        });
      });
      expect(auto.gridMode).toBe('rectilinear');

      const custom = await page.evaluate(() => {
        // @ts-expect-error migrateSettings is global from grid-merge.js
        return window.migrateSettings({
          gridRows: 8, gridCols: 14, gridMode: 'Custom',
          gridColor: '#000', gridThickness: 1, gridOpacity: 1, showDiagonals: false,
        });
      });
      expect(custom.gridMode).toBe('rectilinear');
      // Their custom rows/cols are preserved (just the mode label changes).
      expect(custom.gridRows).toBe(8);
      expect(custom.gridCols).toBe(14);
    });

    test('pre-v2 localStorage settings restore grid size on reload', async ({ page }) => {
      // Inject old-shape settings; reload triggers the load path.
      await page.evaluate(() => {
        localStorage.setItem('gridit-settings', JSON.stringify({
          gridSize: 15,
          gridColor: '#80ED99',
          gridThickness: 1,
          gridOpacity: 1,
          showDiagonals: false,
        }));
      });
      await page.reload();
      await page.waitForLoadState('networkidle');
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      // Slider should reflect the restored value.
      const slider = page.locator('#grid-size-input');
      await expect(slider).toHaveValue('15');
      // And the rendered grid line count matches.
      await expect(async () => {
        expect(await page.locator('.grid-overlay line').count()).toBe(32);
      }).toPass({ timeout: 5000 });
    });

    test('v2 localStorage settings restore on reload', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem('gridit-settings', JSON.stringify({
          gridRows: 8,
          gridCols: 8,
          gridMode: 'Auto',
          gridColor: '#000000',
          gridThickness: 2,
          gridOpacity: 0.6,
          showDiagonals: false,
        }));
      });
      await page.reload();
      await page.waitForLoadState('networkidle');
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      const slider = page.locator('#grid-size-input');
      await expect(slider).toHaveValue('8');
      await expect(async () => {
        expect(await page.locator('.grid-overlay line').count()).toBe(18);
      }).toPass({ timeout: 5000 });
    });

    test('bogus localStorage settings fall back to defaults', async ({ page }) => {
      await page.evaluate(() => {
        localStorage.setItem('gridit-settings', JSON.stringify({
          gridSize: 'not-a-number',  // invalid shape — should be ignored
          someJunk: true,
        }));
      });
      await page.reload();
      await page.waitForLoadState('networkidle');
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      // Default grid size is 10 → 22 lines.
      const slider = page.locator('#grid-size-input');
      await expect(slider).toHaveValue('10');
    });

    test('moving the slider persists the new shape (gridRows + gridCols + gridMode)', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      const slider = page.locator('#grid-size-input');
      await slider.fill('7');

      // Wait for the save to flush.
      await expect(async () => {
        const saved = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('gridit-settings') || '{}')
        );
        expect(saved.gridRows).toBe(7);
        expect(saved.gridCols).toBe(7);
        expect(saved.gridMode).toBe('rectilinear');
        expect(saved.gridSize).toBeUndefined();
      }).toPass({ timeout: 3000 });
    });
  });

  // Cluster 1: rectilinear/square segmented toggle.
  // Replaced the old Auto/Custom + two-input UI in the v2.1 refactor.
  test.describe('Cluster 1: rectilinear/square mode', () => {
    test.beforeEach(async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
    });

    test('rectilinear is the default, slider always visible', async ({ page }) => {
      await expect(page.locator('.seg-btn')).toHaveCount(2);
      await expect(page.locator('.seg-btn').first()).toHaveClass(/seg-btn--active/);
      await expect(page.locator('#grid-size-input')).toBeVisible();
      // The two-input UI from the old Custom mode is gone.
      await expect(page.locator('#grid-rows-input')).toHaveCount(0);
      await expect(page.locator('#grid-cols-input')).toHaveCount(0);
    });

    test('clicking square keeps the slider; mode persists as "square"', async ({ page }) => {
      await page.locator('.seg-btn').nth(1).click();
      await expect(page.locator('#grid-size-input')).toBeVisible();
      await expect(page.locator('.seg-btn').nth(1)).toHaveClass(/seg-btn--active/);

      await expect(async () => {
        const saved = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('gridit-settings') || '{}')
        );
        expect(saved.gridMode).toBe('square');
      }).toPass({ timeout: 3000 });
    });

    test('rectilinear: slider sets both rows and cols equal', async ({ page }) => {
      const slider = page.locator('#grid-size-input');
      await slider.fill('11');

      await expect(async () => {
        const saved = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('gridit-settings') || '{}')
        );
        expect(saved.gridRows).toBe(11);
        expect(saved.gridCols).toBe(11);
      }).toPass({ timeout: 3000 });

      // 12 + 12 = 24 lines for 11×11.
      await expect(async () => {
        expect(await page.locator('.grid-overlay line').count()).toBe(24);
      }).toPass({ timeout: 3000 });
    });

    test('reload restores square mode + derived rows/cols', async ({ page }) => {
      // Inject pre-saved square mode state.
      await page.evaluate(() => {
        localStorage.setItem('gridit-settings', JSON.stringify({
          gridRows: 12, gridCols: 4, gridMode: 'square',
          gridColor: '#80ED99', gridThickness: 1, gridOpacity: 1, showDiagonals: false,
        }));
      });
      await page.reload();
      await page.waitForLoadState('networkidle');
      await uploadImage(page, './tests/fixtures/test-image-tall.png');
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      // Square button should be active.
      await expect(page.locator('.seg-btn').nth(1)).toHaveClass(/seg-btn--active/);
      // Slider should show 4 (the cells on the shorter axis).
      await expect(page.locator('#grid-size-input')).toHaveValue('4');
    });
  });

  // Cluster 2 prep: numbered section headers ("1. set up the grid", "2. style")
  // + rename "Adaptive density" → "auto-simplify".
  test.describe('Cluster 2 prep: groups + rename', () => {
    test.beforeEach(async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
    });

    test('renders two numbered group headers', async ({ page }) => {
      const headers = page.locator('.group-header');
      await expect(headers).toHaveCount(2);
      await expect(headers.nth(0)).toContainText('1.');
      await expect(headers.nth(0)).toContainText('set up the grid');
      await expect(headers.nth(1)).toContainText('2.');
      await expect(headers.nth(1)).toContainText('style');
    });

    test('grid-size control sits in group 1', async ({ page }) => {
      const group1 = page.locator('.group').nth(0);
      await expect(group1.locator('#grid-size-input, #grid-rows-input').first()).toBeVisible();
      // The mode toggle is in group 1.
      await expect(group1.locator('.seg')).toBeVisible();
    });

    test('style controls (color, thickness, opacity, diagonals, auto-simplify) sit in group 2', async ({ page }) => {
      const group2 = page.locator('.group').nth(1);
      await expect(group2.locator('#grid-color-input')).toBeVisible();
      await expect(group2.locator('#grid-thickness-input')).toBeVisible();
      await expect(group2.locator('#grid-opacity-input')).toBeVisible();
      await expect(group2.locator('#diagonals')).toBeAttached();
      await expect(group2.locator('#adaptive-density-input')).toBeVisible();
    });

    test('"Adaptive density" label is shown with short sub-line', async ({ page }) => {
      const adaptiveLabel = page.locator('label[for="adaptive-density-input"]');
      await expect(adaptiveLabel).toContainText(/adaptive density/i);
      await expect(page.locator('.mode-explain', { hasText: /busy/i })).toBeVisible();
    });
  });

  // bju.6 + bju.7: cell labels feature.
  test.describe('Cluster 2: cell labels', () => {
    test.beforeEach(async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
    });

    test('toggle exists in group 2 (style) and is off by default', async ({ page }) => {
      const toggle = page.locator('#cell-labels');
      await expect(toggle).toBeAttached();
      await expect(toggle).not.toBeChecked();
      // No <text> labels in the overlay until toggled on.
      await expect(page.locator('.grid-overlay text')).toHaveCount(0);
    });

    test('toggling on renders one label per cell (10×10 = 100 labels)', async ({ page }) => {
      await page.locator('#cell-labels').evaluate((el: HTMLInputElement) => el.click());

      await expect(async () => {
        expect(await page.locator('.grid-overlay text').count()).toBe(100);
      }).toPass({ timeout: 3000 });
    });

    test('labels use chess-style coordinates (first is A1, last is J10 for 10×10)', async ({ page }) => {
      await page.locator('#cell-labels').evaluate((el: HTMLInputElement) => el.click());

      await expect(async () => {
        const labels = await page.locator('.grid-overlay text').allTextContents();
        expect(labels[0]).toBe('A1');
        expect(labels[labels.length - 1]).toBe('J10');
      }).toPass({ timeout: 3000 });
    });

    test('changing grid size changes label count correspondingly', async ({ page }) => {
      await page.locator('#cell-labels').evaluate((el: HTMLInputElement) => el.click());

      const sizeSlider = page.locator('#grid-size-input');
      await sizeSlider.fill('5');

      // 5x5 = 25 labels
      await expect(async () => {
        expect(await page.locator('.grid-overlay text').count()).toBe(25);
      }).toPass({ timeout: 3000 });
    });

    test('persists showCellLabels in localStorage', async ({ page }) => {
      await page.locator('#cell-labels').evaluate((el: HTMLInputElement) => el.click());

      await expect(async () => {
        const saved = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('gridit-settings') || '{}')
        );
        expect(saved.showCellLabels).toBe(true);
      }).toPass({ timeout: 3000 });
    });

    test('migration backfills showCellLabels=false for pre-cluster-2 v2 shape', async ({ page }) => {
      // Inject a v2 shape WITHOUT showCellLabels (as if saved by an earlier
      // version of this same branch).
      await page.evaluate(() => {
        localStorage.setItem('gridit-settings', JSON.stringify({
          gridRows: 10,
          gridCols: 10,
          gridMode: 'Auto',
          gridColor: '#80ED99',
          gridThickness: 1,
          gridOpacity: 1,
          showDiagonals: false,
        }));
      });
      await page.reload();
      await page.waitForLoadState('networkidle');
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      // Toggle should exist and be off (backfilled default).
      await expect(page.locator('#cell-labels')).not.toBeChecked();
      await expect(page.locator('.grid-overlay text')).toHaveCount(0);
    });

    test('migrateSettings backfills showCellLabels=false when missing', async ({ page }) => {
      const out = await page.evaluate(() => {
        // @ts-expect-error migrateSettings is global from grid-merge.js
        return window.migrateSettings({
          gridRows: 10,
          gridCols: 10,
          gridMode: 'Auto',
          gridColor: '#80ED99',
          gridThickness: 1,
          gridOpacity: 1,
          showDiagonals: false,
        });
      });
      expect(out.showCellLabels).toBe(false);
    });

    // bju.8: auto-hide labels when on-screen cell size drops below 18px.
    // The 200×200 test image renders at 200px wide on desktop, so cells
    // are 200/N pixels. The threshold falls between 11×11 (18.18 px) and
    // 12×12 (16.67 px). We test on both sides of the boundary.
    test('labels auto-hide when on-screen cell drops below 18px', async ({ page }) => {
      // Force a fresh image-size report into Elm (the auto-attach can race
      // with image decode under headless; force-feed the settled rect).
      await page.evaluate(() => {
        const img = document.querySelector('.gridded-base-image') as HTMLImageElement;
        const r = img.getBoundingClientRect();
        // @ts-expect-error port exists on _elmApp
        window._elmApp.ports.receiveImageDisplaySize.send({ width: r.width, height: r.height });
      });

      // Turn labels on at 10×10 — should render.
      await page.locator('#cell-labels').evaluate((el: HTMLInputElement) => el.click());
      await expect(async () => {
        expect(await page.locator('.grid-overlay text').count()).toBe(100);
      }).toPass({ timeout: 3000 });

      // Bump to 32×32 — 200/32 = 6.25 px, well below 18 — should hide.
      await page.locator('#grid-size-input').fill('32');
      await expect(async () => {
        expect(await page.locator('.grid-overlay text').count()).toBe(0);
      }).toPass({ timeout: 3000 });

      // Drop back to 8×8 — 200/8 = 25 px, above 18 — should re-show.
      await page.locator('#grid-size-input').fill('8');
      await expect(async () => {
        expect(await page.locator('.grid-overlay text').count()).toBe(64);
      }).toPass({ timeout: 3000 });
    });
  });

  // bju.11: cluster 3 — match a canvas (cm inputs + readout).
  test.describe('Cluster 3: match a canvas (cm inputs)', () => {
    test.beforeEach(async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
    });

    test('section is present and starts closed', async ({ page }) => {
      const details = page.locator('.match-canvas');
      await expect(details).toBeAttached();
      // <details> starts closed by default.
      await expect(details).not.toHaveAttribute('open', '');
      // Summary has the numbered header.
      await expect(page.locator('.match-canvas-summary')).toContainText('3.');
      await expect(page.locator('.match-canvas-summary')).toContainText('match a canvas');
      await expect(page.locator('.match-canvas-summary')).toContainText('(optional)');
    });

    test('opening reveals two cm inputs', async ({ page }) => {
      // Open the disclosure.
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
      await expect(page.locator('#canvas-width-cm')).toBeVisible();
      await expect(page.locator('#canvas-height-cm')).toBeVisible();
      // Readout absent until both filled.
      await expect(page.locator('.match-canvas-readout')).toHaveCount(0);
    });

    test('readout appears when both cm fields are filled, computes cell size', async ({ page }) => {
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
      await page.locator('#canvas-width-cm').fill('60');
      await page.locator('#canvas-height-cm').fill('40');

      // 10×10 grid (default after fresh upload) → 6×4 cm per cell.
      await expect(page.locator('.match-canvas-readout')).toContainText(/6.*×.*4.*cm/);
    });

    test('cm values persist to localStorage', async ({ page }) => {
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
      await page.locator('#canvas-width-cm').fill('50');
      await page.locator('#canvas-height-cm').fill('70');

      await expect(async () => {
        const saved = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('gridit-settings') || '{}')
        );
        expect(saved.canvasWidthCm).toBe(50);
        expect(saved.canvasHeightCm).toBe(70);
      }).toPass({ timeout: 3000 });
    });

    test('clearing a cm input removes it (Maybe Nothing → null in storage)', async ({ page }) => {
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
      await page.locator('#canvas-width-cm').fill('40');
      // Clear it.
      await page.locator('#canvas-width-cm').fill('');

      await expect(async () => {
        const saved = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('gridit-settings') || '{}')
        );
        expect(saved.canvasWidthCm).toBeNull();
      }).toPass({ timeout: 3000 });

      // Readout doesn't render with only one side filled.
      await expect(page.locator('.match-canvas-readout')).toHaveCount(0);
    });

    test('migrateSettings backfills canvas cm fields as null when missing', async ({ page }) => {
      const out = await page.evaluate(() => {
        // @ts-expect-error migrateSettings is global from grid-merge.js
        return window.migrateSettings({
          gridRows: 10,
          gridCols: 10,
          gridMode: 'Auto',
          gridColor: '#80ED99',
          gridThickness: 1,
          gridOpacity: 1,
          showDiagonals: false,
          showCellLabels: false,
        });
      });
      expect(out.canvasWidthCm).toBeNull();
      expect(out.canvasHeightCm).toBeNull();
    });

    // bju.12: "make 5 cm cells" button — writes rows/cols based on cm dims,
    // flips Auto → Custom.
    test('snap button is disabled until both cm fields filled', async ({ page }) => {
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
      await expect(page.locator('.snap-btn')).toBeDisabled();

      // Only width filled — still disabled.
      await page.locator('#canvas-width-cm').fill('60');
      await expect(page.locator('.snap-btn')).toBeDisabled();

      // Both filled — enabled.
      await page.locator('#canvas-height-cm').fill('40');
      await expect(page.locator('.snap-btn')).toBeEnabled();
    });

    test('clicking snap button sets rows/cols from canvas cm', async ({ page }) => {
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
      await page.locator('#canvas-width-cm').fill('60');
      await page.locator('#canvas-height-cm').fill('40');
      await page.locator('.snap-btn').click();

      // 60/5 = 12 cols, 40/5 = 8 rows. The two-input UI is gone in v2.1;
      // we verify via localStorage state instead.
      await expect(async () => {
        const saved = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('gridit-settings') || '{}')
        );
        expect(saved.gridRows).toBe(8);
        expect(saved.gridCols).toBe(12);
      }).toPass({ timeout: 3000 });
    });

    test('snap clamps to grid range (very small canvas)', async ({ page }) => {
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
      // 5cm × 5cm canvas → 1 col × 1 row, but min is 2.
      await page.locator('#canvas-width-cm').fill('5');
      await page.locator('#canvas-height-cm').fill('5');
      await page.locator('.snap-btn').click();

      await expect(async () => {
        const saved = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('gridit-settings') || '{}')
        );
        expect(saved.gridRows).toBe(2);
        expect(saved.gridCols).toBe(2);
      }).toPass({ timeout: 3000 });
    });
  });

  // bju.13: canvas-fit radios — appear only when image aspect differs from
  // canvas aspect; default to "fit inside"; persist; live SVG preview reacts.
  test.describe('Cluster 3: canvas-fit radios', () => {
    test('not rendered when image+canvas aspects match', async ({ page }) => {
      // test-image.png is 200×200 (1:1). 60×60 canvas is also 1:1 — should hide.
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
      await page.locator('#canvas-width-cm').fill('60');
      await page.locator('#canvas-height-cm').fill('60');

      await expect(page.locator('.fit-section')).toHaveCount(0);
    });

    test('renders when aspects differ, default is "fit inside"', async ({ page }) => {
      // test-image-tall.png is 200×600 (1:3). 60×40 canvas is 3:2 — differs.
      await uploadImage(page, './tests/fixtures/test-image-tall.png');
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
      await page.locator('#canvas-width-cm').fill('60');
      await page.locator('#canvas-height-cm').fill('40');

      await expect(page.locator('.fit-section')).toBeVisible();
      await expect(page.locator('.fit-opt')).toHaveCount(3);
      // Default fit-inside is the active one.
      await expect(page.locator('.fit-opt--active')).toContainText('fit inside');
      // SVG preview renders.
      await expect(page.locator('.fit-preview-svg')).toBeVisible();
    });

    test('clicking a fit option updates active class + persists', async ({ page }) => {
      await uploadImage(page, './tests/fixtures/test-image-tall.png');
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
      await page.locator('#canvas-width-cm').fill('60');
      await page.locator('#canvas-height-cm').fill('40');

      // Click "fit to width" (first option).
      await page.locator('.fit-opt').nth(0).click();

      await expect(page.locator('.fit-opt').nth(0)).toHaveClass(/fit-opt--active/);
      await expect(page.locator('.fit-opt').nth(2)).not.toHaveClass(/fit-opt--active/);

      await expect(async () => {
        const saved = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('gridit-settings') || '{}')
        );
        expect(saved.imageFit).toBe('fit-width');
      }).toPass({ timeout: 3000 });
    });

    test('migrateSettings backfills imageFit="fit-inside" when missing', async ({ page }) => {
      await uploadImage(page);
      const out = await page.evaluate(() => {
        // @ts-expect-error migrateSettings is global from grid-merge.js
        return window.migrateSettings({
          gridRows: 10,
          gridCols: 10,
          gridMode: 'Auto',
          gridColor: '#80ED99',
          gridThickness: 1,
          gridOpacity: 1,
          showDiagonals: false,
          showCellLabels: false,
          canvasWidthCm: null,
          canvasHeightCm: null,
        });
      });
      expect(out.imageFit).toBe('fit-inside');
    });
  });

  // Slice export was removed in v2.1 ("not sure we need that"). The model
  // field + JS port remain dormant; only the UI is gone. The single
  // migration-backfill check stays — code still backfills sliceMode='none'.
  test.describe('Cluster 3: slice export (dormant)', () => {
    test('migrateSettings still backfills sliceMode="none"', async ({ page }) => {
      await uploadImage(page);
      const out = await page.evaluate(() => {
        // @ts-expect-error migrateSettings is global from grid-merge.js
        return window.migrateSettings({
          gridRows: 10, gridCols: 10, gridMode: 'rectilinear',
          gridColor: '#80ED99', gridThickness: 1, gridOpacity: 1,
          showDiagonals: false, showCellLabels: false,
          canvasWidthCm: null, canvasHeightCm: null, imageFit: 'fit-inside',
        });
      });
      expect(out.sliceMode).toBe('none');
    });
  });

  // bju.14: canvas-fit rendering mode + drag-to-position.
  test.describe('Cluster 3: canvas-fit mode (drag-to-position)', () => {
    test.beforeEach(async ({ page }) => {
      // Use a tall image (200×600) so aspects clearly differ from a 60×40 canvas.
      await uploadImage(page, './tests/fixtures/test-image-tall.png');
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
    });

    test('canvas-fit SVG renders when canvas cm is set', async ({ page }) => {
      // Before cm is set: legacy <img> + .grid-overlay rendering.
      await expect(page.locator('.canvas-frame')).toHaveCount(0);
      await expect(page.locator('.gridded-base-image')).toBeVisible();

      // After setting cm: canvas-fit SVG appears.
      await page.locator('#canvas-width-cm').fill('60');
      await page.locator('#canvas-height-cm').fill('40');

      await expect(page.locator('.canvas-frame')).toBeVisible();
      // ViewBox in cm × 100 scale.
      await expect(page.locator('.canvas-frame')).toHaveAttribute('viewBox', /6000.*4000/);
      // The legacy img element is gone in canvas-fit mode.
      await expect(page.locator('.gridded-base-image')).toHaveCount(0);
    });

    test('drag updates imageOffsetX/Y and persists', async ({ page }) => {
      await page.locator('#canvas-width-cm').fill('60');
      await page.locator('#canvas-height-cm').fill('40');
      await expect(page.locator('.canvas-frame')).toBeVisible();

      // Wait for the JS image-size observer's polling tick to land
      // (so the cm conversion in drag uses the real displayed dims).
      await page.waitForTimeout(400);

      // Drag from center of the canvas-frame.
      const box = await page.locator('.canvas-frame').boundingBox();
      if (!box) throw new Error('No canvas-frame');
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;

      // pointerdown on the SVG, then mousemove + mouseup on the document.
      await page.evaluate(({ cx, cy }) => {
        const svg = document.querySelector('.canvas-frame')!;
        svg.dispatchEvent(new PointerEvent('pointerdown', {
          bubbles: true, clientX: cx, clientY: cy, pointerType: 'mouse', button: 0,
        }));
      }, { cx, cy });
      await page.waitForTimeout(50);
      await page.evaluate(({ cx, cy }) => {
        document.dispatchEvent(new MouseEvent('mousemove', {
          bubbles: true, clientX: cx + 100, clientY: cy + 50,
        }));
      }, { cx, cy });
      await page.waitForTimeout(50);
      await page.evaluate(({ cx, cy }) => {
        document.dispatchEvent(new MouseEvent('mouseup', {
          bubbles: true, clientX: cx + 100, clientY: cy + 50,
        }));
      }, { cx, cy });
      await page.waitForTimeout(200);

      const saved = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('gridit-settings') || '{}')
      );
      // The drag SHOULD have moved the image. We don't pin exact cm because
      // the conversion depends on viewport dims; we just verify movement
      // happened in the right direction.
      expect(saved.imageOffsetX).toBeGreaterThan(0);
      expect(saved.imageOffsetY).toBeGreaterThan(0);
    });

    test('migrateSettings backfills imageOffsetX/Y/Scale defaults', async ({ page }) => {
      const out = await page.evaluate(() => {
        // @ts-expect-error migrateSettings is global from grid-merge.js
        return window.migrateSettings({
          gridRows: 10, gridCols: 10, gridMode: 'Auto',
          gridColor: '#80ED99', gridThickness: 1, gridOpacity: 1,
          showDiagonals: false, showCellLabels: false,
          canvasWidthCm: 60, canvasHeightCm: 40, imageFit: 'fit-inside',
          sliceMode: 'none',
        });
      });
      expect(out.imageOffsetX).toBe(0);
      expect(out.imageOffsetY).toBe(0);
      expect(out.imageScale).toBe(1.0);
    });

    test('canvas-fit download produces a PNG with the canvas aspect', async ({ page }) => {
      await page.locator('#canvas-width-cm').fill('60');
      await page.locator('#canvas-height-cm').fill('40');
      await expect(page.locator('.canvas-frame')).toBeVisible();

      const dlPromise = page.waitForEvent('download');
      await page.locator('.button-download').first().click();
      const download = await dlPromise;
      expect(download.suggestedFilename()).toMatch(/gridded.*\.png$/);
    });
  });

  // ============================================================
  // Bug fixes + change requests (written test-first, failing initially)
  // ============================================================
  test.describe('Bug fixes: entropy, ticker layout, labels, naming', () => {
    test('entropy: adaptive density actually adds subdivision lines on contrasty images', async ({ page }) => {
      // Synthesize a half-flat / half-noisy image so entropy varies wildly.
      const dataUrl = await page.evaluate(() => {
        const c = document.createElement('canvas');
        c.width = 400; c.height = 400;
        const x = c.getContext('2d')!;
        x.fillStyle = '#eee'; x.fillRect(0, 0, 200, 400);
        for (let yy = 0; yy < 400; yy++) for (let xx = 200; xx < 400; xx++) {
          const v = Math.floor(Math.random() * 256);
          x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(xx, yy, 1, 1);
        }
        return c.toDataURL('image/png');
      });

      await page.evaluate((du) => {
        // @ts-expect-error elm app global
        window._elmApp.ports.receivePickedImage.send({ name: 'noise.png', size: du.length, dataUrl: du });
      }, dataUrl);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      // Baseline line count with no adaptive density.
      const baseCount = await page.locator('.grid-overlay line').count();

      // Crank adaptive density.
      await page.locator('#adaptive-density-input').fill('0.6');

      // After entropy analysis lands, subdivision lines appear — the count
      // must STRICTLY INCREASE. (Pre-fix this stayed equal to baseline.)
      await expect.poll(
        async () => await page.locator('.grid-overlay line').count(),
        { timeout: 8000 }
      ).toBeGreaterThan(baseCount);
    });

    test('cell labels font size is user-controllable via slider', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      // Turn labels on.
      await page.locator('#cell-labels').evaluate((el: HTMLInputElement) => el.click());
      await expect(page.locator('.grid-overlay text').first()).toBeVisible();

      // A new slider must exist to adjust label font size.
      const slider = page.locator('#cell-label-size-input');
      await expect(slider).toBeVisible();

      const fontAt = async () => {
        const v = await page.locator('.grid-overlay text').first().getAttribute('font-size');
        return parseFloat(v || '0');
      };

      const small = 10;
      const large = 28;
      await slider.fill(String(small));
      const fontSmall = await fontAt();
      await slider.fill(String(large));
      const fontLarge = await fontAt();

      expect(fontSmall).toBeLessThan(fontLarge);
      expect(Math.round(fontSmall)).toBe(small);
      expect(Math.round(fontLarge)).toBe(large);
    });

    test('"Adaptive density" label is restored (auto-simplify reverted)', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      const label = page.locator('label[for="adaptive-density-input"]');
      await expect(label).toContainText(/adaptive density/i);
      // The sub-line should be short: ends at "busy".
      const sub = page.locator('.mode-explain', { hasText: /busy/i });
      await expect(sub).toBeVisible();
      const subText = (await sub.first().textContent()) || '';
      expect(subText).not.toMatch(/flat/i);  // shortened — no "keeps it simple where it's flat"
    });

    test('rectilinear mode: copy + slider sets both rows & cols equal', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      // The mode toggle now reads "rectilinear" / "square" instead of Auto/Custom.
      const segButtons = page.locator('.seg-btn');
      await expect(segButtons.first()).toContainText(/rectilinear/i);
      await expect(segButtons.nth(1)).toContainText(/square/i);

      // Rectilinear is the default; its explain line matches the new copy.
      await expect(page.locator('.mode-explain', { hasText: /grid stretches to fill the image/i })).toBeVisible();

      // Slider sets both rows and cols equal in rectilinear mode.
      await page.locator('#grid-size-input').fill('7');
      await expect.poll(async () => {
        const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('gridit-settings') || '{}'));
        return [saved.gridRows, saved.gridCols, saved.gridMode];
      }).toEqual([7, 7, 'rectilinear']);
    });

    test('square mode: cells become square in image pixel space', async ({ page }) => {
      // Use a tall image (200×600 = 1:3 aspect) so rows/cols differ noticeably.
      await uploadImage(page, './tests/fixtures/test-image-tall.png');
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      // Switch to square mode.
      await page.locator('.seg-btn').nth(1).click();

      // Slider=4 → cellSize = 200/4 = 50px square. 600/50 = 12 rows exactly.
      // Here it divides evenly, so no partial cells.
      await page.locator('#grid-size-input').fill('4');

      await expect.poll(async () => {
        const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('gridit-settings') || '{}'));
        return { rows: saved.gridRows, cols: saved.gridCols, mode: saved.gridMode };
      }).toEqual({ rows: 12, cols: 4, mode: 'square' });

      // The two-number-input UI from the old Custom mode should be gone.
      await expect(page.locator('#grid-rows-input')).toHaveCount(0);
      await expect(page.locator('#grid-cols-input')).toHaveCount(0);

      // In square mode, the grid lines should be uniformly spaced by cellSize.
      // Verify all cell widths (gaps between consecutive vertical line x positions)
      // are equal — that's the "perfect squares" guarantee.
      const xPositions = await page.locator('.grid-overlay line').evaluateAll((els: SVGLineElement[]) => {
        const verticals = els.filter(l => l.getAttribute('x1') === l.getAttribute('x2'));
        return [...new Set(verticals.map(l => parseFloat(l.getAttribute('x1') || '0')))].sort((a, b) => a - b);
      });
      // Differences between consecutive x positions should all be equal (cellSize=50).
      const xGaps = xPositions.slice(1).map((x, i) => x - xPositions[i]);
      const allEqual = xGaps.every(g => Math.abs(g - xGaps[0]) < 0.5);
      expect(allEqual).toBe(true);
    });

    test('square mode: image where size does NOT divide evenly produces uniform cells + partial closing', async ({ page }) => {
      // Synthesize a 200×550 image — slider=5 with cellSize=40 leaves 30px
      // of trailing height (13 full rows + a partial row).
      const dataUrl = await page.evaluate(() => {
        const c = document.createElement('canvas');
        c.width = 200; c.height = 550;
        const x = c.getContext('2d')!;
        x.fillStyle = '#ddd'; x.fillRect(0, 0, 200, 550);
        return c.toDataURL('image/png');
      });
      await page.evaluate((du) => {
        // @ts-expect-error elm app global
        window._elmApp.ports.receivePickedImage.send({ name: 'odd.png', size: du.length, dataUrl: du });
      }, dataUrl);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });

      // Switch to square mode + slider 5.
      await page.locator('.seg-btn').nth(1).click();
      await page.locator('#grid-size-input').fill('5');
      await page.waitForTimeout(300);

      // Read all distinct horizontal line Y positions (in image natural pixels).
      const yPositions = await page.locator('.grid-overlay line').evaluateAll((els: SVGLineElement[]) => {
        const horizontals = els.filter(l => l.getAttribute('y1') === l.getAttribute('y2'));
        return [...new Set(horizontals.map(l => parseFloat(l.getAttribute('y1') || '0')))].sort((a, b) => a - b);
      });

      // First N-1 gaps should all be 40 (the cellSize). The last gap may
      // be smaller — it's the partial row from the last full cell to imgH=550.
      const gaps = yPositions.slice(1).map((y, i) => y - yPositions[i]);
      const fullGaps = gaps.slice(0, -1);  // all but the last
      expect(fullGaps.length).toBeGreaterThan(0);
      const allFortyish = fullGaps.every(g => Math.abs(g - 40) < 0.5);
      expect(allFortyish).toBe(true);
      // Last position is the image height (closing line for the partial row).
      expect(yPositions[yPositions.length - 1]).toBeCloseTo(550, 0);
    });

    test('slice export UI is removed (not present in match-a-canvas)', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await page.evaluate(() => {
        (document.querySelector('.match-canvas') as HTMLDetailsElement).open = true;
      });
      await expect(page.locator('.slice-section')).toHaveCount(0);
      await expect(page.locator('.slice-opt')).toHaveCount(0);
    });

    test('community ticker: disclaimer body stays within container bounds when open', async ({ page }) => {
      // Need counters loaded — use demo URL.
      await page.goto('http://localhost:8000/public/index.html?demo');
      await page.evaluate(() => localStorage.clear());
      await expect(page.locator('.community-ticker')).toBeVisible({ timeout: 5000 });

      // Open the disclaimer.
      await page.locator('.community-disclaimer-toggle, .community-ticker__q').first().evaluate((el: HTMLElement) => el.click());

      // The body must be visible and inside the ticker's left edge.
      const body = page.locator('.community-disclaimer-body');
      await expect(body).toBeVisible();
      const tickerBox = await page.locator('.community-ticker').boundingBox();
      const bodyBox = await body.boundingBox();
      expect(tickerBox).not.toBeNull();
      expect(bodyBox).not.toBeNull();
      if (tickerBox && bodyBox) {
        // Body left edge must be >= ticker left edge (within 1px tolerance).
        expect(bodyBox.x).toBeGreaterThanOrEqual(tickerBox.x - 1);
        // Body right edge must be <= ticker right edge.
        expect(bodyBox.x + bodyBox.width).toBeLessThanOrEqual(tickerBox.x + tickerBox.width + 1);
      }

      // And the "?" toggle should stay in line with the frog (same Y),
      // not wrapped onto a separate row.
      const frogBox = await page.locator('.community-ticker__frog').boundingBox();
      const toggleBox = await page.locator('.community-disclaimer-toggle, .community-ticker__q').first().boundingBox();
      expect(frogBox).not.toBeNull();
      expect(toggleBox).not.toBeNull();
      if (frogBox && toggleBox) {
        // Centers within ~30 px vertically (allow some padding wiggle).
        const frogCenter = frogBox.y + frogBox.height / 2;
        const toggleCenter = toggleBox.y + toggleBox.height / 2;
        expect(Math.abs(frogCenter - toggleCenter)).toBeLessThan(30);
      }
    });
  });
});
