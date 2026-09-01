import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { useSelectionStore } from './store/useSelectionStore'

vi.mock('./audioEngine', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./audioEngine')>()
  return {
    ...actual,
    init: vi.fn(() => Promise.resolve()),
    playChord: vi.fn(),
    setPlaybackListener: vi.fn(),
    noteOn: vi.fn(),
    noteOff: vi.fn(),
  }
})

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  useSelectionStore.setState({
    theme: 'light',
    selection: {
      root: 0,
      quality: 'major',
      scaleType: 'major',
      viewMode: 'both',
      inversion: 0,
      voicingType: 'close',
    },
    octaveStart: 48,
    octaveEnd: 71,
  })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  delete document.documentElement.dataset.theme
})

function renderApp() {
  act(() => {
    root.render(<App />)
  })
}

describe('App theme wiring', () => {
  it('applies the store theme to the document root on load', () => {
    renderApp()
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('switches the document root theme attribute and palette immediately when the store theme changes', () => {
    renderApp()
    act(() => {
      useSelectionStore.getState().setTheme('dark')
    })
    expect(document.documentElement.dataset.theme).toBe('dark')
    act(() => {
      useSelectionStore.getState().setTheme('light')
    })
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('toggles the theme via the header ToggleSwitch control', () => {
    renderApp()
    const switchInput = container.querySelector<HTMLInputElement>(
      '.app-header input[type="checkbox"]',
    )
    expect(switchInput).not.toBeNull()
    act(() => {
      switchInput!.click()
    })
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(switchInput!.getAttribute('aria-checked')).toBe('true')
  })

  it('drops the chord-quality, key/mode, keyboard-range, and genre controls from Explore (S1d, E2a)', () => {
    renderApp()
    // Every one of the four removed controls was a dropdown or a disclosure.
    expect(container.querySelector('select')).toBeNull()
    expect(container.querySelector('details.advanced-control')).toBeNull()
    const groupLabels = [...container.querySelectorAll('[role="radiogroup"]')].map((g) =>
      g.getAttribute('aria-label'),
    )
    expect(groupLabels).not.toContain('Scale follows')
  })

  it('shows a mode-aware selection summary above the keyboard (S3a)', () => {
    renderApp()
    expect(container.querySelector('.selection-title')?.textContent).toBe('C with C major scale')
    act(() => {
      useSelectionStore.getState().setRoot(9) // A
      useSelectionStore.getState().setQuality('diminished')
    })
    expect(container.querySelector('.selection-title')?.textContent).toBe('Adim with A major scale')
  })

  it('puts view, root, and inversion in one uncarded primary row (S1a, S1b, S1c)', () => {
    renderApp()
    const primary = container.querySelector('.controls-primary')
    expect(primary).not.toBeNull()
    expect(primary?.querySelector('[role="radiogroup"][aria-label="Show on piano"]')).not.toBeNull()
    expect(primary?.querySelector('[role="radiogroup"][aria-label="Root note"]')).not.toBeNull()
    expect(primary?.querySelector('[role="radiogroup"][aria-label="Inversion"]')).not.toBeNull()
    // No large bordered form card around the control area, and no quieter tier.
    expect(primary?.closest('.card')).toBeNull()
    expect(container.querySelector('.controls-secondary')).toBeNull()
  })

  it('hides the inversion selector in Scale view and brings it back with the chord (S1c, E4b)', () => {
    renderApp()
    expect(container.querySelector('[role="radiogroup"][aria-label="Inversion"]')).not.toBeNull()
    act(() => useSelectionStore.getState().setViewMode('scale'))
    expect(container.querySelector('[role="radiogroup"][aria-label="Inversion"]')).toBeNull()
    act(() => useSelectionStore.getState().setViewMode('both'))
    expect(container.querySelector('[role="radiogroup"][aria-label="Inversion"]')).not.toBeNull()
  })

  it('puts the primary selection row above the keyboard, and playback below it', () => {
    renderApp()
    const main = container.querySelector('.explore')!
    const children = [...main.children]
    const idx = (cls: string) => children.findIndex((el) => el.classList.contains(cls))
    // design-brief §Screen Composition (phase-5): controls, summary, keyboard,
    // playback, Understand, then the Explore lists.
    expect(idx('controls-primary')).toBe(0)
    expect(idx('selection-summary')).toBe(1)
    expect(idx('keyboard-wrap')).toBe(2)
    expect(idx('playback-bar')).toBe(3)
    expect(idx('understand')).toBe(4)
    expect(idx('chord-explore')).toBe(5)
  })

  it('changing the root note updates the title, keyboard, scale, and related-chord section immediately', () => {
    renderApp()
    act(() => {
      useSelectionStore.getState().setRoot(9) // A
    })
    expect(container.querySelector('.selection-title')?.textContent).toBe('A with A major scale')
    expect(container.querySelector('[data-midi="57"]')?.getAttribute('data-state')).toBe('root') // A3
    expect(container.querySelector('.chord-explore-title')?.textContent).toBe('Explore A chord types')
    const tileSymbols = [...container.querySelectorAll('.chord-explore .explore-tile-title')].map(
      (el) => el.textContent,
    )
    expect(tileSymbols).toContain('A')
    expect(tileSymbols).not.toContain('C')
  })

  it('stacks both Explore lists below the piano in Both view, chord types first (S2c, E3b)', () => {
    renderApp()
    const main = container.querySelector('.explore')!
    const children = [...main.children]
    const keyboardIdx = children.findIndex((el) => el.classList.contains('keyboard-wrap'))
    const chordIdx = children.findIndex((el) => el.classList.contains('chord-explore'))
    const scaleIdx = children.findIndex((el) => el.classList.contains('scale-explore'))
    expect(chordIdx).toBeGreaterThan(keyboardIdx)
    expect(scaleIdx).toBe(chordIdx + 1)
  })

  it('changing an arrangement in Chord options updates the keyboard and playback (E5b)', async () => {
    const audioEngine = await import('./audioEngine')
    renderApp()
    act(() => useSelectionStore.getState().setViewMode('chord'))
    expect(container.querySelector('.hand-strip')).toBeNull()

    const trigger = [...container.querySelectorAll('button')].find(
      (b) => b.textContent === 'Chord options',
    )!
    act(() => trigger.click())
    act(() => {
      ;[...container.querySelectorAll<HTMLButtonElement>('[role="dialog"] [role="radio"]')]
        .find((o) => o.textContent === 'Left/Right hands')!
        .click()
    })

    // The keyboard picks up the hand grouping straight away.
    expect(container.querySelector('.hand-strip')).not.toBeNull()
    expect(container.querySelector('[data-hand="left"]')).not.toBeNull()

    // And the primary action plays that same arrangement.
    await act(async () => {
      ;[...container.querySelectorAll('button')].find((b) => b.textContent === 'Hear C')!.click()
    })
    expect(audioEngine.playChord).toHaveBeenCalledWith([36, 52, 55])
  })

  it('opens on a C major chord in Chord view with nothing empty (E1a)', () => {
    // No fixture: this is the state a first visit starts from, with nothing saved.
    act(() => useSelectionStore.setState(useSelectionStore.getInitialState()))
    renderApp()

    const viewSelected = [...container.querySelectorAll('[aria-label="Show on piano"] [role="radio"]')].find(
      (r) => r.getAttribute('aria-checked') === 'true',
    )
    expect(viewSelected?.textContent).toBe('Chord')
    expect(container.querySelector('.selection-title')?.textContent).toBe('C')

    // The default chord is already on the keyboard.
    const stateOf = (midi: number) =>
      container.querySelector<HTMLElement>(`[data-midi="${midi}"]`)!.dataset.state
    expect(stateOf(48)).toBe('root') // C3
    expect(stateOf(52)).toBe('chord-tone') // E3
    expect(stateOf(55)).toBe('chord-tone') // G3

    // And no region of the screen is empty.
    expect(container.querySelector('.understand .card-header')?.textContent).toBe('Understand C')
    expect(container.querySelector('.playback-primary')?.textContent).toBe('Hear C')
    expect(container.querySelectorAll('.chord-explore .explore-tile').length).toBeGreaterThan(0)
    expect(container.querySelector('.legend')).not.toBeNull()
  })

  it('keeps the chord, inversion, and scale across view switches (S5c, E2d)', () => {
    renderApp()
    act(() => {
      useSelectionStore.getState().setViewMode('chord')
      useSelectionStore.getState().setQuality('maj7')
      useSelectionStore.getState().setInversion(2)
    })
    act(() => useSelectionStore.getState().setViewMode('scale'))
    act(() => {
      ;[...container.querySelectorAll<HTMLElement>('.scale-explore .explore-tile')]
        .find((b) => b.querySelector('.explore-tile-title')?.textContent === 'Natural minor')!
        .click()
    })
    // Back in Chord view the chord and inversion chosen earlier are still there.
    act(() => useSelectionStore.getState().setViewMode('chord'))
    const selectedChord = [...container.querySelectorAll<HTMLElement>('.chord-explore .explore-tile')].find(
      (b) => b.getAttribute('aria-pressed') === 'true',
    )
    expect(selectedChord?.querySelector('.explore-tile-title')?.textContent).toBe('Cmaj7')
    const selectedInversion = [...container.querySelectorAll('[aria-label="Inversion"] [role="radio"]')].find(
      (r) => r.getAttribute('aria-checked') === 'true',
    )
    expect(selectedInversion?.textContent).toBe('2nd')
    // And the scale chosen in the meantime survived too.
    act(() => useSelectionStore.getState().setViewMode('scale'))
    const selectedScale = [...container.querySelectorAll<HTMLElement>('.scale-explore .explore-tile')].find(
      (b) => b.getAttribute('aria-pressed') === 'true',
    )
    expect(selectedScale?.querySelector('.explore-tile-title')?.textContent).toBe('Natural minor')
  })

  it('never falls back to a dropdown for root or inversion, at any width (S5a, E6a)', () => {
    renderApp()
    // There is one code path: no width-conditional branch can swap these for a
    // select, because the app renders no select at all.
    expect(container.querySelectorAll('select')).toHaveLength(0)
    expect(container.querySelectorAll('[aria-label="Root note"] [role="radio"]')).toHaveLength(12)
    expect(container.querySelectorAll('[aria-label="Inversion"] [role="radio"]').length).toBeGreaterThan(0)
  })

  it('renders every key of the window as its own tappable control (S5a, E6a)', () => {
    renderApp()
    const keys = [...container.querySelectorAll<HTMLElement>('[data-midi]')]
    // The fixed window is C3-B4 in this fixture; every semitone is present.
    expect(keys).toHaveLength(24)
    expect(keys.every((k) => k.tagName === 'BUTTON')).toBe(true)
  })

  it('puts the legend on the summary row and follows the view (S4b, E3a)', () => {
    renderApp()
    const summary = container.querySelector('.selection-summary')!
    expect(summary.querySelector('.legend')).not.toBeNull()
    expect([...summary.querySelectorAll('.legend-label')].map((el) => el.textContent)).toEqual([
      'Root',
      'Chord note',
      'Scale note',
      'Chord + scale',
    ])
    act(() => useSelectionStore.getState().setViewMode('scale'))
    expect([...container.querySelectorAll('.legend-label')].map((el) => el.textContent)).toEqual([
      'Root',
      'Scale note',
    ])
  })

  it('marks the chord and the scale together in Both view, telling a shared note apart by shape (E3a)', () => {
    renderApp()
    const stateOf = (midi: number) =>
      container.querySelector<HTMLElement>(`[data-midi="${midi}"]`)!.dataset.state
    act(() => useSelectionStore.getState().setQuality('augmented'))
    // C augmented against the C major scale shows all four roles at once.
    expect(stateOf(48)).toBe('root')
    expect(stateOf(52)).toBe('shared') // E — chord and scale
    expect(stateOf(56)).toBe('chord-tone') // G♯ — chord only
    expect(stateOf(50)).toBe('scale-note') // D — scale only
    const shared = container.querySelector('[data-state="shared"]')!
    const chordOnly = container.querySelector('[data-state="chord-tone"]')!
    const scaleOnly = container.querySelector('[data-state="scale-note"]')!
    expect(shared.querySelector('.marker-shared')).not.toBeNull()
    expect(chordOnly.querySelector('.marker-chord-tone')).not.toBeNull()
    expect(scaleOnly.querySelector('.marker-scale-note')).not.toBeNull()
  })

  it('choosing a chord type updates the title, inversions, keyboard, Understand section and playback (E2b)', async () => {
    const audioEngine = await import('./audioEngine')
    renderApp()
    act(() => useSelectionStore.getState().setViewMode('chord'))
    expect(container.querySelectorAll('[aria-label="Inversion"] [role="radio"]')).toHaveLength(3)

    const cmaj7 = [...container.querySelectorAll<HTMLElement>('.chord-explore .explore-tile')].find(
      (b) => b.querySelector('.explore-tile-title')?.textContent === 'Cmaj7',
    )!
    await act(async () => cmaj7.click())

    expect(container.querySelector('.selection-title')?.textContent).toBe('Cmaj7')
    expect(container.querySelectorAll('[aria-label="Inversion"] [role="radio"]')).toHaveLength(4)
    expect(container.querySelector<HTMLElement>('[data-midi="59"]')!.dataset.state).toBe('chord-tone')
    expect(container.querySelector('.understand .card-header')?.textContent).toBe('Understand Cmaj7')
    expect(audioEngine.playChord).toHaveBeenCalled()
  })

  it('choosing a scale in Scale view updates the keyboard and Understand section, with the chord list hidden (E2c)', () => {
    renderApp()
    act(() => useSelectionStore.getState().setViewMode('scale'))
    expect(container.querySelector('.chord-explore')).toBeNull()

    const minor = [...container.querySelectorAll<HTMLElement>('.scale-explore .explore-tile')].find(
      (b) => b.querySelector('.explore-tile-title')?.textContent === 'Natural minor',
    )!
    act(() => minor.click())

    // E♭ (51) enters the scale and E natural (52) leaves it.
    expect(container.querySelector<HTMLElement>('[data-midi="51"]')!.dataset.state).toBe('scale-note')
    expect(container.querySelector<HTMLElement>('[data-midi="52"]')!.dataset.state).toBe('plain')
    expect(container.querySelector('.understand .card-header')?.textContent).toBe(
      'Understand C natural minor',
    )
    expect(container.querySelector('.chord-explore')).toBeNull()
  })

  it('shows only the list the active view uses, keeping the hidden selection (S2c, E2c)', () => {
    renderApp()
    act(() => useSelectionStore.getState().setViewMode('chord'))
    expect(container.querySelector('.chord-explore')).not.toBeNull()
    expect(container.querySelector('.scale-explore')).toBeNull()
    act(() => useSelectionStore.getState().setViewMode('scale'))
    expect(container.querySelector('.chord-explore')).toBeNull()
    expect(container.querySelector('.scale-explore')).not.toBeNull()
  })

  it('changing the chord quality updates the title, keyboard, and related-chord section immediately', () => {
    renderApp()
    act(() => {
      useSelectionStore.getState().setQuality('diminished')
    })
    expect(container.querySelector('.selection-title')?.textContent).toBe('Cdim with C major scale')
    const selectedTile = [...container.querySelectorAll<HTMLElement>('.explore-tile')].find(
      (b) => b.getAttribute('aria-pressed') === 'true',
    )
    expect(selectedTile?.querySelector('.explore-tile-title')?.textContent).toBe('Cdim')
    // The scale is the one the person chose (C major) and does not follow the chord:
    // F3 is a C major scale tone and not a Cdim chord tone.
    const fKey = container.querySelector<HTMLElement>('[data-midi="53"]')!
    expect(fKey.dataset.state).toBe('scale-note')
  })

  it('shows the slash-chord label and inversion name only when the inversion is not root position (phase-4)', () => {
    renderApp()
    expect(container.querySelector('.slash-label')).toBeNull()
    act(() => {
      useSelectionStore.getState().setQuality('7')
      useSelectionStore.getState().setInversion(1)
    })
    expect(container.querySelector('.slash-label')?.textContent).toBe('C7/E')
    expect(container.querySelector('.inversion-name')?.textContent).toBe('1st inversion')
    act(() => {
      useSelectionStore.getState().setInversion(0)
    })
    expect(container.querySelector('.slash-label')).toBeNull()
  })

  it('picking an inversion from the primary row updates the store and the keyboard together (S1c)', () => {
    renderApp()
    const inversionGroup = container.querySelector('[aria-label="Inversion"]')!
    const secondInversionButton = [...inversionGroup.querySelectorAll('button')].find(
      (b) => b.textContent === '2nd',
    )!
    act(() => secondInversionButton.click())
    expect(useSelectionStore.getState().selection.inversion).toBe(2)
    // G3 is the bass of C major's 2nd inversion, so the keyboard follows.
    expect(container.querySelector<HTMLElement>('[data-midi="55"]')!.dataset.bass).toBe('true')
  })

  it('tapping a chord-type tile updates the store quality and the keyboard highlights end-to-end', () => {
    renderApp()
    const cKey = container.querySelector<HTMLElement>('[data-midi="52"]')!
    expect(cKey.dataset.state).toBe('shared') // E is in both the C chord and the C major scale
    const cmaj7 = [...container.querySelectorAll<HTMLElement>('.explore-tile')].find((b) =>
      b.querySelector('.explore-tile-title')?.textContent === 'Cmaj7',
    )
    act(() => {
      cmaj7!.click()
    })
    expect(useSelectionStore.getState().selection.quality).toBe('maj7')
    const eKey = container.querySelector<HTMLElement>('[data-midi="52"]')!
    expect(eKey.dataset.state).toBe('shared')
    const bKey = container.querySelector<HTMLElement>('[data-midi="59"]')!
    expect(bKey.dataset.state).toBe('shared') // B is now a Cmaj7 chord tone, and in C major
  })
})
