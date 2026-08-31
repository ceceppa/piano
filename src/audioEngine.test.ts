import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type * as AudioEngineModule from './audioEngine'

class FakeParam {
  value = 0
  setValueAtTime = vi.fn((v: number) => {
    this.value = v
  })
  exponentialRampToValueAtTime = vi.fn()
  cancelScheduledValues = vi.fn()
}

class FakeOscillator {
  type = ''
  frequency = new FakeParam()
  started = false
  stopped = false
  connect = vi.fn(() => new FakeGain())
  start = vi.fn(() => {
    this.started = true
  })
  stop = vi.fn(() => {
    this.stopped = true
  })
  disconnect = vi.fn()
}

class FakeGain {
  gain = new FakeParam()
  connect = vi.fn()
  disconnect = vi.fn()
}

class FakeAudioContext {
  static instances: FakeAudioContext[] = []
  state: 'suspended' | 'running' = 'suspended'
  currentTime = 0
  destination = {}
  oscillators: FakeOscillator[] = []
  resume = vi.fn(() => {
    this.state = 'running'
    return Promise.resolve()
  })
  createOscillator = vi.fn(() => {
    const osc = new FakeOscillator()
    this.oscillators.push(osc)
    return osc
  })
  createGain = vi.fn(() => new FakeGain())
  constructor() {
    FakeAudioContext.instances.push(this)
  }
}

let realCtor: typeof AudioContext | undefined
let audioEngine: typeof AudioEngineModule

beforeEach(async () => {
  FakeAudioContext.instances = []
  realCtor = window.AudioContext
  ;(window as unknown as { AudioContext?: unknown }).AudioContext = FakeAudioContext
  vi.resetModules()
  audioEngine = await import('./audioEngine')
})

afterEach(() => {
  ;(window as unknown as { AudioContext?: unknown }).AudioContext = realCtor
  vi.restoreAllMocks()
})

describe('audioEngine voice pool', () => {
  it('does not create an AudioContext before a user gesture init()', () => {
    expect(FakeAudioContext.instances).toHaveLength(0)
    audioEngine.noteOn(60)
    expect(FakeAudioContext.instances).toHaveLength(0)
  })

  it('creates and resumes the shared AudioContext on init()', async () => {
    await audioEngine.init()
    expect(FakeAudioContext.instances).toHaveLength(1)
    expect(FakeAudioContext.instances[0].resume).toHaveBeenCalled()
  })

  it('init() is idempotent — reuses the same context', async () => {
    await audioEngine.init()
    await audioEngine.init()
    expect(FakeAudioContext.instances).toHaveLength(1)
  })

  it('noteOn allocates a voice and noteOff releases it, reusing the pool', async () => {
    await audioEngine.init()
    audioEngine.noteOn(60)
    expect(audioEngine.activeVoices()).toBe(1)
    audioEngine.noteOff(60)
    expect(audioEngine.activeVoices()).toBe(0)
    audioEngine.noteOn(60)
    expect(audioEngine.activeVoices()).toBe(1)
    expect(audioEngine.poolSize()).toBeLessThanOrEqual(16)
  })

  it('plays multiple keys simultaneously (polyphony)', async () => {
    await audioEngine.init()
    audioEngine.noteOn(60)
    audioEngine.noteOn(64)
    audioEngine.noteOn(67)
    expect(audioEngine.activeVoices()).toBe(3)
    audioEngine.noteOff(64)
    expect(audioEngine.activeVoices()).toBe(2)
    audioEngine.noteOff(60)
    expect(audioEngine.activeVoices()).toBe(1)
    audioEngine.noteOff(67)
    expect(audioEngine.activeVoices()).toBe(0)
  })

  it('releasing one note leaves other held notes sounding', async () => {
    await audioEngine.init()
    audioEngine.noteOn(60)
    audioEngine.noteOn(67)
    audioEngine.noteOff(60)
    expect(audioEngine.activeVoices()).toBe(1)
  })

  it('routes the frequency set from the MIDI pitch', async () => {
    await audioEngine.init()
    audioEngine.noteOn(69) // A4 = 440 Hz
    const ctx = FakeAudioContext.instances[0]
    expect(ctx.oscillators[0].frequency.value).toBe(440)
  })
})

describe('audioEngine playback scheduling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  async function initWithFakeTimers() {
    await audioEngine.init()
  }

  function createdNotes(): number[] {
    const ctx = FakeAudioContext.instances[0]
    return ctx.oscillators.map((o) => o.frequency.value)
  }

  it('playChord starts every voice of the chord together', async () => {
    await initWithFakeTimers()
    audioEngine.playChord([48, 52, 55, 59])
    vi.advanceTimersByTime(0)
    expect(createdNotes()).toEqual([48, 52, 55, 59].map((m) => audioEngine.midiToFrequency(m)))
    expect(audioEngine.getPlaybackState()).toBe('playing')
    vi.advanceTimersByTime(2550)
    expect(audioEngine.getPlaybackState()).toBe('idle')
  })

  it('playArpeggio starts notes low to high at ~120ms apart', async () => {
    await initWithFakeTimers()
    audioEngine.playArpeggio([48, 52, 55])
    expect(audioEngine.getPlaybackState()).toBe('playing')
    vi.advanceTimersByTime(119)
    expect(createdNotes()).toEqual([audioEngine.midiToFrequency(48)])
    vi.advanceTimersByTime(1)
    expect(createdNotes()).toEqual([48, 52].map((m) => audioEngine.midiToFrequency(m)))
    vi.advanceTimersByTime(120)
    expect(createdNotes()).toEqual([48, 52, 55].map((m) => audioEngine.midiToFrequency(m)))
  })

  it('playScale ascends then descends', async () => {
    await initWithFakeTimers()
    audioEngine.playScale([48, 50, 52, 53, 55, 57, 59])
    vi.advanceTimersByTime(200 * 13)
    expect(createdNotes()).toEqual([48, 50, 52, 53, 55, 57, 59, 57, 55, 53, 52, 50, 48].map((m) => audioEngine.midiToFrequency(m)))
  })

  it('starting a new playback supersedes the current one', async () => {
    await initWithFakeTimers()
    audioEngine.playChord([48, 52, 55])
    expect(audioEngine.getPlaybackState()).toBe('playing')
    audioEngine.playArpeggio([60])
    expect(audioEngine.getPlaybackState()).toBe('playing')
    vi.advanceTimersByTime(0)
    expect(createdNotes()).toEqual([audioEngine.midiToFrequency(60)])
  })
})