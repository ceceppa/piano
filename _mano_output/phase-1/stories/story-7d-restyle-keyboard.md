### STORY-7d: Restyle keyboard and scale band

#### What and why
The keyboard is the hero element and the primary teaching surface. Its key styles, root/chord-tone/scale-note markers, and the scale band above it must carry the Ivory & Ink palette, keep the non-colour cues from the original phase, and survive on small screens.

#### Done when
- [ ] White keys use the key-white token, black keys use key-black at the design's height ratio, with a single outline rule across the band; band background and borders use the surface/outline tokens.
- [ ] Root key is marked with a gold diamond + a double border (non-colour cue); chord-tone keys show a dot marker; scale-note keys show a ring + dashed border — all distinguishable without colour.
- [ ] Pressed/active keys show the design's pressed tint with an inset shadow.
- [ ] The band scrolls horizontally on small screens with no layout break; label styling follows the design tokens.
- [ ] Test: root/chord-tone/scale-note states render their distinct marker and border cues.

#### Not this story
- Restyling the header/controls (story-7c).
- Restyling playback bar and variation panel (story-7e).
- Changing keyboard interaction semantics (pointer/keydown handling stays as implemented and tested in the original phase).

#### Notes
Depends on: story-7a (tokens). Keyboard visual behaviour (markers, cues, active state) was implemented in the original phase; this story re-skins it to the design tokens and polish only — do not rewrite the interaction logic.

#### Implementation Reference
- **Build:** update `src/components/Keyboard.tsx` + `Keyboard.css`; verify with the existing keyboard tests plus a small visual-state test
- **Design:** `design-brief.md §Piano Keyboard (hero)` — key colours, gold marker with stroke (AA-verified pairing), pressed tint, band rules
- **Rules:** `project-rules.md §Accessibility` (non-colour markers), `§Patterns — Audio` (no audio changes)
- **Do not:** inline hex in CSS; remove non-colour cues; change key geometry beyond the design ratios; literal `font-family` in label CSS (use `var(--font-*)` from story-7a)
