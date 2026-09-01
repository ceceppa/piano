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

  it('in chord mode highlights only chord tones plus the root marker', () => {
    act(() => useSelectionStore.getState().setViewMode('chord'))
    renderKeyboard()
    const states = keyStates()
    const chordPcs = new Set([0, 4, 7]) // C, E, G
    const roots = new Set([48, 60])
    for (const [midi, state] of Object.entries(states)) {
      const m = Number(midi)
      if (roots.has(m)) expect(state).toBe('root')
      else if (chordPcs.has(m % 12)) expect(state).toBe('chord-tone')
      else expect(state).toBe('plain')
    }
  })

  it('in scale mode highlights the scale set (no chord-only tones)', () => {
    act(() => useSelectionStore.getState().setViewMode('scale'))
    renderKeyboard()
    const states = keyStates()
    const scalePcs = new Set([0, 2, 4, 5, 7, 9, 11]) // C major scale
    const roots = new Set([48, 60])
    for (const [midi, state] of Object.entries(states)) {
      const m = Number(midi)
      if (roots.has(m)) expect(state).toBe('root')
      else if (scalePcs.has(m % 12)) expect(state).toBe('scale-note')
      else expect(state).toBe('plain')
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
    expect(states[62]).toBe('scale-note') // D
    // A m7's chord-root scale is A natural minor (tech-spec §Chord-scale mapping), not
    // A major — C♯ (49) is outside it; F3 (53) is the natural-minor-only tone instead.
    expect(states[49]).toBe('plain')
    expect(states[53]).toBe('scale-note') // F3 (A natural minor)
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