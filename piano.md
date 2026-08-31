# Piano Chord Explorer — Product Specification

**Status:** Initial product definition  
**Platform:** Responsive browser application  
**Initial operating mode:** Offline-first, single user, local data  
**Working title:** Piano Chord Explorer

## 1. Product purpose

Piano Chord Explorer is a personal reference and practice tool for discovering piano chords, understanding how they relate to a key, and hearing them in useful progressions.

The core product principle is:

> Select something and immediately see and hear the musical result.

The product should feel quicker and less intimidating than a songwriting workstation. It should explain enough music theory to help the user make a choice, without requiring them to understand theory before they can use it.

## 2. Product goals

- Visualise a selected chord, its notes, formula, scale relationship, voicings and inversions on a piano keyboard.
- Surface common chord progressions in a selected key and genre.
- Let the user hear chords, scales and complete progressions immediately.
- Let the user hear how articulation, rhythm, expression and piano patterns change the same musical material.
- Support focused practice with persistent playback, simple backing tracks and metronome controls.
- Let the user save useful chords, voicings, scales and progressions locally.
- Remain useful without an account or internet connection after installation.

## 3. Musical model

The interface and internal data must keep these concepts separate:

| Concept | Example | Meaning |
|---|---|---|
| Key or mode | A major | Tonal context and available scale notes |
| Chord | A major | Root plus chord quality |
| Chord variation | A6, A7, Amaj7, Asus4 | A different chord built from the same root |
| Voicing | Close, open, left/right-hand | How chord tones are distributed across the keyboard |
| Inversion | A, A/C♯, A/E | Which chord tone is used as the bass note |
| Genre | Pop, rock, blues, jazz | A discovery filter, not a strict theory rule |
| Performance | Legato, swing, arpeggio, rubato | How the selected notes or progression are played |

Selecting **A major + Pop**, for example, should immediately show the A major chord, the A major scale, relevant variations and common pop progressions in A.

## 4. Primary user flow

1. Select a root note.
2. Select a chord quality.
3. Optionally select a genre and key or mode.
4. See and hear the chord on the keyboard.
5. Explore variations, inversions and relevant progressions.
6. Optionally change how the selection is performed.
7. Play, compare or favourite an item.

A useful default such as C major should be visible on first load so the screen is never empty and no configuration is required before the product demonstrates its value.

## 5. Information architecture

### Explore

The main workspace for chord selection, keyboard visualisation, variations, inversions and progressions.

### Favourites

A saved collection with filters for chords, voicings, scales, progressions, genre and key.

### Metronome

A full metronome view for practice. A compact version remains available in the persistent player while using other screens.

### Settings

Display, notation, playback, accessibility and local backup preferences.

On mobile, these areas use bottom navigation. On desktop, they use persistent side navigation.

## 6. Explore screen requirements

### 6.1 Musical context selectors

- Root note: C through B, including accidentals.
- Chord quality: major, minor and other supported qualities.
- Genre: optional.
- Key or mode: optional advanced control.
- Progression context:
  - **In the key of [root]** — default.
  - **Include this chord anywhere**.

Common choices should be immediately visible. Less common chord qualities and modes should live behind an Advanced control.

### 6.2 Keyboard visualisation

The piano keyboard is the visual focus of the Explore screen.

- Strong highlight for chord tones.
- Subtle highlight for other notes in the selected scale.
- Distinct root-note marker.
- Distinct bass-note marker when showing an inversion.
- Optional note names.
- Optional scale degrees.
- Chord, Scale and Both display modes.
- Selectable octave range without making keys too small on mobile.
- The on-screen piano keyboard must be playable, not visualisation-only.
- Pressing or tapping an individual piano key must immediately play that note.
- When the input method supports simultaneous presses, multiple held piano keys must sound together polyphonically.
- Play chord and Arpeggiate actions.
- Play scale ascending and descending.

### 6.3 Chord variations

Show contextually useful variations of the selected root, such as:

- A6
- A7
- Amaj7
- A9
- Asus2
- Asus4
- Aadd9

Genre relevance must be presented as guidance, using labels such as **Common in Blues** or **Popular Jazz variations**, rather than implying that a genre has objectively favourite chords.

Selecting a variation updates the keyboard, notation and playback immediately.

### 6.4 Chord inversions

The user must be able to see and hear every standard inversion supported by the selected chord:

- Root position.
- First inversion.
- Second inversion.
- Third inversion when the chord contains four distinct chord tones.
- Further inversions when an extended chord contains five or more distinct chord tones.

For each inversion, the interface must show:

- The ordered notes from bass to treble.
- The corresponding keys on the piano.
- The bass note with a distinct visual marker.
- Standard slash-chord notation where applicable, for example `A/C♯` and `A/E`.
- The inversion name, such as **First inversion**.
- A playback action.

Changing inversion updates the existing keyboard rather than opening a separate screen. A saved chord favourite must preserve the selected inversion and voicing.

Open voicings and left/right-hand arrangements remain separate from inversions because they describe note distribution rather than only the bass note.

