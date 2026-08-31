---
name: Ivory & Ink
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#45474b'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#76777c'
  outline-variant: '#c6c6cb'
  surface-tint: '#5b5e68'
  primary: '#02040a'
  on-primary: '#ffffff'
  primary-container: '#1a1e26'
  on-primary-container: '#828690'
  inverse-primary: '#c3c6d1'
  secondary: '#0040e0'
  on-secondary: '#ffffff'
  secondary-container: '#2e5bff'
  on-secondary-container: '#efefff'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cba72f'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dfe2ed'
  primary-fixed-dim: '#c3c6d1'
  on-primary-fixed: '#181c24'
  on-primary-fixed-variant: '#434750'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c3ff'
  on-secondary-fixed: '#001356'
  on-secondary-fixed-variant: '#0035be'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  key-black: '#121417'
  key-white: '#FFFFFF'
  highlight-teal: '#00B4D8'
  scale-tone-muted: '#E2E8F0'
  success-green: '#22C55E'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  notation-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 24px
  gutter: 16px
  card-padding: 20px
  keyboard-height-desktop: 240px
  keyboard-height-mobile: 180px
---

## Brand & Style

The design system for this product is rooted in the philosophy of **High-Precision Minimalist**. It balances the technical rigor of music theory with a calm, educational atmosphere that avoids the clutter of traditional Digital Audio Workstations (DAWs). 

The aesthetic is inspired by premium architectural software and modern editorial design: clean lines, generous whitespace, and a focus on functional clarity. It uses subtle depth and refined typography to guide the user's eye toward the piano keyboard, which serves as the "source of truth" for all interactions. The emotional response should be one of quiet confidence and focused discovery—feeling less like a complex utility and more like a well-organized studio workspace.

## Colors

The palette is anchored by **Sophisticated Indigo/Charcoal** (`primary`), which provides structural stability and represents the physical presence of the piano's black keys. 

- **Primary:** Used for text, primary UI borders, and active key states.
- **Secondary (Vibrant Blue):** Dedicated to active musical states—highlighting chord tones and primary action buttons.
- **Tertiary (Gold):** Specifically reserved for the **Root Note** marker, providing a high-contrast semantic signal that doesn't conflict with other highlights.
- **Neutral:** A range of cool grays and "paper" whites (`#F8F9FA`) to ensure the keyboard remains the most high-contrast element on the screen.

Color is never the sole indicator of meaning; it is paired with geometric markers (dots, diamonds, or borders) to ensure accessibility for all users.

## Typography

The system uses a tri-font hierarchy to separate UI, content, and data:

1.  **Hanken Grotesk (Headlines):** A modern, sharp sans-serif that feels contemporary and "engineered." Used for primary titles and section headers.
2.  **Inter (Body):** The workhorse for all instructional text, tooltips, and descriptions. Chosen for its exceptional legibility and neutral character.
3.  **JetBrains Mono (Notation & Labels):** Used for BPM displays, Roman numerals, chord formulas (e.g., 1-b3-5), and technical labels. The monospaced nature ensures that musical patterns align vertically when compared.

Type scales are strictly adhered to, with larger headlines stepping down significantly on mobile devices to preserve screen real estate for the keyboard.

## Layout & Spacing

This design system employs a **Fixed Grid** for desktop (max-width 1280px) and a **Fluid Grid** for mobile. 

- **The Piano Keyboard:** Always occupies a dedicated horizontal band. On mobile, this band allows horizontal scrolling with a "sticky" indicator of the current octave range.
- **Control Panels:** Grouped into 2 or 3 columns on desktop using a 12-column grid. On mobile, these reflow into a single-column stack.
- **The Playback Bar:** A persistent, fixed-bottom container (height: 72px) that acts as the anchor for the entire experience. It houses the metronome, transport controls, and volume.

Spacing follows an 8px rhythm. Margins are generous (24px) to promote a "calm" atmosphere, while gutters are tighter (16px) to keep related musical controls (like Root and Quality) grouped.

## Elevation & Depth

To maintain a "High-Precision" feel, the system avoids heavy drop shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

1.  **Surface 0 (Background):** The base neutral gray/white.
2.  **Surface 1 (Cards/Panels):** Pure white background with a 1px border (`#E2E8F0`). This creates a crisp, architectural look.
3.  **Surface 2 (Active/Pressed):** Elements that are active or currently being pressed (like piano keys) use a subtle interior shadow to feel physically "depressed."
4.  **Floating Elements (Modals/Backing Track Mixers):** Use a high-diffusion, low-opacity shadow (0px 10px 30px rgba(0,0,0,0.05)) to suggest they are temporarily layered over the workspace.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a professional, "tooled" feel without the playfulness of fully rounded corners. 

- **Piano Keys:** Maintain traditional rectangular forms with a very slight (2px) radius on the bottom edges to simulate physical keycaps.
- **Action Buttons:** Use the standard `rounded-md` (0.25rem).
- **Control Groups:** Use a shared container border where only the outer corners are rounded, reinforcing the relationship between buttons within a group (e.g., the Time Signature selector).

## Components

### Piano Keyboard (Hero)
- **White Keys:** White fill, 1px neutral-300 border. Pressed state: Light blue tint (`#EBF5FF`).
- **Black Keys:** Primary indigo fill. Pressed state: Slightly lighter indigo.
- **Markers:** Chord tones are marked with a solid blue dot. The Root note is marked with a Gold Diamond icon. Scale tones use a faint, semi-transparent blue ring.

### Control Panels
Cards should have clear headers using `label-mono`. Controls within should be segmented—for example, the "Root Note" selector should look like a horizontal segmented control for quick tapping.

### Buttons & Chips
- **Primary Button:** Solid Primary (Indigo) with white `label-mono` text.
- **Ghost Button:** No fill, 1px border. Used for secondary options like "Inversions."
- **Status Chips:** Small, pill-shaped markers for genre labels (e.g., "Jazz," "Pop") using `body-sm` and subtle background tints.

### Playback Bar
A full-width container at the bottom. The Metronome should be a circular visual "beat" indicator that pulses in sync with the audio. Transport icons (Play/Pause) should be larger and more prominent than other UI elements.

### Progression Cards
Should include a small "mini-map" of the keyboard or a clean Roman numeral display. Use `notation-lg` for the chord letters (e.g., **F#m7**) to ensure they are the most readable part of the card.