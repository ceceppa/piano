### STORY-0: App bootstrap

#### What and why
A beginner launches the Explore tool for the first time and expects a page to load in the browser without accounts, setup, or an internet connection. This story gives the project a runnable React shell plus the chosen tooling so every later story can be verified by running the app.

#### Done when
- Running `npm run dev` opens the app at the project root in a browser.
- The page shows the app title and an Explore area with a "C major" default selection label; no configuration is required first.
- Loading the page makes no requests to external hosts.
- Running `npm run lint` reports no errors.
- Running `npm test` passes (Vitest runs a minimal passing test suite).

#### Not this story
- Piano keyboard, selectors, audio, or any musical behaviour.
- Favourites, settings, metronome, progressions.

#### Notes
Bootstrap must use the tech-spec's guarded scaffold command — a raw generator aimed at the project root is forbidden. Install commands run exactly in their own groups as listed in the tech spec.

#### Implementation Reference
- **Build:** app shell component under `src/` per `_mano_output/project-rules.md §Folder Structure`
- **Commands:**
  ```bash
  node _mano/scripts/scaffold.js run --name piano-chord-explorer -- npm create vite@latest {target} -- --template react-ts
  npm install
  npm install zustand@latest
  npm install -D vitest@latest jsdom@latest
  npm install -D oxlint@latest
  ```
  Scaffold + install exactly per `_mano_output/tech-spec.md §Project Scaffold` and `§Libraries & dependencies`
- **Rules:** Architecture — no network calls at runtime (`project-rules.md §Architecture`); Testing — wire lint/test commands (`project-rules.md §Testing`)
- **Do not:** run the raw generator at `.` / the project root; write any music-core or audio code in this story; move or hide `_mano`, `_mano_output`, `.git`, `AGENTS.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->