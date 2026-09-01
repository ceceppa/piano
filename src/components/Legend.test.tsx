import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Legend from './Legend'
import { useSelectionStore } from '../store/useSelectionStore'

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  useSelectionStore.setState({
    selection: {
      root: 0,
      quality: 'major',
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

function renderLegend() {
  act(() => {
    root.render(<Legend />)
  })
}

function labels(): string[] {
  return [...container.querySelectorAll('.legend-label')].map((el) => el.textContent ?? '')
}

describe('Legend', () => {
  it('names only the roles the active view uses (S4b)', () => {
    renderLegend()
    expect(labels()).toEqual(['Root', 'Chord note'])

    act(() => useSelectionStore.getState().setViewMode('scale'))
    expect(labels()).toEqual(['Root', 'Scale note'])

    act(() => useSelectionStore.getState().setViewMode('both'))
    expect(labels()).toEqual(['Root', 'Chord note', 'Scale note', 'Chord + scale'])
  })

  it('gives every row the marker shape that key carries, not colour alone (S4b, E3a)', () => {
    act(() => useSelectionStore.getState().setViewMode('both'))
    renderLegend()
    for (const state of ['root', 'chord-tone', 'scale-note', 'shared']) {
      const swatch = container.querySelector(`.legend-swatch-${state}`)
      expect(swatch, state).not.toBeNull()
      expect(swatch?.querySelector(`.marker-${state}`), state).not.toBeNull()
    }
  })

  it('is a labelled list beside the piano, not a bare row of colours (S4b)', () => {
    renderLegend()
    const list = container.querySelector('.legend')
    expect(list?.tagName).toBe('UL')
    expect(list?.getAttribute('aria-label')).toBe('Keyboard legend')
    expect(labels().every((l) => l.length > 0)).toBe(true)
  })
})
