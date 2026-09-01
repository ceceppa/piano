import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { useSelectionStore } from './store/useSelectionStore'

vi.mock('./audioEngine', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./audioEngine')>()
  return {
    ...actual,
    init: vi.fn(() => Promise.resolve()),
    setPlaybackListener: vi.fn(),
    noteOn: vi.fn(),
    noteOff: vi.fn(),
  }
})

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
  delete document.documentElement.dataset.theme
})

function renderApp() {
  act(() => {
    root.render(<App />)
  })
}

describe('App theme wiring', () => {
  it('applies the store theme to the document root on load', () => {
    renderApp()
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('switches the document root theme attribute and palette immediately when the store theme changes', () => {
    renderApp()
    act(() => {
      useSelectionStore.getState().setTheme('dark')
    })
    expect(document.documentElement.dataset.theme).toBe('dark')
    act(() => {
      useSelectionStore.getState().setTheme('light')
    })
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('toggles the theme via the header ToggleSwitch control', () => {
    renderApp()
    const switchInput = container.querySelector<HTMLInputElement>(
      '.app-header input[type="checkbox"]',
    )
    expect(switchInput).not.toBeNull()
    act(() => {
      switchInput!.click()
    })
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(switchInput!.getAttribute('aria-checked')).toBe('true')
  })

  it('re-ranges the keyboard when the octave-range Select changes', () => {
    renderApp()
    expect(container.querySelector('[data-midi="71"]')).not.toBeNull()
    const rangeSelect = [...container.querySelectorAll<HTMLSelectElement>('select')].find((s) =>
      s.value.startsWith('48-'),
    )
    expect(rangeSelect).toBeDefined()
    act(() => {
      rangeSelect!.value = '48-59'
      rangeSelect!.dispatchEvent(new Event('change', { bubbles: true }))
    })
    expect(useSelectionStore.getState().octaveEnd).toBe(59)
    expect(container.querySelector('[data-midi="60"]')).toBeNull()
    expect(container.querySelector('[data-midi="59"]')).not.toBeNull()
  })

  it('shows the selected chord as a prominent title using its full readable name', () => {
    renderApp()
    const title = container.querySelector('.chord-title')
    expect(title?.textContent).toBe('C major')
    act(() => {
      useSelectionStore.getState().setRoot(9) // A
      useSelectionStore.getState().setQuality('diminished')
    })
    expect(container.querySelector('.chord-title')?.textContent).toBe('A diminished')
  })

  it('places root and quality as a dominant, uncarded pair with the rest as a quieter secondary group', () => {
    renderApp()
    const dominant = container.querySelector('.controls-dominant')
    const secondary = container.querySelector('.controls-secondary')
    expect(dominant).not.toBeNull()
    expect(secondary).not.toBeNull()
    expect(dominant?.querySelector('[role="radiogroup"][aria-label*="Root"]')).not.toBeNull()
    expect(dominant?.querySelector('select')).not.toBeNull() // chord quality
    expect(secondary?.querySelector('[role="radiogroup"][aria-label*="Scale follows"]')).not.toBeNull()
    expect(secondary?.querySelector('[role="radiogroup"][aria-label*="View mode"]')).not.toBeNull()
    // No large bordered form card around the control area any more.
    expect(dominant?.closest('.card')).toBeNull()
    expect(secondary?.closest('.card')).toBeNull()
  })

  it('places the keyboard directly beneath the dominant pair, then notes, secondary controls, and playback (E4a, phase-3 layout)', () => {
    renderApp()
    const main = container.querySelector('.explore')!
    const children = [...main.children]
    const dominantIdx = children.findIndex((el) => el.classList.contains('controls-dominant'))
    const keyboardIdx = children.findIndex((el) => el.classList.contains('keyboard-wrap'))
    const notesIdx = children.findIndex((el) => el.classList.contains('notes-panel'))
    const secondaryIdx = children.findIndex((el) => el.classList.contains('controls-secondary'))
    const playbackIdx = children.findIndex((el) => el.classList.contains('playback-bar'))
    expect(dominantIdx).toBeGreaterThanOrEqual(0)
    expect(keyboardIdx).toBe(dominantIdx + 1)
    expect(notesIdx).toBe(keyboardIdx + 1)
    expect(secondaryIdx).toBe(notesIdx + 1)
    expect(playbackIdx).toBe(secondaryIdx + 1)
  })

  it('changing the root note updates the title, keyboard, scale, and related-chord section immediately', () => {
    renderApp()
    act(() => {
      useSelectionStore.getState().setRoot(9) // A
    })
    expect(container.querySelector('.chord-title')?.textContent).toBe('A major')
    expect(container.querySelector('[data-midi="57"]')?.getAttribute('data-state')).toBe('root') // A3
    expect(container.querySelector('.chord-explore-title')?.textContent).toBe('Explore A chord types')
    const tileSymbols = [...container.querySelectorAll('.chord-tile-symbol')].map((el) => el.textContent)
    expect(tileSymbols).toContain('A')
    expect(tileSymbols).not.toContain('C')
  })

  it('changing the chord quality updates the title, keyboard, and related-chord section immediately', () => {
    renderApp()
    act(() => {
      useSelectionStore.getState().setQuality('diminished')
    })
    expect(container.querySelector('.chord-title')?.textContent).toBe('C diminished')
    const selectedTile = [...container.querySelectorAll<HTMLElement>('.chord-tile')].find(
      (b) => b.getAttribute('aria-pressed') === 'true',
    )
    expect(selectedTile?.querySelector('.chord-tile-symbol')?.textContent).toBe('Cdim')
    // Cdim's correct chord-root scale is C locrian (tech-spec §Chord-scale mapping), not C major —
    // F3 is a locrian scale tone and not a Cdim chord tone.
    const fKey = container.querySelector<HTMLElement>('[data-midi="53"]')!
    expect(fKey.dataset.state).toBe('scale-note')
  })

  it('tapping a chord-type tile updates the store quality and the keyboard highlights end-to-end', () => {
    renderApp()
    const cKey = container.querySelector<HTMLElement>('[data-midi="52"]')!
    expect(cKey.dataset.state).toBe('chord-tone') // E is a chord tone of C major
    const cmaj7 = [...container.querySelectorAll<HTMLElement>('.chord-tile')].find((b) =>
      b.querySelector('.chord-tile-symbol')?.textContent === 'Cmaj7',
    )
    act(() => {
      cmaj7!.click()
    })
    expect(useSelectionStore.getState().selection.quality).toBe('maj7')
    const eKey = container.querySelector<HTMLElement>('[data-midi="52"]')!
    expect(eKey.dataset.state).toBe('chord-tone')
    const bKey = container.querySelector<HTMLElement>('[data-midi="59"]')!
    expect(bKey.dataset.state).toBe('chord-tone') // B is now a chord tone of Cmaj7
  })
})
