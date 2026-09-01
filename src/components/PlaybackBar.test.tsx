import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { rootPositionVoice } from '../musicCore'
import PlaybackBar from './PlaybackBar'
import { useSelectionStore } from '../store/useSelectionStore'
import * as audioEngine from '../audioEngine'

vi.mock('../audioEngine', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../audioEngine')>()
  return {
    ...actual,
    init: vi.fn(() => Promise.resolve()),
    playChord: vi.fn(),
    playArpeggio: vi.fn(),
    playScale: vi.fn(),
    stopPlayback: vi.fn(),
    setPlaybackListener: vi.fn(),
  }
})

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

function renderBar() {
  act(() => {
    root.render(<PlaybackBar />)
  })
}

function clickButton(label: string) {
  const button = [...container.querySelectorAll('button')].find((b) => b.textContent === label)
  if (!button) throw new Error(`no button labelled "${label}"`)
  act(() => {
    button.click()
  })
}

function buttonLabels(): string[] {
  return [...container.querySelectorAll('button')].map((b) => b.textContent ?? '')
}

function setView(viewMode: 'chord' | 'scale' | 'both') {
  act(() => useSelectionStore.getState().setViewMode(viewMode))
}

describe('PlaybackBar actions', () => {
  it('gives each view one primary action naming what it plays (S4c, E5a)', () => {
    setView('chord')
    renderBar()
    expect(container.querySelector('.playback-primary')?.textContent).toBe('Hear C')

    setView('scale')
    expect(container.querySelector('.playback-primary')?.textContent).toBe('Hear C major scale')

    setView('both')
    expect(container.querySelector('.playback-primary')?.textContent).toBe('Hear C')
  })

  it('changes the secondary action with the view (S4c)', () => {
    setView('chord')
    renderBar()
    expect(container.querySelector('.playback-secondary')?.textContent).toBe('Play as arpeggio')

    setView('scale')
    expect(container.querySelector('.playback-secondary')?.textContent).toBe('Play descending')

    setView('both')
    expect(container.querySelector('.playback-secondary')?.textContent).toBe('Hear C major scale')
  })

  it('plays the exact displayed voicing from the primary action (E5a)', async () => {
    setView('chord')
    renderBar()
    await act(async () => clickButton('Hear C'))
    expect(audioEngine.playChord).toHaveBeenCalledWith(rootPositionVoice({ root: 0, quality: 'major' }))
  })

  it('plays the updated chord after a selection change (E5a)', async () => {
    act(() => {
      useSelectionStore.getState().setRoot(9)
      useSelectionStore.getState().setQuality('m7')
    })
    setView('chord')
    renderBar()
    await act(async () => clickButton('Hear Am7'))
    expect(audioEngine.playChord).toHaveBeenCalledWith(rootPositionVoice({ root: 9, quality: 'm7' }))
  })

  it('plays the exact selected inversion, not the root-position chord (E5a)', async () => {
    act(() => {
      useSelectionStore.getState().setQuality('7')
      useSelectionStore.getState().setInversion(1) // C7/E
    })
    setView('chord')
    renderBar()
    await act(async () => clickButton('Hear C7'))
    expect(audioEngine.playChord).toHaveBeenCalledWith([52, 55, 58, 60])
    expect(audioEngine.playChord).not.toHaveBeenCalledWith(rootPositionVoice({ root: 0, quality: '7' }))
  })

  it('plays the exact selected voicing together with the selected inversion (E5a)', async () => {
    act(() => {
      useSelectionStore.getState().setInversion(0)
      useSelectionStore.getState().setVoicingType('leftRight')
    })
    setView('chord')
    renderBar()
    await act(async () => clickButton('Hear C'))
    expect(audioEngine.playChord).toHaveBeenCalledWith([36, 52, 55])
  })

  it('arpeggiates the same voice set from the Chord view secondary action (S4c)', async () => {
    setView('chord')
    renderBar()
    await act(async () => clickButton('Play as arpeggio'))
    expect(audioEngine.playArpeggio).toHaveBeenCalledWith(rootPositionVoice({ root: 0, quality: 'major' }))
  })

  it('plays the displayed scale from the Scale view primary action (E5a)', async () => {
    setView('scale')
    renderBar()
    await act(async () => clickButton('Hear C major scale'))
    expect(audioEngine.playScale).toHaveBeenCalledWith([48, 50, 52, 53, 55, 57, 59])
  })

  it('plays the scale descending from the Scale view secondary action (S4c)', async () => {
    setView('scale')
    renderBar()
    await act(async () => clickButton('Play descending'))
    expect(audioEngine.playScale).toHaveBeenCalledWith([48, 50, 52, 53, 55, 57, 59], 'down')
  })

  it('plays the chosen scale on the shared root, whatever the chord quality is (E5a)', async () => {
    act(() => {
      useSelectionStore.getState().setRoot(9) // A
      useSelectionStore.getState().setQuality('7')
      useSelectionStore.getState().setScaleType('naturalMinor')
    })
    setView('scale')
    renderBar()
    await act(async () => clickButton('Hear A natural minor scale'))
    // A natural minor: A, B, C, D, E, F, G — the chord quality does not change it.
    expect(audioEngine.playScale).toHaveBeenCalledWith([57, 59, 48, 50, 52, 53, 55])
  })

  it('plays the displayed chord from the Both view primary action (E5a)', async () => {
    setView('both')
    renderBar()
    await act(async () => clickButton('Hear C'))
    expect(audioEngine.playChord).toHaveBeenCalledWith(rootPositionVoice({ root: 0, quality: 'major' }))
    await act(async () => clickButton('Hear C major scale'))
    expect(audioEngine.playScale).toHaveBeenCalledWith([48, 50, 52, 53, 55, 57, 59])
  })

  it('calls init() from the gesture before playback', () => {
    setView('chord')
    renderBar()
    clickButton('Hear C')
    expect(audioEngine.init).toHaveBeenCalled()
  })
})

