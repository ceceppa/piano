import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QUALITIES, chordName } from '../musicCore'
import VariationPanel from './VariationPanel'
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

function renderPanelWithKeyboard() {
  act(() => {
    root.render(
      <>
        <VariationPanel />
        <Keyboard />
      </>,
    )
  })
}

function variationButtons(): HTMLButtonElement[] {
  return [...container.querySelectorAll<HTMLButtonElement>('.variation-item')]
}

describe('VariationPanel', () => {
  it('lists every catalogue quality for the root, in catalogue order, with the current quality marked selected', () => {
    renderPanelWithKeyboard()
    const buttons = variationButtons()
    expect(buttons.map((b) => b.querySelector('.variation-name')?.textContent)).toEqual(
      QUALITIES.map((q) => chordName(9, q.id)),
    )
    expect(buttons.length).toBe(QUALITIES.length)
    const selected = buttons.find((b) => b.getAttribute('aria-pressed') === 'true')
    expect(selected?.querySelector('.variation-name')?.textContent).toBe('A')
  })

  it('shows per-variation genre guidance from the musicCore catalogue', () => {
    renderPanelWithKeyboard()
    const first = variationButtons()[0]
    expect(first.querySelector('.variation-guide')?.textContent).toBe(QUALITIES[0].genreGuide[0])
    // Labels are static catalogue text, not derived from the stored genre.
    act(() => {
      useSelectionStore.getState().setGenre('Blues')
    })
    expect(variationButtons()[0].querySelector('.variation-guide')?.textContent).toBe(
      QUALITIES[0].genreGuide[0],
    )
  })

  it('selecting a variation updates the store quality and keyboard highlights immediately', () => {
    renderPanelWithKeyboard()
    const key = container.querySelector<HTMLElement>('[data-midi="57"]')! // A3
    expect(key.dataset.state).toBe('root')

    const am7Button = variationButtons().find((b) => b.querySelector('.variation-name')?.textContent === 'Am7')
    act(() => {
      am7Button!.click()
    })

    expect(useSelectionStore.getState().selection.quality).toBe('m7')
    const after = container.querySelector<HTMLElement>('[data-midi="57"]')!
    expect(after.dataset.state).toBe('root')
    const cKey = container.querySelector<HTMLElement>('[data-midi="60"]')!
    expect(cKey.dataset.state).toBe('chord-tone') // C is a chord tone of Am7
  })

  it('moves the selected-row marker to the newly chosen variation', () => {
    renderPanelWithKeyboard()
    const am7Button = variationButtons().find((b) => b.querySelector('.variation-name')?.textContent === 'Am7')
    act(() => {
      am7Button!.click()
    })
    const selected = variationButtons().find((b) => b.getAttribute('aria-pressed') === 'true')
    expect(selected?.querySelector('.variation-name')?.textContent).toBe('Am7')
    expect(selected?.classList.contains('variation-item-selected')).toBe(true)
  })

  it('plays the newly selected variation without a separate confirmation step', async () => {
    renderPanelWithKeyboard()
    const a7Button = variationButtons().find((b) => b.querySelector('.variation-name')?.textContent === 'A7')
    await act(async () => {
      a7Button!.click()
    })
    expect(useSelectionStore.getState().selection.quality).toBe('7')
    expect(audioEngine.playChord).toHaveBeenCalledWith([57, 61, 64, 67])
  })
})
