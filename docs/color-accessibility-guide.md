# Gridit Color and Accessibility Guide

This document outlines the color palette, accessibility considerations, and implementation plan for the Gridit application.

## Color Palette

The Gridit application follows a modern, accessible color scheme with sufficient contrast ratios while maintaining a clean, focused design aesthetic.

### Primary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary Green | `#57cc99` | Primary buttons, active controls |
| Primary Green (Light) | `#80ed99` | Hover states, highlights |
| Primary Green (Dark) | `#38a3a5` | Active states, text on light backgrounds |
| Secondary Yellow | `#FFD54F` | Secondary actions, drawer handle |
| Secondary Yellow (Dark) | `#F9A825` | Active states for secondary elements |

### Neutrals

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Background | `#FFFFFF` | Main background |
| Surface | `#F5F5F5` | Cards, panels, containers |
| Surface Variant | `#E0E0E0` | Alternative surface, disabled states |
| Outline | `#BDBDBD` | Borders, dividers |
| On Surface | `#212121` | Primary text |
| On Surface Variant | `#757575` | Secondary text, labels |

### Feedback Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Success | `#4CAF50` | Success messages |
| Error | `#F44336` | Error messages |
| Warning | `#FF9800` | Warning messages |
| Info | `#2196F3` | Information messages |

## Accessibility Considerations

### Text Contrast

- All text has a minimum contrast ratio of 4.5:1 against its background for normal text (WCAG AA)
- Large text (18pt+) has a minimum contrast ratio of 3:1 (WCAG AA)

### Touch Targets

- All interactive elements have a minimum touch target size of 44x44 pixels
- Sufficient spacing between interactive elements (minimum 8px)

### Focus States

- All interactive elements have visible focus states
- Focus order follows a logical sequence

### Screen Reader Support

- All images have appropriate alt text
- Form controls have associated labels
- ARIA attributes used where appropriate

## Implementation Plan

### 1. CSS Variables Update

Update the CSS variables in `public/index.html` to reflect the new color palette:

```css
:root {
  /* Primary palette */
  --md-primary: #57cc99;
  --md-primary-light: #80ed99;
  --md-primary-dark: #38a3a5;
  --md-on-primary: #FFFFFF;
  
  /* Secondary palette */
  --md-secondary: #FFD54F;
  --md-secondary-dark: #F9A825;
  --md-on-secondary: #212121;
  
  /* Neutral palette */
  --md-surface: #F5F5F5;
  --md-surface-variant: #E0E0E0;
  --md-surface-dim: #E0E0E0;
  --md-outline: #BDBDBD;
  --md-on-surface: #212121;
  --md-on-surface-variant: #757575;
  
  /* Feedback colors */
  --md-success: #4CAF50;
  --md-error: #F44336;
  --md-warning: #FF9800;
  --md-info: #2196F3;
}
```

### 2. Dark Mode Support (Future Enhancement)

For future implementation, a dark mode could use these colors:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --md-surface: #121212;
    --md-surface-variant: #333333;
    --md-outline: #555555;
    --md-on-surface: #FAFAFA;
    --md-on-surface-variant: #BBBBBB;
  }
}
```

### 3. Accessible Form Controls

Ensure all form controls:
- Have visible labels
- Include ARIA attributes where necessary
- Have sufficient contrast for borders and text
- Have clear focus states

### 4. Keyboard Navigation

Improve keyboard navigation:
- Tab order matches visual flow
- Visible focus indicators
- Keyboard shortcuts for common actions

### 5. Responsive Text Sizing

Implement responsive text sizing:
- Base font size: 16px
- Scale text using relative units (rem)
- Minimum text size on mobile: 14px

### 6. Testing Plan

Test the implementation with:
- WAVE or axe accessibility tools
- Keyboard-only navigation
- Screen reader testing (VoiceOver on macOS)
- Color contrast checkers

## Next Steps

1. Update the CSS variables in `public/index.html`
2. Apply the color scheme to all UI elements
3. Test with accessibility tools
4. Validate the design with real users
5. Consider dark mode implementation in the future
