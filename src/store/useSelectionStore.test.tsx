import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { chordName } from '../musicCore'
import { getSystemTheme, useSelectionStore } from './useSelectionStore'

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  useSelectionStore.setState({
    theme: 'light',
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
    key: s.selection.key,
    scaleMode: s.selection.scaleMode,
    viewMode: s.selection.viewMode,
    genre: s.selection.genre,
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

  it('initialises to C major with no interaction', () => {
    const snap = storeSnapshot()
    expect(snap.root).toBe(0)
    expect(snap.quality).toBe('major')
    expect(snap.key).toEqual({ root: 0, scaleType: 'major' })
    expect(snap.scaleMode).toBe('chord-root')
    expect(snap.viewMode).toBe('both')
    expect(snap.genre).toBe('Any')
  })

  it('defaults the octave range to two octaves from C3 (48–71)', () => {
    const snap = storeSnapshot()
    expect(snap.octaveStart).toBe(48)
    expect(snap.octaveEnd).toBe(71)
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

  it('exposes action updates for key, scaleMode, viewMode, and octaveRange', () => {
    const s = useSelectionStore.getState()
    act(() => {
      s.setKeyRoot(5)
      s.setKeyScaleType('naturalMinor')
      s.setScaleMode('key')
      s.setViewMode('scale')
      s.setGenre('Blues')
      s.setOctaveRange(36, 47)
    })
    const snap = storeSnapshot()
    expect(snap.key).toEqual({ root: 5, scaleType: 'naturalMinor' })
    expect(snap.scaleMode).toBe('key')
    expect(snap.viewMode).toBe('scale')
    expect(snap.genre).toBe('Blues')
    expect(snap.octaveStart).toBe(36)
    expect(snap.octaveEnd).toBe(47)
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