### 6.5 Playing style and piano techniques

The user must be able to hear how a technique changes the current chord, scale or progression. Performance controls should affect the existing musical selection rather than require a separate lesson or course screen.

Techniques are grouped by what they change:

| Category | Supported concepts | Playback effect |
|---|---|---|
| Articulation | Normal, legato, staccato, tenuto | Changes note duration, separation and overlap |
| Rhythmic feel | Straight, syncopated, swing, shuffle | Changes event placement and rhythmic emphasis |
| Chord texture | Block chord, arpeggio, broken chord | Changes how chord tones are distributed over time |
| Expression | Even, dynamics, accents, humanised timing, rubato | Changes velocity, emphasis and timing |
| Piano pattern | Sustain pedal, octaves, Alberti bass, stride | Changes how the harmony is physically or stylistically performed |

The interface should present these as independent controls under **Playing Style** or **Performance**. Genre may provide a useful preset, but must not make the techniques inseparable from the genre. For example:

- Pop may suggest straight rhythm with sustained chords.
- Blues may suggest shuffle with an accented backbeat.
- Jazz may suggest swing with legato chord voicings.
- Funk may suggest syncopation with short articulation.
- Classical may suggest even timing with optional arpeggiation.
- Ballad may suggest legato, sustain and light humanisation.

The user can override any suggested setting and compare the same musical material with different techniques. Changing a technique must update playback immediately without changing the underlying chord, inversion, scale or progression.

Rubato needs a clear compatibility rule. Full rubato is available for solo chord, scale and progression playback. When the strict metronome or backing track is active, rubato is unavailable or becomes a subtle timing-humanisation setting so all layers remain synchronised. The interface must explain why the behaviour changes.

Technique names should include a short plain-language explanation. The product should teach primarily through audible comparison: the user selects a technique, replays the same material and hears what changed.

### 6.6 Common progressions

Each progression card must show:

- A descriptive or genre label.
- Roman-numeral pattern.
- Actual chords in the selected key.
- Where the selected chord appears.
- Play/stop.
- Loop.
- Favourite.
- Current-chord highlight during playback.

Example:

> **Pop progression**  
> I – V – vi – IV  
> A – E – F♯m – D

The user can transpose a progression to another key while preserving its Roman-numeral relationship.

## 7. Playback and metronome

Playback is part of the core experience, not a separate utility.

- Play an individual chord.
- Chord playback must sound the exact variation, inversion and voicing currently displayed on the keyboard.
- Play individual notes directly by pressing or tapping the corresponding on-screen piano keys.
- Arpeggiate a chord.
- Play a scale ascending and descending.
- Play and loop a progression.
- Move through progression chords manually.
- Highlight the current chord and keyboard notes during playback.
- Change tempo without leaving Explore.
- Apply and compare the selected playing-style controls.

### 7.1 Progression backing track

The user can optionally play the selected progression as a simple backing track for practice. It must be driven by the same musical context already selected elsewhere in the interface:

- The progression determines the chords and when they change.
- The genre determines a curated rhythmic and instrumental style.
- The tempo determines the shared BPM.
- The time signature determines the beat structure and bar boundaries.

The backing track must:

- Play, stop and loop from the persistent playback controls.
- Stay synchronised with progression highlighting, keyboard visualisation and the metronome.
- Change chords on clear beat or bar boundaries.
- Provide independent volume or mute controls for its core layers: drums, bass and guide chords.
- Allow the guide-chord layer to be disabled so the user can play the harmony themselves.
- Continue to work offline after the application is installed.
- Use the selected rhythmic feel and compatible performance settings without losing transport synchronisation.

Each supported genre should have at least one lightweight, recognisable accompaniment preset. Additional presets may be introduced in later Mano phases. The product does not need a pattern editor, recording or audio export.

The metronome must support:

- BPM input and increment/decrement controls.
- Tap tempo.
- Start/stop.
- Visible beat indicator.
- Accent on the first beat.
- 4/4, 3/4 and 6/8 time signatures.
- Volume control.
- Operation both independently and in sync with progression playback.

## 8. Favourites and local data

The user can favourite:

- Chords.
- Specific inversions and voicings.
- Scales.
- Progressions.

A saved progression preserves its key, genre, Roman-numeral pattern, chords, tempo, time signature, selected voicings, playing-style settings, backing-track style and layer settings.

Data is stored locally. Settings must provide:

- Export backup.
- Import backup.

## 9. Chord and harmony helper

The harmony helper is a contextual guide attached to the current chord or progression. It should help the user understand and explore harmony, not become a general-purpose chatbot or full songwriting application.

### 9.1 Explain the current selection

For a chord, show:

- Its function in the selected key, such as tonic, predominant or dominant.
- Its chord tones and scale degrees.
- Whether it is diatonic to the current key.
- A short plain-language description of its musical character and typical use.

For a progression, show:

- Why the chord movement works.
- Where tension increases and resolves.
- Shared tones between adjacent chords.
- Any borrowed or non-diatonic chords, with a concise explanation.

### 9.2 Suggest what could come next

