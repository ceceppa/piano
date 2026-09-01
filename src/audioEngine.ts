/**
 * audioEngine — Tone.js sampled piano playback (@tonejs/piano, self-hosted samples).
 * Browser-only, no React. Operates on MIDI note numbers.
 *
 * Contract (tech-spec §Public / integration interface contracts):
 *  - init(): Promise<void>  resolves once Tone.start() has run (on a user
 *    gesture) and the self-hosted sample set has loaded.
 *  - noteOn(midi): plays immediately; silently no-ops if not initialised or
 *    the sample set has not finished loading.
 *  - noteOff(midi): releases the playing note for that pitch.
 */

import * as Tone from 'tone'
// Import the Piano class directly, not the package barrel (`@tonejs/piano`):
// the barrel also re-exports `MidiInput`, which pulls in the `webmidi`
// package's Node-only `events` dependency at module-evaluation time and
// crashes in the browser ("Class extends value undefined") even though
// nothing here uses MIDI input.
import { Piano } from '@tonejs/piano/build/piano/Piano'

let piano: Piano | null = null
let loadPromise: Promise<void> = Promise.resolve()
let started = false
const heldNotes = new Set<number>()

function ensurePiano(): Piano {
  if (!piano) {
    piano = new Piano({
      url: '/piano-samples/',
      velocities: 1,
      minNote: 21,
      maxNote: 108,
      release: false,
      pedal: true,
    }).toDestination()
    loadPromise = piano.load()
  }
  return piano
}

function hasAudioContext(): boolean {
  return (
    typeof window !== 'undefined' &&
    (typeof window.AudioContext === 'function' ||
      typeof (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext === 'function')
  )
}

// Sample fetch starts eagerly at module load — a static local asset needs no
// user gesture, so this does not wait for init(). Skipped outside a real
// browser audio environment (e.g. jsdom in tests), which has no AudioContext
// to construct Tone.js nodes against; isReady() stays false there, and every
// playback path already no-ops until it is true.
if (hasAudioContext()) ensurePiano()

export async function init(): Promise<void> {
  if (typeof window === 'undefined') throw new Error('audioEngine requires a browser')
  if (!started) {
    await Tone.start()
    started = true
  }
  await loadPromise
}

export function isReady(): boolean {
  return started && piano !== null && piano.loaded
}

export function noteOn(midi: number): void {
  if (!isReady()) return
  piano!.keyDown({ midi })
  heldNotes.add(midi)
}

export function noteOff(midi: number): void {
  if (!isReady()) return
  piano!.keyUp({ midi })
  heldNotes.delete(midi)
}

export function activeVoices(): number {
  return heldNotes.size
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
const playbackNotes = new Set<number>()

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
  if (!isReady()) return
  if (ev.on) {
    piano!.keyDown({ midi: ev.midi })
    playbackNotes.add(ev.midi)
  } else {
    piano!.keyUp({ midi: ev.midi })
    playbackNotes.delete(ev.midi)
  }
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
  if (piano) {
    for (const midi of [...playbackNotes]) {
      playbackNotes.delete(midi)
      piano.keyUp({ midi })
    }
  }
}
