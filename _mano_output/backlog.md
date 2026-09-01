# Backlog

## Core Product Principles

- Core principle: select something and immediately see and hear the musical result.
- A personal reference and practice tool — quicker and less intimidating than a songwriting workstation.
- Explain enough music theory to help the user make a choice without requiring theory first.
- Teach primarily through audible comparison: select a technique, replay the same material, hear what changed.
- Playback is part of the core experience, not a separate utility.
- Genre is guidance, never an objective claim about favourite chords.
- A useful default is always visible on first load — the screen is never empty and no configuration is required before value is demonstrated.
- Colour is never the only indicator; playback and musical states need non-colour text or motion indicators.
- Offline-first, single user, local data; no accounts, no cloud sync.
- Musical concepts stay distinct: key/mode, chord, variation, voicing, inversion, genre, performance.

## Items

### Root-note selection across C to B including accidentals
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Explore screen musical-context selector. Must cover all 12 chromatic roots (C through B, including accidentals).
- **Status:** resolved

### Chord-quality selection and supported-quality catalogue
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Explore screen musical-context selector for chord quality.
  Start with the common set as clarified: major, minor, diminished, augmented, sus2, sus4, 6, 7, maj7, m7, 9, add9.
  Covers the variation examples A6, A7, Amaj7, A9, Asus2, Asus4, Aadd9 in section 6.3.
- **Status:** resolved

### Genre selection with a single curated genre list
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Explore screen musical-context selector; optional.
  Single curated list (not a union of separate lists), as clarified: pop, rock, blues, jazz, funk, classical, ballad.
  Genre is a discovery filter, never a strict theory rule.
- **Status:** backlog

### Key or mode as an optional advanced control
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Tonal context and available scale notes.
  Advanced control, since common choices should be immediately visible and less common modes hidden behind Advanced.
- **Status:** resolved

### Progression context mode: 'In the key of [root]' default, or 'Include this chord anywhere'
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Explore screen musical-context selector.
  'In the key of [root]' is the default determination of which progressions are shown.
- **Status:** backlog

### Advanced control behind less common chord qualities and modes
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Common choices immediately visible; less common chord qualities and modes live behind an Advanced control on Explore.
- **Status:** backlog

### Piano keyboard visualisation with layered highlighting
- **Type:** feature
- **Source:** piano.md
- **Context:**
  The keyboard is the visual focus of Explore. Strong highlight for chord tones, subtle highlight for other scale notes, distinct root-note marker, distinct bass-note marker for inversions.
  Optional note names and optional scale degrees; Chord, Scale and Both display modes; selectable octave range without making keys too small on mobile.
  Also visualises chord notes, formula and scale relationship (section 2).
- **Status:** resolved

### Scale shown for a selection, defaulting to the chord-root scale with an override
- **Type:** feature
- **Source:** piano.md
- **Context:**
  As clarified: display the scale of the selected chord by default, but offer the user a choice to follow the key's scale instead.
  Section 3 example: selecting A major + Pop immediately shows the A major chord, the A major scale, relevant variations and common pop progressions in A.
- **Status:** resolved

### Playable keyboard with immediate single-note playback and polyphony
- **Type:** feature
- **Source:** piano.md
- **Context:**
  The on-screen piano keyboard must be playable, not visualisation-only. Pressing/tapping an individual key plays that note immediately.
  When the input method supports simultaneous presses, multiple held keys sound together polyphonically.
- **Status:** resolved

### Play chord / arpeggiate and play scale ascending and descending actions
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Explore screen playback actions: play the full chord, arpeggiate the chord, play the scale ascending and descending.
- **Status:** resolved

### Useful default selection visible on first load
- **Type:** feature
- **Source:** piano.md
- **Context:**
  A useful default such as C major should be visible on first load so the screen is never empty.
  No configuration required before the product demonstrates its value (section 4).
- **Status:** resolved

### Immediate see-and-hear response to any selection
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Core product principle: select something and immediately see and hear the musical result.
  Selecting A major + Pop shows the chord, scale, variations and relevant progressions without further steps.
- **Status:** resolved

### Chord variation panel with genre-relevance guidance
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Show contextually useful variations of the selected root (e.g. A6, A7, Amaj7, A9, Asus2, Asus4, Aadd9).
  Genre relevance presented as guidance labels such as 'Common in Blues' or 'Popular Jazz variations', never implying a genre objectively prefers chords.
  Selecting a variation updates keyboard, notation and playback immediately.
- **Status:** resolved

### Chord inversions with playback for every valid inversion
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Root position, first, second, third when the chord has four distinct tones, further when five or more.
  Each shows ordered notes bass to treble, matching keys, bass note with distinct marker, slash-chord notation (A/C♯, A/E), inversion name and a playback action.
  Changing inversion updates the existing keyboard rather than opening a separate screen.
