import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import NotesPanel from './NotesPanel'
import { useSelectionStore } from '../store/useSelectionStore'

let container: HTMLDivElement
let root: Root

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

function renderPanel() {
  act(() => {
    root.render(<NotesPanel />)
  })
}

function rowText(label: string): string | undefined {
  const row = [...container.querySelectorAll('.notes-row')].find(
    (el) => el.querySelector('.notes-label')?.textContent === label,
  )
  return row?.querySelector('.notes-value')?.textContent
}

describe('NotesPanel', () => {
  it('always lists the selected chord notes (E3a)', () => {
    renderPanel()
    expect(rowText('Chord:')).toBe('C · E · G')
  })

  it('also lists the scale notes when View mode includes the scale (E3b)', () => {
    act(() => useSelectionStore.getState().setViewMode('both'))
    renderPanel()
    expect(rowText('Chord:')).toBe('C · E · G')
    expect(rowText('Scale:')).toBe('C · D · E · F · G · A · B')
  })

  it('shows only the chord notes when View mode is chord-only (E3c)', () => {
    act(() => useSelectionStore.getState().setViewMode('chord'))
    renderPanel()
    expect(rowText('Chord:')).toBe('C · E · G')
    expect(container.querySelector('.notes-row:nth-child(2)')).toBeNull()
    expect(rowText('Scale:')).toBeUndefined()
  })

  it('uses the correct chord-root scale, not always major, for the scale row (S1a consistency)', () => {
    act(() => {
      useSelectionStore.getState().setRoot(0) // C
      useSelectionStore.getState().setQuality('augmented')
      useSelectionStore.getState().setViewMode('both')
    })
    renderPanel()
    expect(rowText('Chord:')).toBe('C · E · G♯')
    expect(rowText('Scale:')).toBe('C · D♯ · E · G · G♯ · B')
  })

  it('shows only the scale notes when View mode is scale-only, not the chord notes (E4a, phase-4 fix)', () => {
    act(() => useSelectionStore.getState().setViewMode('scale'))
    renderPanel()
    expect(rowText('Chord:')).toBeUndefined()
    expect(rowText('Scale:')).toBe('C · D · E · F · G · A · B')
  })

  it('orders the chord notes bass to treble by the selected inversion (S2b+2, phase-4 correction)', () => {
    act(() => {
      useSelectionStore.getState().setQuality('7') // C7: C, E, G, Bb
      useSelectionStore.getState().setInversion(1) // 1st inversion: E, G, Bb, C
    })
    renderPanel()
    expect(rowText('Chord:')).toBe('E · G · A♯ · C')
  })
})
