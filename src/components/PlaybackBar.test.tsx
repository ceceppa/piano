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

describe('PlaybackBar', () => {
  it('calls playChord with the exact displayed voicing', async () => {
    renderBar()
    await act(async () => clickButton('Play chord'))
    expect(audioEngine.playChord).toHaveBeenCalledWith(rootPositionVoice({ root: 0, quality: 'major' }))
  })

  it('calls playChord with the updated voicing after a selection change', async () => {
    act(() => {
      useSelectionStore.getState().setRoot(9)
      useSelectionStore.getState().setQuality('m7')
    })
    renderBar()
    await act(async () => clickButton('Play chord'))
    expect(audioEngine.playChord).toHaveBeenCalledWith(rootPositionVoice({ root: 9, quality: 'm7' }))
  })

  it('calls playArpeggio with the same voice set', async () => {
    renderBar()
    await act(async () => clickButton('Arpeggiate'))
    expect(audioEngine.playArpeggio).toHaveBeenCalledWith(rootPositionVoice({ root: 0, quality: 'major' }))
  })

  it('calls playScale with the displayed scale mapped to the MIDI band', async () => {
    renderBar()
    await act(async () => clickButton('Play scale'))
    expect(audioEngine.playScale).toHaveBeenCalledWith([48, 50, 52, 53, 55, 57, 59])
  })

  it('calls init() from the gesture before playback', async () => {
    renderBar()
    clickButton('Play chord')
    expect(audioEngine.init).toHaveBeenCalled()
  })

  it('renders a non-colour playback state indicator', () => {
    renderBar()
    expect(container.querySelector('[role="status"]')?.textContent).toBe('Ready')
  })

  it('exposes a Stop control while playing', async () => {
    renderBar()
    expect([...container.querySelectorAll('button')].find((b) => b.textContent === 'Stop')).toBeUndefined()
    await act(async () => {
      ;(audioEngine.setPlaybackListener as ReturnType<typeof vi.fn>).mock.calls.at(-1)![0]('playing')
    })
    const stop = [...container.querySelectorAll('button')].find((b) => b.textContent === 'Stop')
    expect(stop).toBeTruthy()
    act(() => {
      stop!.click()
    })
    expect(audioEngine.stopPlayback).toHaveBeenCalled()
  })
})