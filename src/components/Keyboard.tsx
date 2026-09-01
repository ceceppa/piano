import { useRef } from 'react'
import { chordScaleType, chordTones, noteName, scaleTones } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import * as audioEngine from '../audioEngine'
import './Keyboard.css'

export type KeyState = 'root' | 'chord-tone' | 'scale-note' | 'plain'

interface KeyboardProps {
  /** When true, one-time labels on every key (outside the octave-range control). */
  showNoteNames?: boolean
}

const BLACK_OFFSETS_IN_OCTAVE = [1, 3, 6, 8, 10] as const

function midiLabel(midi: number): string {
  return `${noteName(midi % 12)}${Math.floor(midi / 12) - 1}`
}

function isBlack(midi: number): boolean {
  return (BLACK_OFFSETS_IN_OCTAVE as readonly number[]).includes(midi % 12)
}

function keyRange(startMidi: number, endMidi: number): number[] {
  const midis: number[] = []
  for (let m = startMidi; m <= endMidi; m++) midis.push(m)
  return midis
}

function classify(
  pc: number,
  root: number,
  chordSet: Set<number>,
  scaleSet: Set<number>,
  viewMode: 'chord' | 'scale' | 'both',
): KeyState {
  if (pc === root) return 'root'
  if (viewMode !== 'scale' && chordSet.has(pc)) return 'chord-tone'
  if (viewMode !== 'chord' && scaleSet.has(pc)) return 'scale-note'
  return 'plain'
}

export default function Keyboard({ showNoteNames = false }: KeyboardProps) {
  const selection = useSelectionStore((s) => s.selection)
  const storeOctaveStart = useSelectionStore((s) => s.octaveStart)
  const storeOctaveEnd = useSelectionStore((s) => s.octaveEnd)

  const held = useRef<Set<number>>(new Set())

  const { root, quality, key, scaleMode, viewMode } = selection
  const chordSet = new Set(chordTones(root, quality))
  const scaleRoot = scaleMode === 'key' ? key.root : root
  const scaleType = scaleMode === 'key' ? key.scaleType : chordScaleType(quality)
  const scaleSet = new Set(scaleTones(scaleRoot, scaleType))

  const midis = keyRange(storeOctaveStart, storeOctaveEnd)
  const whiteMidis = midis.filter((m) => !isBlack(m))
  const blackMidis = midis.filter(isBlack)
  const whiteCount = whiteMidis.length

  const blackLeft = (midi: number): string => {
    const idx = whiteMidis.findIndex((m) => m > midi) - 1
    return `${((idx + 1) / whiteCount) * 100}%`
  }

  const blackWidth = (): string => `${(100 / whiteCount) * (2 / 3)}%`

  const playNote = (midi: number) => {
    if (held.current.has(midi)) return
    held.current.add(midi)
    void audioEngine.init().then(() => audioEngine.noteOn(midi))
  }

  const stopNote = (midi: number) => {
    if (!held.current.delete(midi)) return
    audioEngine.noteOff(midi)
  }

  const keyHandlers = {
    onPointerDown: (midi: number) => () => playNote(midi),
    onPointerUp: (midi: number) => () => stopNote(midi),
    onPointerCancel: (midi: number) => () => stopNote(midi),
    onPointerLeave: (midi: number) => () => stopNote(midi),
    onKeyDown: (midi: number) => (e: React.KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) playNote(midi)
    },
    onKeyUp: (midi: number) => (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') stopNote(midi)
    },
  }

  const marker = (midi: number, state: KeyState) => {
    if (state === 'root') {
      return (
        <span
          className="key-marker marker-root"
          aria-label={`${midiLabel(midi)} is the chord root`}
        />
      )
    }
    if (state === 'chord-tone') {
      return (
        <span className="key-marker marker-chord-tone" aria-label={`${midiLabel(midi)} is a chord tone`} />
      )
    }
    if (state === 'scale-note') {
      return (
        <span className="key-marker marker-scale-note" aria-label={`${midiLabel(midi)} is a scale note`} />
      )
    }
    return null
  }

  return (
    <div className="keyboard-wrap">
      <div className="keyboard" role="group" aria-label={`Piano keyboard ${storeOctaveStart}–${storeOctaveEnd}`}>
        <div className="keyboard-whites">
          {whiteMidis.map((midi) => {
            const state: KeyState = classify(midi % 12, root, chordSet, scaleSet, viewMode)
            return (
              <button
                key={midi}
                type="button"
                className={`key key-white key-${state}`}
                data-midi={midi}
                data-state={state}
                aria-label={midiLabel(midi)}
                onPointerDown={keyHandlers.onPointerDown(midi)}
                onPointerUp={keyHandlers.onPointerUp(midi)}
                onPointerCancel={keyHandlers.onPointerCancel(midi)}
                onPointerLeave={keyHandlers.onPointerLeave(midi)}
                onKeyDown={keyHandlers.onKeyDown(midi)}
                onKeyUp={keyHandlers.onKeyUp(midi)}
              >
                <span className="key-face" aria-hidden="true">
                  {showNoteNames ? midiLabel(midi) : ''}
                </span>
                {marker(midi, state)}
              </button>
            )
          })}
        </div>
        <div className="keyboard-blacks">
          {blackMidis.map((midi) => {
            const state: KeyState = classify(midi % 12, root, chordSet, scaleSet, viewMode)
            return (
              <button
                key={midi}
                type="button"
                className={`key key-black key-${state}`}
                data-midi={midi}
                data-state={state}
                aria-label={midiLabel(midi)}
                style={{ left: blackLeft(midi), width: blackWidth() }}
                onPointerDown={keyHandlers.onPointerDown(midi)}
                onPointerUp={keyHandlers.onPointerUp(midi)}
                onPointerCancel={keyHandlers.onPointerCancel(midi)}
                onPointerLeave={keyHandlers.onPointerLeave(midi)}
                onKeyDown={keyHandlers.onKeyDown(midi)}
                onKeyUp={keyHandlers.onKeyUp(midi)}
              >
                <span className="key-face" aria-hidden="true">
                  {showNoteNames ? midiLabel(midi) : ''}
                </span>
                {marker(midi, state)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}