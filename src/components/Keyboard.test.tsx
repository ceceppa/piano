import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Keyboard, { type KeyState } from './Keyboard'
import { useSelectionStore } from '../store/useSelectionStore'

let container: HTMLDivElement
let root: Root

function renderKeyboard() {
  act(() => {
    root.render(<Keyboard />)
  })
}

function keyStates(): Record<number, KeyState> {
  const out: Record<number, KeyState> = {}
  container.querySelectorAll<HTMLElement>('[data-midi]').forEach((el) => {
    out[Number(el.dataset.midi)] = el.dataset.state as KeyState
  })
  return out
}

function resetStore() {
  useSelectionStore.setState({
    selection: {
      root: 0,
      quality: 'major',
      key: { root: 0, scaleType: 'major' },
      scaleMode: 'chord-root',
      viewMode: 'both',
      genre: 'Any',
      inversion: 0,
      voicingType: 'close',
    },
    octaveStart: 48,
    octaveEnd: 71,
  })
}

beforeEach(() => {
  resetStore()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('Keyboard visualisation', () => {
  it('renders pitch-accurate white and black keys over the octave range', () => {
    renderKeyboard()
    const states = keyStates()
    const whiteKeys = Object.keys(states).filter((m) => {
      const pc = Number(m) % 12
      return [0, 2, 4, 5, 7, 9, 11].includes(pc)
    })
    expect(whiteKeys).toHaveLength(14) // C3–B4
    expect(states[48]).toBeDefined()
    expect(states[61]).toBeDefined() // C♯4 black key
    expect(states[71]).toBeDefined()
    expect(states[72]).toBeUndefined() // beyond B4
  })

  it('highlights chord tones strongly, scale notes subtly, root distinctly on the default C major', () => {
    renderKeyboard()
    const states = keyStates()
    expect(states[48]).toBe('root') // C
    expect(states[52]).toBe('chord-tone') // E
    expect(states[55]).toBe('chord-tone') // G
    expect(states[50]).toBe('scale-note') // D
    expect(states[49]).toBe('plain') // C♯
  })

  it('in chord mode highlights only the current voicing’s exact notes, once (S2b+1, phase-4 correction)', () => {
    act(() => useSelectionStore.getState().setViewMode('chord'))
    renderKeyboard()
    const states = keyStates()
    // C major close, root position: C3/E3/G3 (48/52/55) — the only voiced instance.
    for (const [midi, state] of Object.entries(states)) {
      const m = Number(midi)
      if (m === 48) expect(state).toBe('root')
      else if (m === 52 || m === 55) expect(state).toBe('chord-tone')
      else expect(state).toBe('plain') // includes 60 — the pitch-class repeat, not repeated
    }
  })

  it('in scale mode highlights the scale set once, starting at the scale’s first visible root (E4b, phase-4)', () => {
    act(() => useSelectionStore.getState().setViewMode('scale'))
    renderKeyboard()
    const states = keyStates()
    const scalePcs = new Set([0, 2, 4, 5, 7, 9, 11]) // C major scale
    for (const [midi, state] of Object.entries(states)) {
      const m = Number(midi)
      // No chord/root marker in scale mode (S4a+1, phase-4 correction) — C3 (48)
      // reads as a scale note like any other, not the chord root.
      if (m >= 48 && m <= 59 && scalePcs.has(m % 12)) expect(state).toBe('scale-note')
      else expect(state).toBe('plain') // second octave (60-71): not repeated
    }
  })

  it('updates highlights in the same render pass when the selection changes', () => {
    renderKeyboard()
    expect(keyStates()[50]).toBe('scale-note')
    act(() => {
      useSelectionStore.getState().setRoot(9) // A
      useSelectionStore.getState().setQuality('m7')
    })
    const states = keyStates()
    expect(states[57]).toBe('root') // A3
    expect(states[60]).toBe('chord-tone') // C
    expect(states[64]).toBe('chord-tone') // E
    expect(states[67]).toBe('chord-tone') // G
    expect(states[62]).toBe('scale-note') // D, within the A3-G#4 scale band
    // A m7's chord-root scale is A natural minor (tech-spec §Chord-scale mapping), not
    // A major — C♯ (49) is outside it either way.
    expect(states[49]).toBe('plain')
    // F3 (53) is below the scale band that starts at the first visible A (57);
    // only its higher octave, F4 (65), is marked (E4b, phase-4).
    expect(states[53]).toBe('plain')
    expect(states[65]).toBe('scale-note') // F4 (A natural minor)
  })

  it('re-lays out keys when the octave range changes', () => {
    renderKeyboard()
    expect(keyStates()[71]).toBeDefined()
    act(() => useSelectionStore.getState().setOctaveRange(48, 59))
    const states = keyStates()
    expect(states[60]).toBeUndefined()
    expect(states[59]).toBeDefined()
  })

  it('exposes an accessible name on every key', () => {
    renderKeyboard()
    const key = container.querySelector('[data-state="root"]')
    expect(key?.getAttribute('aria-label')).toBe('C3')
  })

  it('renders distinct marker shapes and border cues per key state', () => {
    renderKeyboard()
    const rootKey = container.querySelector<HTMLElement>('[data-state="root"]')
    const chordKey = container.querySelector<HTMLElement>('[data-state="chord-tone"]')
    const scaleKey = container.querySelector<HTMLElement>('[data-state="scale-note"]')
    expect(rootKey?.classList.contains('key-root')).toBe(true)
    expect(rootKey?.querySelector('.marker-root')).not.toBeNull()
    expect(chordKey?.classList.contains('key-chord-tone')).toBe(true)
    expect(chordKey?.querySelector('.marker-chord-tone')).not.toBeNull()
    expect(scaleKey?.classList.contains('key-scale-note')).toBe(true)
    expect(scaleKey?.querySelector('.marker-scale-note')).not.toBeNull()
    const plainKey = container.querySelector('[data-state="plain"]')
    expect(plainKey?.querySelector('.key-marker')).toBeNull()
  })

  it('sits each black key over the seam between its two adjacent white keys at a fraction of a white key width', () => {
    renderKeyboard()
    const whites = [...container.querySelectorAll<HTMLElement>('.key-white')]
    const blacks = [...container.querySelectorAll<HTMLElement>('.key-black')]
    const whiteCount = whites.length
    const whiteWidth = 100 / whiteCount

    for (const black of blacks) {
      const left = parseFloat(black.style.left)
      const width = parseFloat(black.style.width)
      expect(width).toBeLessThan(whiteWidth)
      expect(width).toBeCloseTo(whiteWidth * (2 / 3), 5)

      const whiteMidi = Number(black.dataset.midi)
      const midis = whites.map((w) => Number(w.dataset.midi))
      const leftWhiteIdx = midis.filter((m) => m < whiteMidi).length - 1
      const seam = ((leftWhiteIdx + 1) / whiteCount) * 100
      expect(left).toBeCloseTo(seam, 5)
    }
  })

  it('keeps black keys within the band on every preset octave range', () => {
    for (const [start, end] of [
      [48, 71],
      [48, 59],
      [60, 71],
    ] as const) {
      act(() => useSelectionStore.getState().setOctaveRange(start, end))
      renderKeyboard()
      const blacks = [...container.querySelectorAll<HTMLElement>('.key-black')]
      const whites = container.querySelectorAll('.key-white').length
      const whiteWidth = 100 / whites
      for (const black of blacks) {
        const left = parseFloat(black.style.left)
        const width = parseFloat(black.style.width)
        expect(left).toBeGreaterThan(0)
        expect(left).toBeLessThan(100)
        expect(width).toBeLessThan(whiteWidth)
      }
      act(() => root.unmount())
      container.remove()
      container = document.createElement('div')
      document.body.appendChild(container)
      root = createRoot(container)
    }
  })
})

describe('Keyboard default range covers voiced notes (phase-4 correction, S3a+1)', () => {
  it('shows a chord tone that falls beyond the old 2-octave default (B add9)', () => {
    act(() =>
      useSelectionStore.setState((state) => ({
        selection: { ...state.selection, root: 11, quality: 'add9' },
        octaveStart: 48,
        octaveEnd: 83,
      })),
    )
    renderKeyboard()
    // B add9 close voicing includes C♯ at midi 73 — outside the old 48–71 default,
    // inside the new 48–83 (3-octave) default.
    expect(container.querySelector<HTMLElement>('[data-midi="73"]')?.dataset.state).toBe('chord-tone')
  })
})

describe('Keyboard scale display fixes (phase-4)', () => {
  it('marks a scale note only once per octave, from the first visible occurrence of the scale root', () => {
    act(() => useSelectionStore.getState().setViewMode('scale'))
    renderKeyboard()
    // C major scale, default C3–B4 range: the first visible root is C3 (48).
    expect(container.querySelector<HTMLElement>('[data-midi="50"]')?.dataset.state).toBe('scale-note') // D3
    expect(container.querySelector<HTMLElement>('[data-midi="62"]')?.dataset.state).toBe('plain') // D4 — not repeated
  })
})

describe('Keyboard inversions and voicings (phase-4)', () => {
  it('marks the bass note, which coincides with the root at root position', () => {
    renderKeyboard()
    const rootKey = container.querySelector<HTMLElement>('[data-midi="48"]')!
    expect(rootKey.dataset.bass).toBe('true')
    expect(rootKey.querySelector('.marker-root')).not.toBeNull()
    expect(rootKey.querySelector('.marker-bass')).not.toBeNull()
  })

  it('moves the bass marker to the inverted bass note, off the root', () => {
    act(() => {
      useSelectionStore.getState().setQuality('7')
      useSelectionStore.getState().setInversion(1) // C7/E: bass = E3 (52)
    })
    renderKeyboard()
    expect(container.querySelector<HTMLElement>('[data-midi="52"]')?.dataset.bass).toBe('true')
    expect(container.querySelector<HTMLElement>('[data-midi="48"]')?.dataset.bass).toBeUndefined()
  })

  it('marks the exact voiced instances, so open visibly differs from close (E3a)', () => {
    renderKeyboard()
    const voicedMidis = () =>
      [...container.querySelectorAll<HTMLElement>('[data-voiced]')].map((el) => Number(el.dataset.midi)).sort((a, b) => a - b)
    expect(voicedMidis()).toEqual([48, 52, 55]) // C major close: C3, E3, G3
    act(() => useSelectionStore.getState().setVoicingType('open'))
    expect(voicedMidis()).toEqual([48, 55, 64]) // open: C3, G3, E4
  })

  it('shows no hand-grouping strip for close or open voicing', () => {
    act(() => useSelectionStore.getState().setVoicingType('open'))
    renderKeyboard()
    expect(container.querySelector('[aria-label="Hand grouping"]')).toBeNull()
  })

  it('shows a labelled hand-grouping strip and tags keys by hand for left/right voicing', () => {
    act(() => useSelectionStore.getState().setVoicingType('leftRight'))
    renderKeyboard()
    const strip = container.querySelector('[aria-label="Hand grouping"]')
    expect(strip).not.toBeNull()
    expect(strip?.querySelector('.hand-bracket-left .hand-tag')?.textContent).toBe('L')
    expect(strip?.querySelector('.hand-bracket-right .hand-tag')?.textContent).toBe('R')
    // C major, left/right: left hand drops the bass an octave (C2 = 36), right keeps E3/G3.
    expect(container.querySelector<HTMLElement>('[data-midi="36"]')?.dataset.hand).toBe('left')
    expect(container.querySelector<HTMLElement>('[data-midi="52"]')?.dataset.hand).toBe('right')
    expect(container.querySelector<HTMLElement>('[data-midi="55"]')?.dataset.hand).toBe('right')
  })

  it('extends the visible range downward to include a left/right voicing’s dropped bass note', () => {
    renderKeyboard()
    expect(container.querySelector('[data-midi="36"]')).toBeNull() // below the default 48 start
    act(() => useSelectionStore.getState().setVoicingType('leftRight'))
    expect(container.querySelector('[data-midi="36"]')).not.toBeNull()
    expect(container.querySelector('[data-midi="71"]')).not.toBeNull() // endMidi untouched
  })

  it('renders any inversion combined with any voicing without error, marking whichever note is now the bass', () => {
    act(() => {
      useSelectionStore.getState().setQuality('7')
      useSelectionStore.getState().setInversion(2)
      useSelectionStore.getState().setVoicingType('open')
    })
    renderKeyboard()
    // C7 2nd inversion, open: [55, 60, 70, 76] (G,C,B♭+12,E+12) — bass stays the
    // inversion's own bass note (55, G) since 'open' never touches the bass.
    expect(container.querySelector<HTMLElement>('[data-midi="55"]')?.dataset.bass).toBe('true')
  })
})

describe('No chord elements in scale view (phase-4 correction, S4a+1)', () => {
  it('hides the bass marker, the voiced-note outline, and the hand-grouping strip when View mode is scale', () => {
    act(() => {
      useSelectionStore.getState().setQuality('7')
      useSelectionStore.getState().setInversion(1)
      useSelectionStore.getState().setVoicingType('leftRight')
      useSelectionStore.getState().setViewMode('scale')
    })
    renderKeyboard()
    expect(container.querySelector('[aria-label="Hand grouping"]')).toBeNull()
    expect(container.querySelectorAll('[data-bass]')).toHaveLength(0)
    expect(container.querySelectorAll('[data-voiced]')).toHaveLength(0)
    expect(container.querySelector('.marker-bass')).toBeNull()
  })

  it('restores chord elements when View mode leaves scale', () => {
    act(() => {
      useSelectionStore.getState().setViewMode('scale')
    })
    renderKeyboard()
    expect(container.querySelector<HTMLElement>('[data-midi="48"]')?.dataset.bass).toBeUndefined()
    act(() => useSelectionStore.getState().setViewMode('both'))
    expect(container.querySelector<HTMLElement>('[data-midi="48"]')?.dataset.bass).toBe('true')
  })
})