# Gridit design system

All visual tokens live in `:root` at the top of `public/index.html`. Run
`npm run audit:css` for a health check.

## Color

| Token | Purpose |
|---|---|
| `--background` | App background |
| `--foreground` | Default text on `--background` |
| `--card` | Card surface (settings, upload prompt) |
| `--primary` | Primary action color (download button, primary toggle on-state) |
| `--primary-dark` | Darker shade of primary, used for borders on hover/checked |
| `--muted` | Off-state toggle track |
| `--muted-foreground` | Secondary text |
| `--accent` | Subtle accent surface (numeric value badges, footer tooltip ring) |
| `--accent-success` | Heart in footer ("Made in Argentina with ♡") |
| `--border` | Default border |
| `--input` | Input border tint |
| `--ring` | Focus ring base color |
| `--on-primary` | Text on a `--primary` background |
| `--on-background` / `--on-background-secondary` / `--on-background-tertiary` | Layered text on background |
| `--preview-card-bg` | Image preview card background |

User-chosen grid color is **not** a token — it lives in the Elm model and
is applied as an inline `background-color` style on `.color-preview` and
the preset swatches.

## Gradients
- `--primary-gradient` — primary button base
- `--primary-gradient-hover` — primary button hover
- `--secondary-gradient` — share button
- `--glass-primary`, `--glass-border`, `--glass-border-subtle` — card glass surfaces

## Shadows
- `--shadow-glass`, `--shadow-glass-inset` — card surfaces
- `--shadow-elevated` — elevated cards
- `--shadow-floating` — slider thumbs
- `--shadow-subtle` — subtle dividers
- `--shadow-button` / `--shadow-button-hover` — primary button rest/hover
- `--shadow-input` / `--shadow-input-hover` — language select rest/hover

## Focus rings
- `--ring-focus` — primary focus ring (toggle, slider thumb, etc.)
- `--ring-input-focus` — language select focus ring

## Type scale
| Token | Value | Use |
|---|---|---|
| `--font-display` | 32px | App title only |
| `--font-body` | 16px | Default body text |
| `--font-body-line` | 1.5 | Default line height |
| `--font-body-weight` | 400 | Default weight |
| `--font-caption` | 14px | Caption labels |
| `--font-small` | 12px | Small print |

## Spacing scale
| Token | Value |
|---|---|
| `--spacing-xxs` | 4px |
| `--spacing-xs` | 8px |
| `--spacing-sm` | 16px |
| `--spacing-md` | clamp(16px, 2vw, 24px) |
| `--spacing-lg` | clamp(24px, 3vw, 32px) |
| `--spacing-xl` | 48px |

## Radii
- `--radius-md`: 12px (cards, inputs)
- `--radius-full`: 9999px (pills, circular thumbs)

## Motion
- `--ease-out-cubic` — most transitions
- `--ease-spring` — spring-y motion (toggle thumb)

## Effects
- `--blur-sm` — 8px blur (glass surfaces)

## Breakpoints

CSS media queries cannot consume custom properties, so the following are
**informational only** — the actual breakpoints are inlined in `@media`
queries.

- `--breakpoint-mobile`: **640px** — used by `(max-width: 640px)` for
  touch-target sizing and small-image max-height shrink.
- `--breakpoint-desktop`: **768px** — used by `(min-width: 768px)` for
  desktop layout (side-by-side preview + settings).
- A second mobile-ish breakpoint at **767px** (`(max-width: 767px)`) is
  intentionally separate — it covers tablet-and-smaller for app-header
  stacking and font-size shrink. This is "less than `--breakpoint-desktop`"
  rather than a phone-specific rule.

## Component primitives

### `.svg-icon`
Inline SVG icon. `display: inline-block; vertical-align: middle`.

### `.light-switch` / `-track` / `-thumb` / `-label`
Custom toggle with a 22×22 thumb sliding inside a 52×28 track. Both the
track and the thumb have `flex-shrink: 0` so the layout never squashes
the thumb when the parent cell is narrow.

### `.slider`
Custom-styled `<input type="range">`:
- 6px track on desktop, 8px on mobile
- 20px circular thumb on desktop, 32px on mobile (touch targets)
- Track gradient: `hsl(35, 30%, 78%) → hsl(152, 38%, 65%)`
- `.slider--hue` overrides the track with a full rainbow gradient

### `.control-group` + `.control-header` + `.control-label` + `.control-value`
Standard slider settings row. Built by the `viewSliderControl` helper in
`Main.elm`.

### `.color-preview` + `.color-swatch`
Both are circular color samples. `.color-preview` (16×16) is the
inline preview next to the "Color" label. `.color-swatch` (24×24
desktop / 44×44 mobile for touch) is a clickable preset.

## Adding a new token

1. Add it to `:root` in `public/index.html` under the right section.
2. Use it via `var(--name)`.
3. Run `npm run audit:css` — the unused-token count should not grow.
4. If you found yourself adding a hex/rgba/hsla literal in a rule outside
   `:root`, ask if it's repeated. If yes → token. If no → ok inline (rare
   one-off).

## Adding a new breakpoint

Don't, unless absolutely necessary. The two existing mobile breakpoints
(640, 767) plus the desktop (768) cover:
- 0–640: phones, big touch targets, smallest images
- 641–767: small tablets, transitional
- 768+: desktop layout
