/**
 * audioEngine — Web Audio voice pool for keyboard play.
 * Browser-only, no React. Operates on MIDI note numbers.
 *
 * Contract (tech-spec §Public / integration interface contracts):
 *  - init(): Promise<void>  lazily creates + resumes the shared AudioContext;
 *    must be called from a user gesture (autoplay policy).
 *  - noteOn(midi): plays immediately; silently no-ops if not initialised or
 *    the context is not running.
 *  - noteOff(midi): releases the playing voice for that pitch.
 */

const POOL_SIZE = 16
const ATTACK_S = 0.008
const RELEASE_S = 0.12

interface Voice {
  midi: number | null
  osc: OscillatorNode | null
  gain: GainNode | null
  startedAt: number
}

let ctx: AudioContext | null = null
const voices: Voice[] = []

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

function currentTime(): number {
  return ctx ? ctx.currentTime : 0
}

function makeNodes(): { osc: OscillatorNode; gain: GainNode } {
  const osc = ctx!.createOscillator()
  const gain = ctx!.createGain()
  osc.type = 'triangle'
  osc.connect(gain)
  gain.connect(ctx!.destination)
  return { osc, gain }
}

function disposeNodes(voice: Voice) {
  if (voice.osc) {
    try {
      voice.osc.stop()
    } catch {
      /* already stopped */
    }
    try {
      voice.osc.disconnect()
    } catch {
      /* already disconnected */
    }
  }
  if (voice.gain) {
    try {
      voice.gain.disconnect()
    } catch {
      /* already disconnected */
    }
  }
  voice.osc = null
  voice.gain = null
}

function acquireVoice(): Voice | null {
  if (!ctx || ctx.state !== 'running') return null
  const free = voices.find((v) => v.midi === null)
  if (free) return free
  if (voices.length < POOL_SIZE) {
    const voice: Voice = { midi: null, osc: null, gain: null, startedAt: 0 }
    voices.push(voice)
    return voice
  }
  // Steal the oldest voice so polyphony stays bounded.
  let oldest = voices[0]
  for (const v of voices) if (v.startedAt < oldest.startedAt) oldest = v
  disposeNodes(oldest)
  oldest.midi = null
  return oldest
}

export async function init(): Promise<void> {
  if (typeof window === 'undefined') throw new Error('audioEngine requires a browser')
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) throw new Error('Web Audio API is not supported in this browser')
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') await ctx.resume()
}

export function isReady(): boolean {
  return ctx !== null && ctx.state === 'running'
}

export function noteOn(midi: number): void {
  allocateVoice(midi)
}

function allocateVoice(midi: number): Voice | null {
  if (!ctx || ctx.state !== 'running') return null
  const voice = acquireVoice()
  if (!voice) return null
  disposeNodes(voice)
  const { osc, gain } = makeNodes()
  osc.frequency.setValueAtTime(midiToFrequency(midi), currentTime())
  gain.gain.setValueAtTime(0.0001, currentTime())
  gain.gain.exponentialRampToValueAtTime(0.4, currentTime() + ATTACK_S)
  osc.start(currentTime())
  voice.osc = osc
  voice.gain = gain
  voice.midi = midi
  voice.startedAt = currentTime()
  return voice
}

export function noteOff(midi: number): void {
  if (!ctx) return
  // Release the most recent press for this pitch; others stay sounding.
  let target: Voice | null = null
  for (const v of voices) {
    if (v.midi === midi && (!target || v.startedAt > target.startedAt)) target = v
  }
  if (!target) return
  releaseVoice(target)
}

export function activeVoices(): number {
  return voices.reduce((n, v) => n + (v.midi !== null ? 1 : 0), 0)
}

export function poolSize(): number {
  return voices.length
}

// ---- Playback actions -------------------------------------------------------
// Contract (tech-spec §Public / integration interface contracts):
//   playChord(voice)     ~2.5s held; stops current playback; exact voicing
//   playArpeggio(voice)  ~120ms per note, low to high
//   playScale(scale, pattern='updown')  ~200ms per note, ascending then descending

