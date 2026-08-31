import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Keyboard from './Keyboard'
import RootSelector from './root-selector'
import QualitySelector from './quality-selector'
import KeyModeSelector from './key-mode-selector'
import ScaleFollow from './scale-follow'
import ViewModeSelector from './view-mode-selector'
import GenreSelector from './genre-selector'
import Select from './shared/Select'
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

function selectFor(labelText: string): HTMLSelectElement {
  const label = [...container.querySelectorAll('label')].find((l) =>
    l.textContent?.includes(labelText),
  )
  const select = label?.querySelector('select')
  if (!select) throw new Error(`no select for label "${labelText}"`)
  return select
}

function segRadio(labelText: string, value: string): HTMLButtonElement {
  const group = [...container.querySelectorAll('[role="radiogroup"]')].find((g) =>
    g.getAttribute('aria-label')?.includes(labelText),
  )
  const option = [...(group?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [])].find(
    (r) => r.textContent === value,
  )
  if (!option) throw new Error(`no "${value}" radio in "${labelText}"`)
  return option
}

function change(select: HTMLSelectElement, value: string) {
  act(() => {
    select.value = value
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
}

function clickRadio(radio: HTMLButtonElement) {
  act(() => {
    radio.click()
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

function keyStates(): Record<number, string> {
  const out: Record<number, string> = {}
  container.querySelectorAll<HTMLElement>('[data-midi]').forEach((el) => {
    out[Number(el.dataset.midi)] = el.dataset.state ?? ''
  })
  return out
}

function renderExplore() {
  act(() => {
    root.render(
      <>
        <RootSelector />
        <QualitySelector />
        <KeyModeSelector />
        <ScaleFollow />
        <ViewModeSelector />
        <GenreSelector />
        <Select label="Keyboard range" value="48-71" onChange={() => {}}>
          <option value="48-59">1 octave (C3–B3)</option>
          <option value="48-71">2 octaves (C3–B4)</option>
        </Select>
        <Keyboard />
      </>,
    )
  })
}

describe('musical selectors', () => {
  it('offers all 12 chromatic roots and sets the store root on selection', () => {
    renderExplore()
    const group = [...container.querySelectorAll('[role="radiogroup"]')].find((g) =>
      g.getAttribute('aria-label')?.includes('Root'),
    )
    expect(group?.querySelectorAll('[role="radio"]')).toHaveLength(12)
    clickRadio(segRadio('Root', 'A'))
    expect(useSelectionStore.getState().selection.root).toBe(9)
  })

  it('changes root and re-renders the keyboard highlight set immediately', () => {
    renderExplore()
    expect(keyStates()[48]).toBe('root') // C before
    clickRadio(segRadio('Root', 'A'))
    const states = keyStates()
    expect(states[57]).toBe('root') // A3
    expect(states[61]).toBe('chord-tone') // C♯4 is a chord tone of A major
    expect(states[48]).toBe('plain') // C natural is not in A major
  })

  it('changes quality and re-renders the keyboard highlight set immediately', () => {
    renderExplore()
    const qualitySelect = selectFor('Chord quality')
    expect(qualitySelect.options).toHaveLength(12)
    change(qualitySelect, 'm7')
    expect(useSelectionStore.getState().selection.quality).toBe('m7')
    const states = keyStates()
    expect(states[48]).toBe('root')
    expect(states[51]).toBe('chord-tone') // E♭ of C m7
    expect(states[58]).toBe('chord-tone') // A♭ of C m7
  })

  it('advanced key/mode control updates key context and stays collapsed by default', () => {
    renderExplore()
    const details = container.querySelector('details.advanced-control') as HTMLDetailsElement
    expect(details.open).toBe(false)
    act(() => {
      details.open = true
    })
    const keyRoot = details.querySelectorAll<HTMLSelectElement>('select')[0]
    const scaleType = details.querySelectorAll<HTMLSelectElement>('select')[1]
    change(keyRoot, '5') // F
    change(scaleType, 'naturalMinor')
    expect(useSelectionStore.getState().selection.key).toEqual({ root: 5, scaleType: 'naturalMinor' })
  })

  it('scale-follow toggles the store scaleMode between chord-root and key', () => {
    renderExplore()
    expect(useSelectionStore.getState().selection.scaleMode).toBe('chord-root')
    clickRadio(segRadio('Scale follows', 'Selected key'))
    expect(useSelectionStore.getState().selection.scaleMode).toBe('key')
    clickRadio(segRadio('Scale follows', 'Chord root'))
    expect(useSelectionStore.getState().selection.scaleMode).toBe('chord-root')
  })

  it('view mode writes the store viewMode and the keyboard re-highlights', () => {
    renderExplore()
    expect(keyStates()[50]).toBe('scale-note') // D is a scale note of C major in 'both'
    clickRadio(segRadio('View mode', 'Chord'))
    expect(useSelectionStore.getState().selection.viewMode).toBe('chord')
    const states = keyStates()
    expect(states[50]).toBe('plain') // scale-only tones drop out in chord mode
    expect(states[52]).toBe('chord-tone')
  })

  it('stores the genre value without changing keyboard rendering', () => {
    renderExplore()
    const before = keyStates()[48]
    change(selectFor('Genre context'), 'Blues')
    expect(useSelectionStore.getState().selection.genre).toBe('Blues')
    expect(keyStates()[48]).toBe(before)
  })
})