- **Status:** backlog

### Open voicings and left/right-hand arrangements as a separate concept
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Distinct from inversions: describes note distribution (close, open, left/right-hand) rather than only the bass note.
  Open and genre-specific voicings are within the product capability scope (section 11).
- **Status:** backlog

### Playing style and performance controls over the current selection
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Five technique groups each with listed concepts (section 6.5): articulation (normal, legato, staccato, tenuto), rhythmic feel (straight, syncopated, swing, shuffle), chord texture (block chord, arpeggio, broken chord), expression (even, dynamics, accents, humanised timing, rubato), piano pattern (sustain pedal, octaves, Alberti bass, stride).
  Presented as independent controls; genre may suggest a preset but techniques are never inseparable from genre. Changing a technique updates playback immediately without changing the chord, inversion, scale or progression.
- **Status:** backlog

### Rubato with a clear compatibility rule
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Full rubato for solo chord, scale and progression playback. When a strict metronome or backing track is active, rubato is unavailable or becomes a subtle timing-humanisation so layers stay synchronised.
  The interface must explain why the behaviour changes.
- **Status:** backlog

### Plain-language technique explanations and audible comparison
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Technique names include a short plain-language explanation; the product teaches primarily through audible comparison (select, replay, hear the difference).
  Technique controls must not rely on specialist terminology alone.
- **Status:** backlog

### Common progressions with a curated starter set
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Starter set as clarified: I–IV–V, I–vi–IV–V, ii–V–I, blues I7–IV7–V7, plus other common patterns (e.g. the section 6.6 example I–V–vi–IV).
  Each card shows a descriptive/genre label, Roman-numeral pattern, actual chords in the selected key, where the selected chord appears, play/stop, loop, favourite and current-chord highlight during playback.
- **Status:** backlog

### Progression transpose preserving Roman-numeral relationships
- **Type:** feature
- **Source:** piano.md
- **Context:**
  The user can transpose a progression to another key while preserving its Roman-numeral relationship.
- **Status:** backlog

### Chord playback matching the exact displayed selection
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Playback is part of the core experience, not a separate utility.
  Chord playback must sound the exact variation, inversion and voicing currently displayed on the keyboard.
- **Status:** backlog

### Progression playback with highlight, stepping and tempo control
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Play and loop a progression; move through progression chords manually; highlight the current chord and keyboard notes during playback; change tempo without leaving Explore; apply and compare the selected playing-style controls.
- **Status:** backlog

### Persistent playback controls across screens
- **Type:** feature
- **Source:** piano.md
- **Context:**
  A persistent player remains available while using other screens; it hosts progression playback and a compact metronome (section 5).
- **Status:** backlog

### Genre-aware progression backing track
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Driven by the already-selected musical context: progression sets chords and change timing, genre a curated rhythmic and instrumental style, tempo the shared BPM, time signature the beat structure and bar boundaries.
  Must play/stop/loop from persistent controls; stay synchronised with progression highlighting, keyboard visualisation and the metronome; change chords on clear beat/bar boundaries; provide independent volume/mute for drums, bass and guide chords; allow the guide-chord layer to be disabled; apply selected rhythmic feel and compatible performance settings without losing synchronisation.
  At least one lightweight, recognisable accompaniment preset per genre; more presets may come in later phases. Also must keep working offline after installation.
- **Status:** backlog

### Metronome with full view and compact persistent variant
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Full metronome view for practice, plus a compact version in the persistent player.
  BPM input and increment/decrement, tap tempo, start/stop, visible beat indicator, accent on the first beat, 4/4, 3/4 and 6/8 time signatures, volume control.
  Operates both independently and in sync with progression playback.
- **Status:** backlog

### Favourites for chords, voicings, scales and progressions
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Users can favourite chords, specific inversions and voicings, scales, and progressions.
  A saved chord favourite must preserve the selected inversion and voicing.
  A saved progression preserves its key, genre, Roman-numeral pattern, chords, tempo, time signature, selected voicings, playing-style settings, backing-track style and layer settings.
- **Status:** backlog

### Favourites screen with filters
- **Type:** feature
- **Source:** piano.md
- **Context:**
  A saved collection with filters for chords, voicings, scales, progressions, genre and key.
- **Status:** backlog

### Local data storage, offline-first, single user
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Stated operating mode: offline-first, single user, local data on a responsive browser application.
  Data is stored locally. Remain useful without an account or internet connection after installation.
  Non-goals (section 13): user accounts or cloud synchronisation.
- **Status:** backlog

### Settings screen for display, notation, playback and accessibility
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Settings covers display, notation, playback, accessibility and local backup preferences.
- **Status:** backlog

