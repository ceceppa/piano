import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type * as AudioEngineModule from './audioEngine'

class FakePiano {
  static instances: FakePiano[] = []
  loaded = false
  maxPolyphony = 32
  options: unknown
  keyDown = vi.fn()
  keyUp = vi.fn()
  toDestination = vi.fn(function (this: FakePiano) {
    return this
  })
  load = vi.fn(function (this: FakePiano) {
    this.loaded = true
    return Promise.resolve()
  })
  constructor(options: unknown) {
    this.options = options
    FakePiano.instances.push(this)
  }
}

const toneStart = vi.fn(() => Promise.resolve())

vi.mock('@tonejs/piano/build/piano/Piano', () => ({ Piano: FakePiano }))
vi.mock('tone', () => ({ start: () => toneStart() }))

let audioEngine: typeof AudioEngineModule
let realAudioContext: typeof window.AudioContext | undefined

beforeEach(async () => {
  FakePiano.instances = []
  toneStart.mockClear()
  // audioEngine feature-detects a real browser audio environment before
  // eagerly constructing the (here, mocked) Piano — jsdom has none, so stub
  // its presence, same as a real browser would provide.
  realAudioContext = window.AudioContext
  ;(window as unknown as { AudioContext?: unknown }).AudioContext = function () {} as unknown as typeof AudioContext
  vi.resetModules()
  audioEngine = await import('./audioEngine')
})

afterEach(() => {
  ;(window as unknown as { AudioContext?: unknown }).AudioContext = realAudioContext
  vi.restoreAllMocks()
})

function piano(): FakePiano {
  return FakePiano.instances[0]
}

describe('audioEngine sampled piano', () => {
  it('starts loading the self-hosted sample set eagerly, before any gesture', () => {
    expect(FakePiano.instances).toHaveLength(1)
    expect(piano().load).toHaveBeenCalled()
    expect((piano().options as { url: string }).url).toBe('/piano-samples/')
  })

  it('does not play a note before init() has run', () => {
    audioEngine.noteOn(60)
    expect(piano().keyDown).not.toHaveBeenCalled()
  })

  it('init() starts Tone and resolves once the sample set is loaded', async () => {
    await audioEngine.init()
    expect(toneStart).toHaveBeenCalled()
    expect(audioEngine.isReady()).toBe(true)
  })

  it('init() is idempotent — Tone.start() runs once', async () => {
    await audioEngine.init()
    await audioEngine.init()
    expect(toneStart).toHaveBeenCalledTimes(1)
  })

  it('noteOn plays a key and noteOff releases it, tracking held notes', async () => {
    await audioEngine.init()
    audioEngine.noteOn(60)
    expect(piano().keyDown).toHaveBeenCalledWith({ midi: 60 })
    expect(audioEngine.activeVoices()).toBe(1)
    audioEngine.noteOff(60)
    expect(piano().keyUp).toHaveBeenCalledWith({ midi: 60 })
    expect(audioEngine.activeVoices()).toBe(0)
  })

  it('plays multiple keys simultaneously (polyphony)', async () => {
    await audioEngine.init()
    audioEngine.noteOn(60)
    audioEngine.noteOn(64)
    audioEngine.noteOn(67)
    expect(audioEngine.activeVoices()).toBe(3)
    audioEngine.noteOff(64)
    expect(audioEngine.activeVoices()).toBe(2)
  })
})

describe('audioEngine playback scheduling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function downCalls(): number[] {
    return piano().keyDown.mock.calls.map((c) => (c[0] as { midi: number }).midi)
  }

  it('playChord starts every voice of the chord together', async () => {
    await audioEngine.init()
    audioEngine.playChord([48, 52, 55, 59])
    vi.advanceTimersByTime(0)
    expect(downCalls()).toEqual([48, 52, 55, 59])
    expect(audioEngine.getPlaybackState()).toBe('playing')
    vi.advanceTimersByTime(2550)
    expect(audioEngine.getPlaybackState()).toBe('idle')
  })

  it('playArpeggio starts notes low to high at ~120ms apart', async () => {
    await audioEngine.init()
    audioEngine.playArpeggio([48, 52, 55])
    expect(audioEngine.getPlaybackState()).toBe('playing')
    vi.advanceTimersByTime(119)
    expect(downCalls()).toEqual([48])
    vi.advanceTimersByTime(1)
    expect(downCalls()).toEqual([48, 52])
    vi.advanceTimersByTime(120)
    expect(downCalls()).toEqual([48, 52, 55])
  })

  it('playScale ascends then descends', async () => {
    await audioEngine.init()
    audioEngine.playScale([48, 50, 52, 53, 55, 57, 59])
    vi.advanceTimersByTime(200 * 13)
    expect(downCalls()).toEqual([48, 50, 52, 53, 55, 57, 59, 57, 55, 53, 52, 50, 48])
  })

  it('starting a new playback supersedes the current one', async () => {
    await audioEngine.init()
    audioEngine.playChord([48, 52, 55])
    expect(audioEngine.getPlaybackState()).toBe('playing')
    audioEngine.playArpeggio([60])
    expect(audioEngine.getPlaybackState()).toBe('playing')
    vi.advanceTimersByTime(0)
    expect(downCalls()).toEqual([60])
  })
})
