import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Keyboard from './Keyboard'
import RootSelector from './root-selector'
import InversionSelector from './inversion-selector'
import VoicingSelector from './voicing-selector'
import ViewModeSelector from './view-mode-selector'
import { useSelectionStore } from '../store/useSelectionStore'

let container: HTMLDivElement
let root: Root

function resetStore() {
  useSelectionStore.setState({
    selection: {
      root: 0,
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

function group(labelText: string): HTMLElement {
  const found = [...container.querySelectorAll<HTMLElement>('[role="radiogroup"]')].find((g) =>
    g.getAttribute('aria-label')?.includes(labelText),
  )
  if (!found) throw new Error(`no radiogroup "${labelText}"`)
  return found
}

function radios(labelText: string): HTMLButtonElement[] {
  return [...group(labelText).querySelectorAll<HTMLButtonElement>('[role="radio"]')]
}

/** Root buttons carry two stacked spellings, so match on the accessible name. */
function rootRadio(name: string): HTMLButtonElement {
  const option = radios('Root note').find((r) => r.getAttribute('aria-label') === name)
  if (!option) throw new Error(`no "${name}" root button`)
  return option
}

function segRadio(labelText: string, value: string): HTMLButtonElement {
  const option = radios(labelText).find((r) => r.textContent === value)
  if (!option) throw new Error(`no "${value}" radio in "${labelText}"`)
  return option
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

function renderSelectionRegion() {
  act(() => {
    root.render(
      <>
        <ViewModeSelector />
        <RootSelector />
        <InversionSelector />
        <VoicingSelector />
        <Keyboard />
      </>,
    )
  })
}

describe('primary selection region', () => {
  it('offers all 12 chromatic roots as buttons, never a dropdown (S1b, E2a)', () => {
    renderSelectionRegion()
    expect(radios('Root note')).toHaveLength(12)
    expect(container.querySelector('select')).toBeNull()
    clickRadio(rootRadio('A'))
    expect(useSelectionStore.getState().selection.root).toBe(9)
  })

  it('names each accidental root button with both enharmonic spellings (S1b)', () => {
    renderSelectionRegion()
    expect(rootRadio('C♯ or D♭')).toBeTruthy()
    expect(rootRadio('A♯ or B♭')).toBeTruthy()
    expect(radios('Root note')[0].getAttribute('aria-label')).toBe('C')
  })

  it('changes root and re-renders the keyboard highlight set immediately (S1b)', () => {
    renderSelectionRegion()
    expect(keyStates()[48]).toBe('root') // C before
    clickRadio(rootRadio('A'))
    const states = keyStates()
    expect(states[57]).toBe('root') // A3
    expect(states[61]).toBe('shared') // C♯4 is in both the A chord and the A major scale
    expect(states[48]).toBe('plain') // C natural is not in A major
  })

  it('one root drives both the chord and the scale (S1b)', () => {
    renderSelectionRegion()
    clickRadio(rootRadio('A'))
    const states = keyStates()
    expect(states[57]).toBe('root')
    expect(states[59]).toBe('scale-note') // B is in the A major scale, not the A chord
  })

  it('the view choice sets what the screen shows (S1a)', () => {
    renderSelectionRegion()
    expect(keyStates()[50]).toBe('scale-note') // D is a scale note of C major in 'both'
    clickRadio(segRadio('Show on piano', 'Chord'))
    expect(useSelectionStore.getState().selection.viewMode).toBe('chord')
    const states = keyStates()
    expect(states[50]).toBe('plain') // scale-only tones drop out in chord view
    expect(states[52]).toBe('chord-tone')
  })

  it('offers Chord, Scale, and Both (S1a)', () => {
    renderSelectionRegion()
    expect(radios('Show on piano').map((r) => r.textContent)).toEqual(['Chord', 'Scale', 'Both'])
  })

  it('offers only as many inversions as the current chord quality has (S1c)', () => {
    renderSelectionRegion()
    expect(radios('Inversion')).toHaveLength(3) // major triad: Root, 1st, 2nd
    act(() => useSelectionStore.getState().setQuality('7'))
    expect(radios('Inversion')).toHaveLength(4) // dominant 7th: 4 distinct tones
    clickRadio(segRadio('Inversion', '2nd'))
    expect(useSelectionStore.getState().selection.inversion).toBe(2)
  })

  it('explains what inversion does without leaving the control (S1c)', () => {
    renderSelectionRegion()
    const hint = container.querySelector('.inversion-seg .seg-hint-text')
    expect(hint?.textContent).toBe('Changes which chord note is lowest.')
  })

  it('offers Close, Open, and Left/Right hands voicing, independent of inversion', () => {
    renderSelectionRegion()
    expect(radios('Voicing').map((o) => o.textContent)).toEqual(['Close', 'Open', 'Left/Right hands'])
    clickRadio(segRadio('Voicing', 'Left/Right hands'))
    expect(useSelectionStore.getState().selection.voicingType).toBe('leftRight')
    clickRadio(segRadio('Inversion', '1st'))
    expect(useSelectionStore.getState().selection.inversion).toBe(1)
    expect(useSelectionStore.getState().selection.voicingType).toBe('leftRight')
  })
})

describe('keyboard and screen-reader behaviour (S5b, E6b)', () => {
  function press(el: HTMLElement, key: string) {
    act(() => {
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    })
  }

  it('moves within the root group under the arrow keys, and wraps at the ends', () => {
    renderSelectionRegion()
    const selected = () => radios('Root note').find((r) => r.getAttribute('aria-checked') === 'true')!

    press(selected(), 'ArrowRight')
    expect(useSelectionStore.getState().selection.root).toBe(1)
    press(selected(), 'ArrowLeft')
    expect(useSelectionStore.getState().selection.root).toBe(0)
    press(selected(), 'ArrowLeft') // wraps to B
    expect(useSelectionStore.getState().selection.root).toBe(11)
    press(selected(), 'Home')
    expect(useSelectionStore.getState().selection.root).toBe(0)
    press(selected(), 'End')
    expect(useSelectionStore.getState().selection.root).toBe(11)
  })

  it('moves within the view and inversion groups under the arrow keys', () => {
    renderSelectionRegion()
    const viewSelected = () => radios('Show on piano').find((r) => r.getAttribute('aria-checked') === 'true')!
    press(viewSelected(), 'ArrowRight')
    expect(useSelectionStore.getState().selection.viewMode).toBe('chord')

    act(() => useSelectionStore.getState().setQuality('7'))
    const invSelected = () => radios('Inversion').find((r) => r.getAttribute('aria-checked') === 'true')!
    press(invSelected(), 'ArrowRight')
    expect(useSelectionStore.getState().selection.inversion).toBe(1)
    press(invSelected(), 'End')
    expect(useSelectionStore.getState().selection.inversion).toBe(3)
  })

  it("keeps each group's arrow keys inside its own group", () => {
    renderSelectionRegion()
    const before = useSelectionStore.getState().selection
    const viewSelected = radios('Show on piano').find((r) => r.getAttribute('aria-checked') === 'true')!
    press(viewSelected, 'ArrowRight')
    const after = useSelectionStore.getState().selection
    // Only the view moved; the root and inversion are untouched.
    expect(after.root).toBe(before.root)
    expect(after.inversion).toBe(before.inversion)
    expect(after.viewMode).not.toBe(before.viewMode)
  })

  it('keeps exactly one option per group in the tab order, so focus is visible where it lands', () => {
    renderSelectionRegion()
    for (const label of ['Show on piano', 'Root note', 'Inversion']) {
      const tabbable = radios(label).filter((r) => r.tabIndex === 0)
      expect(tabbable, label).toHaveLength(1)
      expect(tabbable[0].getAttribute('aria-checked'), label).toBe('true')
    }
  })
})
