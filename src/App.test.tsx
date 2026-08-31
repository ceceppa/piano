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

  it('selecting a variation updates the store quality and the keyboard highlights end-to-end', () => {
    renderApp()
    const cKey = container.querySelector<HTMLElement>('[data-midi="52"]')!
    expect(cKey.dataset.state).toBe('chord-tone') // E is a chord tone of C major
    const cmaj7 = [...container.querySelectorAll<HTMLElement>('.variation-item')].find((b) =>
      b.textContent?.includes('Cmaj7'),
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
