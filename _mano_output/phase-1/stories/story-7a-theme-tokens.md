### STORY-7a: Theme tokens and system

#### What and why
A beginner opening the app should land in the Ivory & Ink visual language regardless of their OS appearance. Today the app has a hand-written two-palette block; this story establishes the canonical token set from the design brief and the `data-theme` mechanism both modes share, so every later restyle story reads from one source.

#### Done when
- [ ] With the OS set to light appearance, the page loads with the light palette; with the OS set to dark, it loads with the dark palette.
- [ ] Every colour on the page comes from a token defined in `src/index.css` (no inline hex in component styles after all restyle stories land).
- [ ] All three type styles (headline, body, mono) are defined by three font-family tokens in `src/index.css`; changing the stack in those tokens re-styles every headline, body, and mono label in the app with no other edit.
- [ ] Setting the theme in the store changes the `data-theme` attribute on the document root immediately; clearing it back to the other value re-colours the page accordingly.
- [ ] Test: the store theme defaults to the OS preference on load.
- [ ] Test: `setTheme('dark')` puts `data-theme="dark"` on the document root and the page background and text switch to the dark tokens.

#### Not this story
- The header `ToggleSwitch` that calls `setTheme` (story-7c).
- Migrating individual components from their legacy CSS variables to the new token names (stories-7c, 7d, 7e).
- Bundling font asset files (out of scope this phase — fonts run on the fallback stacks below).

#### Notes
Depends on: nothing (foundation for stories-7b–7e). The design brief's light/dark hex pairs are the canonical values; the story must not duplicate them.

#### Implementation Reference
- **Build:** define the full token set in `src/index.css` as `:root[data-theme='light'] { ... }` and `:root[data-theme='dark'] { ... }` blocks; map legacy variable names the current components still reference (`--text`, `--text-h`, `--bg`, `--border`, `--accent`, `--mono`, `--key-white`, `--key-black`, `--chord-tone-bg`, `--scale-note-bg`, `--border-strong`) to the new tokens so nothing breaks before its restyle story
- **Fonts (single source of truth):** define the three font-family tokens once in `src/index.css` `:root`, outside the theme blocks — `--font-display: 'Hanken Grotesk', system-ui, sans-serif`, `--font-body: 'Inter', system-ui, sans-serif`, `--font-mono: 'JetBrains Mono', ui-monospace, monospace`. Typography tokens (`--text-headline-xl` … `--text-notation-lg`) set their `font-family` to `var(--font-…)`. Every font-family value in the app is one of these three `var(--font-*)` references — components never write a literal `font-family`. Changing fonts later means editing these three lines (and, if self-hosting is ever adopted, adding `@font-face` beside them) — a single place, per the resolved font decision
- **State:** add `theme: 'light' | 'dark'` plus `setTheme` to `src/store/useSelectionStore.ts` (view state lives in the store)
- **Design:** `design-brief.md §Theme system`, `§Colour palette`, `§Typography`, `§Spacing & shape` — exact token names, Light/Dark hex values, and the tri-font family choices (Hanken Grotesk / Inter / JetBrains Mono)
- **Rules:** `project-rules.md §Patterns — Theme` (data-theme on document root, system preference default, choice persists for the session, AA verified per pairing); `§Patterns — State Management` (view state in the store)
- **Do not:** no `localStorage`/persistence (tech-spec says no storage this phase); no inline hex in components; no literal `font-family` in any component CSS; no `@font-face` this phase (fallback stacks above)
