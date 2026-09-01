import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import UnderstandSection from './UnderstandSection'
import { useSelectionStore } from '../store/useSelectionStore'

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  useSelectionStore.setState({
    selection: {
      root: 0, // C
      quality: 'major',
      scaleType: 'major',
      viewMode: 'both',
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

function renderSection() {
  act(() => {
    root.render(<UnderstandSection />)
  })
}

function rowText(label: string): string | undefined {
  const row = [...container.querySelectorAll('.understand-row')].find(
    (r) => r.querySelector('.understand-label')?.textContent === label,
  )
  return row?.querySelector('.understand-value')?.textContent ?? undefined
}

function headerText(): string | undefined {
  return container.querySelector('.card-header')?.textContent ?? undefined
}

function sentences(): string[] {
  return [...container.querySelectorAll('.understand-sentence')].map((el) => el.textContent ?? '')
}

function toggle(): HTMLButtonElement {
  return container.querySelector<HTMLButtonElement>('.understand-detail-toggle')!
}

describe('UnderstandSection', () => {
  it('names what is being explained in its header', () => {
    act(() => useSelectionStore.getState().setViewMode('chord'))
    renderSection()
    expect(headerText()).toBe('Understand C')
    act(() => useSelectionStore.getState().setViewMode('scale'))
    expect(headerText()).toBe('Understand C major')
    act(() => useSelectionStore.getState().setViewMode('both'))
    expect(headerText()).toBe('Understand C and C major')
  })

  it('lists the chord notes and one plain sentence in Chord view (S3b)', () => {
    act(() => useSelectionStore.getState().setViewMode('chord'))
    renderSection()
    expect(rowText('Notes:')).toBe('C · E · G')
    expect(rowText('Scale:')).toBeUndefined()
    expect(sentences()).toHaveLength(1)
    expect(sentences()[0].length).toBeGreaterThan(0)
  })

  it('lists the chord notes bass-to-treble in the selected inversion (S3b)', () => {
    act(() => {
      useSelectionStore.getState().setViewMode('chord')
      useSelectionStore.getState().setInversion(1)
    })
    renderSection()
    expect(rowText('Notes:')).toBe('E · G · C')
  })

  it('shows no chord content in Scale view, on screen or to a screen reader (S3b, E4a)', () => {
    act(() => useSelectionStore.getState().setViewMode('scale'))
    renderSection()
    expect(rowText('Notes:')).toBe('C · D · E · F · G · A · B')
    expect(rowText('Chord:')).toBeUndefined()
    expect(rowText('Shared notes:')).toBeUndefined()
    expect(headerText()).toBe('Understand C major')
    // Nothing chord-shaped survives anywhere in the rendered subtree.
    const text = container.textContent ?? ''
    expect(text).not.toContain('Chord')
    expect(text).not.toContain('Shared')
    expect(sentences()).toHaveLength(1)
  })

  it('lists chord notes, scale notes, and shared notes in Both view (S3b, E3c)', () => {
    renderSection()
    expect(rowText('Chord:')).toBe('C · E · G')
    expect(rowText('Scale:')).toBe('C · D · E · F · G · A · B')
    expect(rowText('Shared notes:')).toBe('C · E · G')
    expect(sentences()).toHaveLength(2)
  })

  it('reports shared notes honestly when the chord leaves the scale (S3b)', () => {
    act(() => useSelectionStore.getState().setQuality('augmented'))
    renderSection()
    // C augmented is C · E · G♯; only C and E are in the C major scale.
    expect(rowText('Chord:')).toBe('C · E · G♯')
    expect(rowText('Shared notes:')).toBe('C · E')
  })

  it('expands intervals and scale degrees inline, and collapses again (S3c)', () => {
    renderSection()
    expect(toggle().getAttribute('aria-expanded')).toBe('false')
    expect(container.querySelector('.understand-detail')).toBeNull()

    act(() => toggle().click())
    expect(toggle().getAttribute('aria-expanded')).toBe('true')
    // The detail row lives inside the same card — nothing navigates away.
    expect(container.querySelector('.understand-detail')?.closest('.card')).not.toBeNull()
    expect(rowText('Intervals:')).toBe('1 · 3 · 5')
    expect(rowText('Scale degrees:')).toBe('1 · 2 · 3 · 4 · 5 · 6 · 7')

    act(() => toggle().click())
    expect(container.querySelector('.understand-detail')).toBeNull()
  })

  it('offers only scale degrees in Scale view (S3c, E4a)', () => {
    act(() => useSelectionStore.getState().setViewMode('scale'))
    renderSection()
    expect(toggle().textContent).toBe('Show scale degrees')
    act(() => toggle().click())
    expect(rowText('Scale degrees:')).toBe('1 · 2 · 3 · 4 · 5 · 6 · 7')
    expect(rowText('Intervals:')).toBeUndefined()
    expect(container.textContent).not.toContain('Chord')
  })

  it('shows the whole/half step formula next to scale degrees (S3c+1, E2c+1)', () => {
    act(() => useSelectionStore.getState().setViewMode('scale'))
    renderSection()
    act(() => toggle().click())
    expect(rowText('Formula:')).toBe('W · W · H · W · W · W · H')

    act(() => useSelectionStore.getState().setScaleType('naturalMinor'))
    expect(rowText('Formula:')).toBe('W · H · W · W · H · W · W')
  })

  it('updates when the chord type changes (E2b)', () => {
    act(() => useSelectionStore.getState().setViewMode('chord'))
    renderSection()
    const before = sentences()[0]
    act(() => useSelectionStore.getState().setQuality('m7'))
    expect(rowText('Notes:')).toBe('C · D♯ · G · A♯')
    expect(headerText()).toBe('Understand Cm7')
    expect(sentences()[0]).not.toBe(before)
  })

  it('updates when the scale changes (E2c)', () => {
    act(() => useSelectionStore.getState().setViewMode('scale'))
    renderSection()
    act(() => useSelectionStore.getState().setScaleType('naturalMinor'))
    expect(rowText('Notes:')).toBe('C · D · D♯ · F · G · G♯ · A♯')
    expect(headerText()).toBe('Understand C natural minor')
  })
})