Offer a small number of musically grounded next-chord suggestions grouped by intent, for example:

- **Resolve** — move toward stability.
- **Build tension** — delay resolution.
- **Add colour** — use a variation, extension or borrowed chord.

Every suggestion must include a short reason, can be previewed without changing the progression, and is only applied after an explicit user action.

### 9.3 Improve piano movement

When moving between chords, the helper may suggest an inversion that reduces hand movement. It should preview the before/after keyboard positions and explain the shared notes or shorter movement. This connects inversion learning to a practical use rather than presenting inversions as isolated facts.

### 9.4 Capability boundary

The helper should use curated music-theory rules and deterministic suggestions that work offline. The following remain outside the product scope:

- Open-ended AI chat.
- Automatically generating complete songs.
- Melody generation.
- Arrangement or production tools.
- Claims that one harmonic choice is objectively correct.

## 10. Responsive and accessibility requirements

- All controls must be keyboard accessible.
- Focus states must remain clearly visible.
- Colour cannot be the only way chord tones, scale notes, root and bass are distinguished.
- Playback state and the current progression chord must have non-colour indicators.
- Reduced-motion preferences must be respected.
- Piano keys on small screens must remain usable through horizontal scrolling or octave controls.
- Audio controls need accessible names and state announcements.
- Technique controls must not rely on specialist terminology alone; each option needs a concise explanation of what the user will hear.
- Playback differences such as articulation and rhythmic feel need a visible text state as well as an audible result.

## 11. Product capability scope

This specification describes the intended product, not a commitment to implement every capability in one release. The product may include:

- Root and chord-quality selection.
- Major and natural-minor scales.
- A small curated set of genres.
- Common progressions displayed as Roman numerals and chord names.
- Interactive, playable keyboard visualisation with individual-note and polyphonic playback.
- Chord variations.
- Root position and all valid chord inversions.
- Chord, scale and progression playback.
- Playing-style controls covering articulation, rhythmic feel, chord texture, expression and piano patterns.
- Simple genre-aware backing tracks that follow the selected progression, tempo and time signature.
- Basic persistent metronome.
- Local favourites.
- Import/export backup.
- Responsive offline-first web application.
- Chord and harmony helper.
- Open and genre-specific voicings.
- Practice mode.
- Recently viewed history.
- Shareable URL state.
- More scales, modes, chord qualities and genres.
- MIDI input and chord detection.
- Fingering recommendations.
- Automatic tempo increases and count-in.
- Additional backing-track styles, fills and accompaniment patterns.

## 12. Mano delivery strategy

Mano controls delivery scope one phase at a time. This product specification can retain the complete desired capability set without implying that all of it should be designed or built immediately.

For each phase:

- Only the capability explicitly approved in the active Mano phase brief is implementation scope.
- Capabilities outside the active phase remain product context, not implicit requirements.
- A future capability should influence the current architecture only when the phase brief identifies a concrete constraint that must be protected now.
- Each phase should produce a usable vertical slice that can be seen, heard and evaluated in the browser.
- The phase review should validate the musical behaviour and user experience before the backlog or next phase is chosen.
- Discoveries may refine this specification and the backlog; the implementation does not need to anticipate every future feature.

The product specification defines **what Piano may become**. The approved phase brief defines **what Piano becomes next**.

## 13. Product non-goals

- User accounts or cloud synchronisation.
- Recording.
- Full songwriting or DAW functionality.
- AI-generated progressions.
- Complex accompaniment engines or pattern editors.
- Large genre-style libraries.

## 14. Comparable products and positioning

Existing products validate parts of the idea:

| Product | Strong overlap | Difference from this product direction |
|---|---|---|
| muted.io | Piano chord and scale visualisation, arpeggiation and common progressions | Capabilities are spread across reference tools; the proposed product unifies exploration, inversions, favourites and guided practice |
| Hookpad | Harmony suggestions, harmonic function, popular chords and songwriting guidance | A broader composition environment; the proposed product remains a focused piano learning and practice workspace |
| ChordChord | Progression creation, immediate playback and export | Primarily a songwriting generator rather than a visual piano reference and inversion-learning tool |
| Musicca Chord Player | Progressions, tempo, styles and backing tracks | Focuses on building backing tracks rather than explaining chord-scale relationships and inversions |
| OneMotion Chord Player | Progressions, chord extensions, voicings, playback and export | More production-oriented and control-dense than the intended calm, beginner-readable experience |

The product is not novel because each individual capability is new. Its distinction is the combination and workflow: choose a musical idea, see it clearly on piano, hear it, understand the relationship, practise it, and save it without entering a full composition environment.

### Research references

- [muted.io Piano Chords](https://muted.io/piano-chords/)
- [muted.io Common Chord Progressions](https://muted.io/chord-progressions/)
- [Hookpad](https://www.hooktheory.com/hookpad)
- [ChordChord](https://chordchord.com/)
- [Musicca Chord Player](https://www.musicca.com/chord-player)
- [OneMotion Chord Player](https://www.onemotion.com/chord-player/)
