import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { chordName } from '../musicCore'
import { DEFAULT_OCTAVE_RANGE, getSystemTheme, useSelectionStore } from './useSelectionStore'

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
    octaveStart: DEFAULT_OCTAVE_RANGE.startMidi,
    octaveEnd: DEFAULT_OCTAVE_RANGE.endMidi,
  })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
})

export function storeSnapshot() {
  const s = useSelectionStore.getState()
  return {
    theme: s.theme,
    root: s.selection.root,
    quality: s.selection.quality,
    scaleType: s.selection.scaleType,
    viewMode: s.selection.viewMode,
    inversion: s.selection.inversion,
    voicingType: s.selection.voicingType,
    octaveStart: s.octaveStart,
    octaveEnd: s.octaveEnd,
  }
}

describe('useSelectionStore defaults', () => {
  it('follows the OS colour preference when it is dark', () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true })
    vi.stubGlobal('matchMedia', matchMedia)
    expect(getSystemTheme()).toBe('dark')
    vi.unstubAllGlobals()
  })

  it('falls back to light when the OS preference is light or unavailable', () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: false })
    vi.stubGlobal('matchMedia', matchMedia)
    expect(getSystemTheme()).toBe('light')
    vi.unstubAllGlobals()
    expect(getSystemTheme()).toBe('light')
  })

  it('initialises to a C major chord in Chord view with no interaction', () => {
    // Read the store's own initial state, not the fixture beforeEach installs:
    // this default is what the app shows on first load with nothing saved.
    const initial = useSelectionStore.getInitialState().selection
    expect(initial.root).toBe(0)
    expect(initial.quality).toBe('major')
    expect(initial.scaleType).toBe('major')
    expect(initial.viewMode).toBe('chord')
    expect(initial.inversion).toBe(0)
    expect(initial.voicingType).toBe('close')
  })

  it('defaults the octave range to three octaves from C3 (48–83)', () => {
    const snap = storeSnapshot()
    expect(snap.octaveStart).toBe(48)
    expect(snap.octaveEnd).toBe(83)
  })
})

describe('selection store actions', () => {
  it('setTheme updates the stored theme', () => {
    const { setTheme } = useSelectionStore.getState()
    act(() => {
      setTheme('dark')
    })
    expect(storeSnapshot().theme).toBe('dark')
  })

  it('setRoot and setQuality update the stored selection', () => {
    const { setRoot, setQuality } = useSelectionStore.getState()
    act(() => {
      setRoot(9)
      setQuality('maj7')
    })
    const snap = storeSnapshot()
    expect(snap.root).toBe(9)
    expect(snap.quality).toBe('maj7')
  })

  it('exposes action updates for scaleType and viewMode', () => {
    const s = useSelectionStore.getState()
    act(() => {
      s.setScaleType('naturalMinor')
      s.setViewMode('scale')
    })
    const snap = storeSnapshot()
    expect(snap.scaleType).toBe('naturalMinor')
    expect(snap.viewMode).toBe('scale')
  })

  it('keeps the chord, inversion, and scale while the view changes around them', () => {
    const s = useSelectionStore.getState()
    act(() => {
      s.setQuality('maj7')
      s.setInversion(2)
      s.setScaleType('naturalMinor')
    })
    act(() => useSelectionStore.getState().setViewMode('scale'))
    act(() => useSelectionStore.getState().setViewMode('chord'))
    const snap = storeSnapshot()
    expect(snap.quality).toBe('maj7')
    expect(snap.inversion).toBe(2)
    expect(snap.scaleType).toBe('naturalMinor')
  })

  it('setInversion and setVoicingType update the selection independently', () => {
    const { setInversion, setVoicingType } = useSelectionStore.getState()
    act(() => {
      setInversion(2)
      setVoicingType('leftRight')
    })
    const snap = storeSnapshot()
    expect(snap.inversion).toBe(2)
    expect(snap.voicingType).toBe('leftRight')
  })

  it('clamps the inversion when a quality change makes it invalid', () => {
    const { setQuality, setInversion } = useSelectionStore.getState()
    act(() => {
      setQuality('7') // 4 distinct tones: inversions 0-3
      setInversion(3)
    })
    expect(storeSnapshot().inversion).toBe(3)
    act(() => {
      setQuality('major') // 3 distinct tones: inversions 0-2
    })
    expect(storeSnapshot().inversion).toBe(2)
  })

  it('leaves a still-valid inversion untouched across a quality change', () => {
    const { setQuality, setInversion } = useSelectionStore.getState()
    act(() => {
      setInversion(1)
      setQuality('maj7')
    })
    expect(storeSnapshot().inversion).toBe(1)
  })
})

describe('component re-render on store change', () => {
  function SelectionLabel() {
    const selection = useSelectionStore((s) => s.selection)
    return <strong data-testid="label">{chordName(selection.root, selection.quality)}</strong>
  }

  it('re-renders a component reading the store when the selection changes', () => {
    act(() => {
      root.render(<SelectionLabel />)
    })
    expect(container.querySelector('[data-testid="label"]')?.textContent).toBe('C')

    const { setRoot, setQuality } = useSelectionStore.getState()
    act(() => {
      setRoot(9)
      setQuality('m7')
    })
    expect(container.querySelector('[data-testid="label"]')?.textContent).toBe('Am7')
  })
})