### Backup export and import from local data
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Settings must provide export backup and import backup of the locally stored data.
- **Status:** backlog

### Responsive navigation: bottom nav on mobile, side nav on desktop
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Explore, Favourites, Metronome and Settings use bottom navigation on mobile and persistent side navigation on desktop.
- **Status:** backlog

### Keyboard-accessible controls with visible focus states
- **Type:** feature
- **Source:** piano.md
- **Context:**
  All controls must be keyboard accessible and focus states must remain clearly visible (section 10).
- **Status:** backlog

### Non-colour distinction for musical states
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Colour cannot be the only way chord tones, scale notes, root and bass are distinguished.
  Playback state and the current progression chord must have non-colour indicators.
  Playback differences such as articulation and rhythmic feel need a visible text state as well as an audible result.
- **Status:** resolved

### Reduced-motion support
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Reduced-motion preferences must be respected (section 10).
- **Status:** backlog

### Piano usability on small screens
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Piano keys on small screens remain usable through horizontal scrolling or octave controls without keys becoming too small.
- **Status:** backlog

### Accessible audio controls with names and state announcements
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Audio controls need accessible names and state announcements (section 10).
- **Status:** backlog

### Harmony helper: explain the current chord
- **Type:** feature
- **Source:** piano.md
- **Context:**
  For a chord: its function in the selected key (tonic, predominant, dominant), chord tones and scale degrees, whether it is diatonic to the current key, and a short plain-language description of its musical character and typical use.
- **Status:** backlog

### Harmony helper: explain a progression movement
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Why the chord movement works, where tension increases and resolves, shared tones between adjacent chords, and any borrowed or non-diatonic chords with a concise explanation.
- **Status:** backlog

### Harmony helper: musically grounded next-chord suggestions
- **Type:** feature
- **Source:** piano.md
- **Context:**
  A small number of suggestions grouped by intent: Resolve (move toward stability), Build tension (delay resolution), Add colour (variation, extension or borrowed chord).
  Every suggestion includes a short reason, can be previewed without changing the progression, and is only applied after an explicit user action.
- **Status:** backlog

### Harmony helper: improve piano movement with better inversions
- **Type:** feature
- **Source:** piano.md
- **Context:**
  When moving between chords, may suggest an inversion that reduces hand movement, previewing before/after keyboard positions and explaining the shared notes or shorter movement.
- **Status:** backlog

### Harmony helper capability boundary
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Uses curated music-theory rules and deterministic suggestions that work offline. Out of scope: open-ended AI chat, automatically generating complete songs, melody generation, arrangement or production tools, and claims that one harmonic choice is objectively correct.
- **Status:** backlog

### Major and natural-minor scale support
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Base scale set in the capability scope: major and natural-minor scales (section 11).
- **Status:** resolved

### Musical model keeps core concepts distinct
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Interface and internal data keep separate: key/mode, chord (root plus quality), chord variation, voicing (how tones are distributed), inversion (which tone is the bass note), genre (discovery filter) and performance (how notes are played). See the section 3 table.
- **Status:** resolved

### Practice mode
- **Type:** feature
- **Source:** piano.md
- **Context:**
  Goal: support focused practice with persistent playback, simple backing tracks and metronome controls.
  Son practice mode is named in the capability scope (section 11) but otherwise undescribed; scoped as a future capability.
- **Status:** backlog

### Recently viewed history
- **Type:** feature
- **Source:** piano.md
- **Context:**
  In the product capability scope (section 11); future capability, no behaviour specified yet.
- **Status:** backlog

### Shareable URL state
- **Type:** feature
- **Source:** piano.md
- **Context:**
  In the product capability scope (section 11); future capability, no behaviour specified yet.
- **Status:** backlog

### Additional scales, modes, chord qualities and genres
- **Type:** feature
- **Source:** piano.md
- **Context:**
  In the product capability scope (section 11); future expansion over the base catalogue.
- **Status:** backlog

### MIDI input and chord detection
- **Type:** feature
- **Source:** piano.md
- **Context:**
  In the product capability scope (section 11); future capability.
- **Status:** backlog

### Fingering recommendations
- **Type:** feature
- **Source:** piano.md
- **Context:**
  In the product capability scope (section 11); future capability.
- **Status:** backlog

### Automatic tempo increase and count-in
- **Type:** feature
- **Source:** piano.md
- **Context:**
  In the product capability scope (section 11); future capability for practice pacing.
- **Status:** backlog

### Additional backing-track styles, fills and accompaniment patterns
- **Type:** feature
- **Source:** piano.md
- **Context:**
  In the product capability scope (section 11) and section 7.1 ('Additional presets may be introduced in later Mano phases').
- **Status:** backlog

