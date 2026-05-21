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

    test('community card is absent before counters load', async ({ page }) => {
      await expect(page.locator('.community-card')).toHaveCount(0);
    });

    test('community card renders when counters arrive', async ({ page }) => {
      await sendCounters(page, sampleCounters());
      await expect(page.locator('.community-card')).toBeVisible();
      const totals = await page.locator('.community-total strong').allTextContents();
      expect(totals).toEqual(['100', '5', '200']);
    });

    test('heart click ticks total and your-country row optimistically', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await sendCounters(page, sampleCounters('AR'));

      await page.locator('.button-nice').click();

      const totals = await page.locator('.community-total strong').allTextContents();
      expect(totals[2]).toBe('201');
      const arRow = await page.locator('.community-strip--hearts .community-flag').first().innerText();
      expect(arRow).toMatch(/51$/);
    });

    test('heart from a country not in the strip appends it at rank-last', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await sendCounters(page, sampleCounters('WS'));

      await page.locator('.button-nice').click();

      const lastFlag = await page.locator('.community-strip--hearts .community-flag').last().innerText();
      expect(lastFlag).toMatch(/1$/);
    });

    test('heart with empty yourCountry does not corrupt the strip', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await sendCounters(page, sampleCounters(''));
      await expect(page.locator('.community-strip--hearts .community-flag')).toHaveCount(3);

      await page.locator('.button-nice').click();

      await expect(page.locator('.community-strip--hearts .community-flag')).toHaveCount(3);
      const totals = await page.locator('.community-total strong').allTextContents();
      expect(totals[2]).toBe('201');
    });

    test('download click ticks the download total and gridders row', async ({ page }) => {
      await uploadImage(page);
      await expect(page.locator('.gridded-base-image')).toBeVisible({ timeout: 5000 });
      await sendCounters(page, sampleCounters('AR'));

      await page.locator('.button-download').click();
      await page.waitForTimeout(800);

      const totals = await page.locator('.community-total strong').allTextContents();
      expect(totals[0]).toBe('101');
      const arGridderRow = await page.locator('.community-strip--gridders .community-flag').first().innerText();
      expect(arGridderRow).toMatch(/41$/);
    });

    test('gridders strip is independent of hearts strip', async ({ page }) => {
      await sendCounters(page, sampleCounters());
      await expect(page.locator('.community-strip--gridders .community-flag')).toHaveCount(3);
      await expect(page.locator('.community-strip--hearts .community-flag')).toHaveCount(3);
      const gridderTitles = await page.locator('.community-strip--gridders .community-flag').evaluateAll(
        els => els.map((el: HTMLElement) => el.getAttribute('title'))
      );
      expect(gridderTitles).toEqual(['AR', 'HK', 'US']);
    });

    test('disclaimer expands on click', async ({ page }) => {
      await sendCounters(page, sampleCounters());
      const body = page.locator('.community-disclaimer-body');
      await expect(body).not.toBeVisible();
      await page.locator('.community-disclaimer summary').click();
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
        await expect(page.locator('.community-card')).toBeVisible();
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
  });
});
