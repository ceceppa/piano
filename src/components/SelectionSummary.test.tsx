import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import SelectionSummary from './SelectionSummary'
import { useSelectionStore } from '../store/useSelectionStore'

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  useSelectionStore.setState({
    selection: {
      root: 7, // G
      quality: '6',
      scaleType: 'major',
      viewMode: 'chord',
      inversion: 0,
      voicingType: 'close',
    },
  })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

function renderSummary() {
  act(() => {
    root.render(<SelectionSummary />)
  })
}

function title(): string | undefined {
  return container.querySelector('.selection-title')?.textContent ?? undefined
}

describe('SelectionSummary', () => {
  it('names what is selected in the active view (S3a)', () => {
    renderSummary()
    expect(title()).toBe('G6')
    act(() => useSelectionStore.getState().setViewMode('scale'))
    expect(title()).toBe('G major scale')
    act(() => useSelectionStore.getState().setViewMode('both'))
    expect(title()).toBe('G6 with G major scale')
  })

  it('follows the root and the chosen scale (S3a)', () => {
    act(() => {
      useSelectionStore.getState().setViewMode('both')
      useSelectionStore.getState().setRoot(9) // A
      useSelectionStore.getState().setScaleType('naturalMinor')
    })
    renderSummary()
    expect(title()).toBe('A6 with A natural minor scale')
  })

  it('adds the slash-chord symbol and inversion name only when an inversion is chosen (S3a)', () => {
    renderSummary()
    expect(container.querySelector('.slash-label')).toBeNull()
    expect(container.querySelector('.inversion-name')).toBeNull()

    act(() => useSelectionStore.getState().setInversion(1))
    expect(container.querySelector('.slash-label')?.textContent).toBe('G6/B')
    expect(container.querySelector('.inversion-name')?.textContent).toBe('1st inversion')
    // The chord is named once: the slash symbol replaces the plain one.
    expect(title()).toBe('G6/B 1st inversion')

    act(() => useSelectionStore.getState().setInversion(0))
    expect(container.querySelector('.slash-label')).toBeNull()
    expect(title()).toBe('G6')
  })

  it('keeps chord notation out of Scale view (S3a, E4a)', () => {
    act(() => {
      useSelectionStore.getState().setInversion(1)
      useSelectionStore.getState().setViewMode('scale')
    })
    renderSummary()
    expect(title()).toBe('G major scale')
    expect(container.querySelector('.slash-label')).toBeNull()
    expect(container.querySelector('.selection-chips')).toBeNull()
  })

  it('announces the selection politely, without re-reading the page (S5b)', () => {
    renderSummary()
    const live = container.querySelector('[role="status"]')!
    expect(live.getAttribute('aria-live')).toBe('polite')
    expect(live.classList.contains('visually-hidden')).toBe(true)
    expect(live.textContent).toBe('G6')

    act(() => useSelectionStore.getState().setInversion(1))
    expect(container.querySelector('[role="status"]')?.textContent).toBe('G6/B, 1st inversion')
    expect(container.querySelector('[role="status"]')?.textContent).not.toContain('Explore')

    act(() => useSelectionStore.getState().setViewMode('scale'))
    expect(container.querySelector('[role="status"]')?.textContent).toBe('G major scale')
  })

  it('adds quiet chord and scale chips in Both view only (S3a)', () => {
    renderSummary()
    expect(container.querySelector('.selection-chips')).toBeNull()
    act(() => useSelectionStore.getState().setViewMode('both'))
    const chips = [...container.querySelectorAll('.chip')].map((c) => c.textContent)
    expect(chips).toEqual(['Chord: G6', 'Scale: G major'])
  })
})