### Chord-root marker is not distinguishable enough on the keyboard
- **Type:** bug
- **Source:** phase-1 review
- **Context:**
  The dot/diamond root marker on the keyboard is too subtle to spot at a glance; the selected chord's root needs a stronger, more visible cue so the user can immediately identify what they are studying.
- **Status:** resolved

### Make the selected chord the prominent screen title
- **Type:** refinement
- **Source:** phase-1 review
- **Context:**
  Replace the small subtitle under 'Piano Chord Explorer' with a prominent selected-chord heading using the full readable name (e.g. 'A diminished'). The short symbol (Adim) can remain in controls and chord-type tiles.
- **Status:** resolved

### Prioritise root note and chord quality controls over display preferences
- **Type:** refinement
- **Source:** phase-1 review
- **Context:**
  Root note and chord quality define what the user is studying and should be the dominant control pair, placed together at the top of the control area. Demote scale-follow, view mode, range, note names, and genre to secondary display/context controls with less visual weight.
- **Status:** resolved

### Reduce the form-like feeling of the Musical Context area
- **Type:** refinement
- **Source:** phase-1 review
- **Context:**
  Avoid one large bordered card with many stacked labels and controls. Use a lighter control area, short labels, fewer borders, and spacing/grouping to establish hierarchy so the interface feels like an instrument-learning workspace rather than an admin form.
- **Status:** resolved

### Place the keyboard directly after the root and quality controls
- **Type:** refinement
- **Source:** phase-1 review
- **Context:**
  The selected chord should visibly cause the highlighted keyboard state without a large block of settings separating selection from the result.
- **Status:** resolved

### Keep playback attached beneath the keyboard with Play chord as the primary action
- **Type:** refinement
- **Source:** phase-1 review
- **Context:**
  Keep [Play chord] [Arpeggiate] [Play scale] directly beneath the keyboard. Make Play chord the primary action and Arpeggiate/Play scale secondary.
- **Status:** resolved

### Rename the variations section to 'Explore [root] chord types'
- **Type:** refinement
- **Source:** phase-1 review
- **Context:**
  A, Am, Adim, A7, Amaj7 are not variations of Adim — they are different chord qualities sharing the root. The wording 'Explore A chord types' gives learners the correct mental model.
- **Status:** resolved

### Group related chord types with the chord name visually dominant
- **Type:** refinement
- **Source:** phase-1 review
- **Context:**
  Group the same chord items into Core (A, Am, Adim, Aaug), Colour (Asus2, Asus4, A6, Aadd9), and Sevenths & extensions (A7, Amaj7, Am7, A9). Descriptions can remain but the chord name should be visually dominant.
- **Status:** resolved

### Replace the long single-column variation list with compact selectable tiles or a responsive grid
- **Type:** refinement
- **Source:** phase-1 review
- **Context:**
  Each tile shows the chord symbol prominently, the short explanatory label more quietly, a clear selected state, and updates the title and keyboard immediately when pressed, so comparison is quicker and scrolling fatigue is reduced.
- **Status:** resolved

### Do not add product navigation yet
- **Type:** refinement
- **Source:** phase-1 review
- **Context:**
  Do not add a permanent sidebar for Explore, Favourites and Metronome until those are functional destinations. It would consume space and make the tool feel more complex without improving the chord-learning task.
- **Status:** backlog

### Audit and fix incorrect chord scales
- **Type:** bug
- **Source:** phase-2 review
- **Context:**
  C augmented shows C, D, E, F, G, G#, A, B on the keyboard instead of the correct C, D♯, E, G, G♯, B. This is the one confirmed instance, spotted during phase-2 review; other chord/scale pairings should be audited for the same kind of error, not just this one.
- **Status:** in-phase-3

### Make scale notes easier to see on the keyboard
- **Type:** refinement
- **Source:** phase-2 review
- **Context:**
  Scale-tone markers on the keyboard are hard to distinguish at a glance, separate from the (confirmed working) root-note cue.
- **Status:** in-phase-3

### Revisit overall Explore screen UI clarity
- **Type:** refinement
- **Source:** phase-2 review
- **Context:**
  The single-page chord-first layout works, but the overall UI still feels a bit confusing. Flagged for a later rethink rather than this phase.
- **Status:** backlog

### Show chord and scale notes beneath the keyboard
- **Type:** feature
- **Source:** phase-2 review
- **Context:**
  Add a panel underneath the keyboard listing the chord's notes and, when view mode allows, its scale's notes -- easier to reference than reading the keyboard markers alone.
- **Status:** in-phase-3

### Place keyboard directly under the root-note selector
- **Type:** refinement
- **Source:** phase-2 review
- **Context:**
  Consider positioning the keyboard directly beneath the root-note selector rather than after the full root+quality control block, to make the chord root even clearer. Raised while confirming the chord-first layout decision during phase-2 review.
- **Status:** in-phase-3
