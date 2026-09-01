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

  it('shows the scale row in scale-only view too, since Chord is always shown', () => {
    act(() => useSelectionStore.getState().setViewMode('scale'))
    renderPanel()
    expect(rowText('Chord:')).toBe('C · E · G')
    expect(rowText('Scale:')).toBe('C · D · E · F · G · A · B')
  })
})
