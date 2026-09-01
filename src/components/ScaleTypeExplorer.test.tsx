import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SELECTABLE_SCALES } from '../musicCore'
import ScaleTypeExplorer from './ScaleTypeExplorer'
import Keyboard from './Keyboard'
import { useSelectionStore } from '../store/useSelectionStore'

let container: HTMLDivElement
let root: Root

function resetStore() {
  useSelectionStore.setState({
    selection: {
      root: 9, // A
      quality: 'major',
      scaleType: 'major',
      viewMode: 'both',
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

function renderExplorerWithKeyboard() {
  act(() => {
    root.render(
      <>
        <ScaleTypeExplorer />
        <Keyboard />
      </>,
    )
  })
}

function tiles(): HTMLButtonElement[] {
  return [...container.querySelectorAll<HTMLButtonElement>('.explore-tile')]
}

function titleOf(tile?: HTMLElement): string | undefined {
  return tile?.querySelector('.explore-tile-title')?.textContent ?? undefined
}

describe('ScaleTypeExplorer', () => {
  it('titles the section "Explore [root] scales" and follows the root', () => {
    renderExplorerWithKeyboard()
    expect(container.querySelector('.scale-explore-title')?.textContent).toBe('Explore A scales')
    act(() => useSelectionStore.getState().setRoot(0))
    expect(container.querySelector('.scale-explore-title')?.textContent).toBe('Explore C scales')
  })

  it('offers every scale the app supports, under one Common heading (S2b)', () => {
    renderExplorerWithKeyboard()
    expect(tiles().map(titleOf)).toEqual(['Major', 'Natural minor'])
    expect(tiles()).toHaveLength(SELECTABLE_SCALES.length)
    expect([...container.querySelectorAll('.explore-group-title')].map((el) => el.textContent)).toEqual([
      'Common',
    ])
  })

  it('is a Card-less section with no dropdown, filter, or See-all control (S2b)', () => {
    renderExplorerWithKeyboard()
    const section = container.querySelector('.scale-explore')!
    expect(section.closest('.card')).toBeNull()
    expect(section.querySelector('select')).toBeNull()
    expect(section.textContent).not.toContain('See all')
  })

  it('uses the same tile language as the chord list, including the selected state (S2b)', () => {
    renderExplorerWithKeyboard()
    const selected = tiles().find((b) => b.getAttribute('aria-pressed') === 'true')
    expect(titleOf(selected)).toBe('Major')
    expect(selected?.classList.contains('explore-tile-selected')).toBe(true)
    expect(tiles().every((t) => t.querySelector('.explore-tile-label')?.textContent)).toBe(true)
  })

  it('choosing a scale updates the store and the keyboard immediately (S2b, E2c)', () => {
    renderExplorerWithKeyboard()
    // F♯4 (66) belongs to the A major scale only; G4 (67) to A natural minor only.
    expect(container.querySelector<HTMLElement>('[data-midi="66"]')!.dataset.state).toBe('scale-note')
    expect(container.querySelector<HTMLElement>('[data-midi="67"]')!.dataset.state).toBe('plain')
    const minor = tiles().find((t) => titleOf(t) === 'Natural minor')
    act(() => minor!.click())
    expect(useSelectionStore.getState().selection.scaleType).toBe('naturalMinor')
    expect(container.querySelector<HTMLElement>('[data-midi="66"]')!.dataset.state).toBe('plain')
    expect(container.querySelector<HTMLElement>('[data-midi="67"]')!.dataset.state).toBe('scale-note')
    expect(titleOf(tiles().find((b) => b.getAttribute('aria-pressed') === 'true'))).toBe('Natural minor')
  })

  it('keeps the selected chord and inversion when the scale changes (S2b)', () => {
    act(() => {
      useSelectionStore.getState().setQuality('maj7')
      useSelectionStore.getState().setInversion(2)
    })
    renderExplorerWithKeyboard()
    const minor = tiles().find((t) => titleOf(t) === 'Natural minor')
    act(() => minor!.click())
    const { quality, inversion } = useSelectionStore.getState().selection
    expect(quality).toBe('maj7')
    expect(inversion).toBe(2)
  })
})