describe('PlaybackBar status and Chord options', () => {
  it('shows no static Ready label, and announces playing as text (S4c)', async () => {
    renderBar()
    const status = container.querySelector('[role="status"]')!
    expect(status.getAttribute('aria-live')).toBe('polite')
    expect(status.textContent).toBe('')
    await act(async () => {
      ;(audioEngine.setPlaybackListener as ReturnType<typeof vi.fn>).mock.calls.at(-1)![0]('playing')
    })
    expect(container.querySelector('[role="status"]')?.textContent).toBe('Playing…')
  })

  it('captions the current arrangement in the Ready label\u2019s place (S4c)', () => {
    setView('chord')
    renderBar()
    expect(container.querySelector('.playback-summary')?.textContent).toBe('Close voicing · both hands')
    act(() => useSelectionStore.getState().setVoicingType('leftRight'))
    expect(container.querySelector('.playback-summary')?.textContent).toBe('Left and right hands')
  })

  it('offers Chord options in Chord and Both views only (S4c)', () => {
    setView('chord')
    renderBar()
    expect(buttonLabels()).toContain('Chord options')
    setView('both')
    expect(buttonLabels()).toContain('Chord options')
    setView('scale')
    expect(buttonLabels()).not.toContain('Chord options')
  })

  it('opens voicing and hand arrangement, and returns focus on close (S4c, E5b)', () => {
    setView('chord')
    renderBar()
    const trigger = [...container.querySelectorAll('button')].find(
      (b) => b.textContent === 'Chord options',
    )!
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(container.querySelector('[role="dialog"]')).toBeNull()

    act(() => trigger.click())
    const panel = container.querySelector('[role="dialog"]')!
    expect(panel.getAttribute('aria-label')).toBe('Chord options')
    const options = [...panel.querySelectorAll('[role="radio"]')].map((o) => o.textContent)
    expect(options).toEqual(['Close', 'Open', 'Left/Right hands'])

    // Changing the arrangement updates the store, so keyboard and playback follow.
    act(() => {
      ;[...panel.querySelectorAll<HTMLButtonElement>('[role="radio"]')]
        .find((o) => o.textContent === 'Left/Right hands')!
        .click()
    })
    expect(useSelectionStore.getState().selection.voicingType).toBe('leftRight')

    act(() => {
      ;[...container.querySelectorAll('button')].find((b) => b.textContent === 'Done')!.click()
    })
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(
      [...container.querySelectorAll('button')].find((b) => b.textContent === 'Chord options'),
    )
  })

  it('closes on Escape and returns focus to the control that opened it (E5b)', () => {
    setView('chord')
    renderBar()
    const trigger = [...container.querySelectorAll('button')].find(
      (b) => b.textContent === 'Chord options',
    )!
    act(() => trigger.click())
    expect(container.querySelector('[role="dialog"]')).not.toBeNull()
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(
      [...container.querySelectorAll('button')].find((b) => b.textContent === 'Chord options'),
    )
  })

  it('exposes a Stop control while playing', async () => {
    renderBar()
    expect(buttonLabels()).not.toContain('Stop')
    await act(async () => {
      ;(audioEngine.setPlaybackListener as ReturnType<typeof vi.fn>).mock.calls.at(-1)![0]('playing')
    })
    expect(buttonLabels()).toContain('Stop')
    act(() => {
      ;[...container.querySelectorAll('button')].find((b) => b.textContent === 'Stop')!.click()
    })
    expect(audioEngine.stopPlayback).toHaveBeenCalled()
  })
})