const CHORD_HOLD_MS = 2500
const ARPEGGIO_MS = 120
const SCALE_MS = 200

export type PlaybackState = 'idle' | 'playing'

interface PlaybackEvent {
  atMs: number
  midi: number
  on: boolean
}

let playbackTimers: ReturnType<typeof setTimeout>[] = []
let playbackState: PlaybackState = 'idle'
let playbackListener: ((state: PlaybackState) => void) | null = null
let stateTimer: ReturnType<typeof setTimeout> | null = null
const playbackVoices: Set<Voice> = new Set()

function setPlaybackState(state: PlaybackState) {
  playbackState = state
  if (playbackListener) playbackListener(state)
}

export function getPlaybackState(): PlaybackState {
  return playbackState
}

export function setPlaybackListener(listener: ((state: PlaybackState) => void) | null): void {
  playbackListener = listener
}

function schedulePlaybackNote(ev: PlaybackEvent) {
  if (ev.on) {
    const voice = allocateVoice(ev.midi)
    if (voice) playbackVoices.add(voice)
  } else {
    releasePlaybackVoice(ev.midi)
  }
}

function releasePlaybackVoice(midi: number) {
  let target: Voice | null = null
  for (const v of playbackVoices) {
    if (v.midi === midi && (!target || v.startedAt > target.startedAt)) target = v
  }
  if (!target) return
  playbackVoices.delete(target)
  releaseVoice(target)
}

function releaseVoice(voice: Voice) {
  if (voice.midi === null) return
  const { osc, gain } = voice
  if (!osc || !gain) return
  const t = currentTime()
  try {
    gain.gain.cancelScheduledValues(t)
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + RELEASE_S)
    osc.stop(t + RELEASE_S + 0.05)
  } catch {
    /* voice already torn down */
  }
  voice.midi = null
}

export function schedulePlayback(events: PlaybackEvent[]) {
  stopPlayback()
  if (events.length === 0 || !isReady()) return
  const endMs = events.reduce((max, e) => Math.max(max, e.atMs), 0) + 50
  setPlaybackState('playing')
  stateTimer = setTimeout(() => setPlaybackState('idle'), endMs)
  for (const ev of events) {
    const timer = setTimeout(() => schedulePlaybackNote(ev), ev.atMs)
    playbackTimers.push(timer)
  }
}

export function playChord(voice: number[]) {
  if (!isReady()) return
  const events: PlaybackEvent[] = []
  for (const midi of voice) {
    events.push({ atMs: 0, midi, on: true })
    events.push({ atMs: CHORD_HOLD_MS, midi, on: false })
  }
  schedulePlayback(events)
}

export function playArpeggio(voice: number[]) {
  if (!isReady()) return
  const events: PlaybackEvent[] = []
  for (let i = 0; i < voice.length; i++) {
    events.push({ atMs: i * ARPEGGIO_MS, midi: voice[i], on: true })
    events.push({ atMs: (i + 1) * ARPEGGIO_MS, midi: voice[i], on: false })
  }
  schedulePlayback(events)
}

export function playScale(scale: number[], pattern: 'updown' | 'up' = 'updown') {
  if (!isReady()) return
  const notes = pattern === 'updown' ? [...scale, ...[...scale].reverse().slice(1)] : [...scale]
  const events: PlaybackEvent[] = []
  for (let i = 0; i < notes.length; i++) {
    events.push({ atMs: i * SCALE_MS, midi: notes[i], on: true })
    events.push({ atMs: (i + 1) * SCALE_MS, midi: notes[i], on: false })
  }
  schedulePlayback(events)
}

export function stopPlayback() {
  for (const t of playbackTimers) clearTimeout(t)
  playbackTimers = []
  if (stateTimer) {
    clearTimeout(stateTimer)
    stateTimer = null
  }
  if (playbackState === 'playing') setPlaybackState('idle')
  for (const voice of [...playbackVoices]) {
    playbackVoices.delete(voice)
    releaseVoice(voice)
  }
}