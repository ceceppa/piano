import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QUALITIES, chordName } from '../musicCore'
import ChordTypeExplorer from './ChordTypeExplorer'
import Keyboard from './Keyboard'
import { useSelectionStore } from '../store/useSelectionStore'
import * as audioEngine from '../audioEngine'

vi.mock('../audioEngine', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../audioEngine')>()
  return {
    ...actual,
    init: vi.fn(() => Promise.resolve()),
    playChord: vi.fn(),
    noteOn: vi.fn(),
    noteOff: vi.fn(),
  }
})

let container: HTMLDivElement
let root: Root

function resetStore() {
  useSelectionStore.setState({
    selection: {
      root: 9, // A
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
  vi.clearAllMocks()
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
        <ChordTypeExplorer />
        <Keyboard />
      </>,
    )
  })
}

function tiles(): HTMLButtonElement[] {
  return [...container.querySelectorAll<HTMLButtonElement>('.chord-tile')]
}

function groupTitles(): string[] {
  return [...container.querySelectorAll('.chord-group-title')].map((el) => el.textContent ?? '')
}

describe('ChordTypeExplorer', () => {
  it('renames the section to "Explore [root] chord types"', () => {
    renderExplorerWithKeyboard()
    expect(container.querySelector('.chord-explore-title')?.textContent).toBe('Explore A chord types')
  })

  it('groups every catalogue quality into Core / Colour / Sevenths & extensions, chord symbol dominant', () => {
    renderExplorerWithKeyboard()
    expect(groupTitles()).toEqual(['Core', 'Colour', 'Sevenths & extensions'])

    const groups = [...container.querySelectorAll('.chord-group')]
    const symbolsIn = (group: Element) =>
      [...group.querySelectorAll('.chord-tile-symbol')].map((el) => el.textContent)

    expect(symbolsIn(groups[0])).toEqual(['A', 'Am', 'Adim', 'Aaug'])
    expect(symbolsIn(groups[1])).toEqual(['Asus2', 'Asus4', 'A6', 'Aadd9'])
    expect(symbolsIn(groups[2])).toEqual(['A7', 'Amaj7', 'Am7', 'A9'])

    // Every catalogue id appears exactly once, across all groups.
    const allSymbols = tiles().map((b) => b.querySelector('.chord-tile-symbol')?.textContent)
    expect(allSymbols).toHaveLength(QUALITIES.length)
    for (const q of QUALITIES) {
      expect(allSymbols).toContain(chordName(9, q.id))
    }
  })

  it('is not wrapped in a Card — a Card-less section', () => {
    renderExplorerWithKeyboard()
    const section = container.querySelector('.chord-explore')
    expect(section?.closest('.card')).toBeNull()
  })

  it('marks the currently selected quality with a clear selected state', () => {
    renderExplorerWithKeyboard()
    const selected = tiles().find((b) => b.getAttribute('aria-pressed') === 'true')
    expect(selected?.querySelector('.chord-tile-symbol')?.textContent).toBe('A')
    expect(selected?.classList.contains('chord-tile-selected')).toBe(true)
  })

  it('tapping a tile updates the store quality and the keyboard highlights immediately, and moves the selected state', () => {
    renderExplorerWithKeyboard()
    const key = container.querySelector<HTMLElement>('[data-midi="57"]')! // A3
    expect(key.dataset.state).toBe('root')

    const am7 = tiles().find((b) => b.querySelector('.chord-tile-symbol')?.textContent === 'Am7')
    act(() => {
      am7!.click()
    })

    expect(useSelectionStore.getState().selection.quality).toBe('m7')
    const cKey = container.querySelector<HTMLElement>('[data-midi="60"]')!
    expect(cKey.dataset.state).toBe('chord-tone') // C is a chord tone of Am7

    const selected = tiles().find((b) => b.getAttribute('aria-pressed') === 'true')
    expect(selected?.querySelector('.chord-tile-symbol')?.textContent).toBe('Am7')
  })

  it('plays the newly selected chord type without a separate confirmation step', async () => {
    renderExplorerWithKeyboard()
    const a7 = tiles().find((b) => b.querySelector('.chord-tile-symbol')?.textContent === 'A7')
    await act(async () => {
      a7!.click()
    })
    expect(useSelectionStore.getState().selection.quality).toBe('7')
    expect(audioEngine.playChord).toHaveBeenCalledWith([57, 61, 64, 67])
  })

  it('shows a non-colour Recommended cue only on tiles tagged for the selected genre, and never hides, removes, or reorders a tile', () => {
    renderExplorerWithKeyboard()
    const before = tiles().map((b) => b.querySelector('.chord-tile-symbol')?.textContent)
    act(() => {
      useSelectionStore.getState().setGenre('Blues')
    })
    const after = tiles()
    expect(after.map((b) => b.querySelector('.chord-tile-symbol')?.textContent)).toEqual(before)
    const a7 = after.find((b) => b.querySelector('.chord-tile-symbol')?.textContent === 'A7')
    expect(a7?.querySelector('.chord-tile-recommended')?.textContent).toBe('Recommended')
    const amaj7 = after.find((b) => b.querySelector('.chord-tile-symbol')?.textContent === 'Amaj7')
    expect(amaj7?.querySelector('.chord-tile-recommended')).toBeNull()
  })

  it('clears the Recommended cue entirely when the genre is "Any"', () => {
    renderExplorerWithKeyboard()
    act(() => useSelectionStore.getState().setGenre('Blues'))
    expect(container.querySelectorAll('.chord-tile-recommended').length).toBeGreaterThan(0)
    act(() => useSelectionStore.getState().setGenre('Any'))
    expect(container.querySelectorAll('.chord-tile-recommended').length).toBe(0)
  })
})
