import { useRef } from 'react'
import { noteName, scaleTones, voice } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import * as audioEngine from '../audioEngine'
import './Keyboard.css'

export type KeyState = 'root' | 'chord-tone' | 'shared' | 'scale-note' | 'plain'

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

/**
 * One key, one role, decided in the order the tech spec fixes
 * (§Keyboard note roles): root, then shared, then chord, then scale.
 */
function classify(
  midi: number,
  root: number,
  voicedMidis: Set<number>,
  scaleSet: Set<number>,
  viewMode: 'chord' | 'scale' | 'both',
  inScaleBand: (midi: number) => boolean,
  scaleBandStart: number,
): KeyState {
  const pc = midi % 12
  // Root/chord-tone marks only the current voicing's exact notes, once
  // (S2b+1, phase-4 correction) — not every octave repeat of the pitch class.
  if (viewMode !== 'scale' && voicedMidis.has(midi)) {
    if (pc === root) return 'root'
    return viewMode === 'both' && scaleSet.has(pc) ? 'shared' : 'chord-tone'
  }
  if (viewMode !== 'chord' && scaleSet.has(pc) && inScaleBand(midi)) {
    // Scale view has no chord to carry the root, so the scale's own root — the
    // key the band starts from — takes it.
    return viewMode === 'scale' && midi === scaleBandStart ? 'root' : 'scale-note'
  }
  return 'plain'
}

export default function Keyboard({ showNoteNames = false }: KeyboardProps) {
  const selection = useSelectionStore((s) => s.selection)
  const storeOctaveStart = useSelectionStore((s) => s.octaveStart)
  const storeOctaveEnd = useSelectionStore((s) => s.octaveEnd)

  const held = useRef<Set<number>>(new Set())

  const { root, quality, scaleType, viewMode, inversion, voicingType } = selection
  const scaleRoot = root
  const scaleSet = new Set(scaleTones(scaleRoot, scaleType))

  // tech-spec §Data model → DisplayRange: the effective low bound relaxes to
  // include the current voicing's bass note, computed fresh — never stored.
  const voicedNotes = voice({ root, quality }, inversion, voicingType)
  const bassMidi = voicedNotes[0]?.midi
  const handByMidi = new Map(voicedNotes.filter((n) => n.hand).map((n) => [n.midi, n.hand]))
  const voicedMidis = new Set(voicedNotes.map((n) => n.midi))
  const topMidi = voicedNotes[voicedNotes.length - 1]?.midi
  const effectiveStart = bassMidi === undefined ? storeOctaveStart : Math.min(storeOctaveStart, bassMidi)
  const effectiveEnd = topMidi === undefined ? storeOctaveEnd : Math.max(storeOctaveEnd, topMidi)

  const midis = keyRange(effectiveStart, effectiveEnd)

  // Scale-tone markers show once, starting from the scale's first visible
  // root note, instead of repeating in every octave (phase-3 review).
  const scaleBandStart = midis.find((m) => m % 12 === scaleRoot) ?? effectiveStart
  const inScaleBand = (midi: number) => midi >= scaleBandStart && midi < scaleBandStart + 12

  const whiteMidis = midis.filter((m) => !isBlack(m))
  const blackMidis = midis.filter(isBlack)
  const whiteCount = whiteMidis.length

  const percentForMidi = (midi: number): number => {
    if (!isBlack(midi)) return (whiteMidis.indexOf(midi) / whiteCount) * 100
    const idx = whiteMidis.findIndex((m) => m > midi) - 1
    return ((idx + 1) / whiteCount) * 100
  }

  const blackLeft = (midi: number): string => `${percentForMidi(midi)}%`

  const blackWidth = (): string => `${(100 / whiteCount) * (2 / 3)}%`

  const keyWidthPercent = 100 / whiteCount
  const handBracket = (hand: 'left' | 'right'): { left: string; width: string } | null => {
    const midisForHand = voicedNotes.filter((n) => n.hand === hand).map((n) => n.midi)
    if (midisForHand.length === 0) return null
    const positions = midisForHand.map(percentForMidi)
    const left = Math.min(...positions)
    const right = Math.max(...positions) + keyWidthPercent
    return { left: `${left}%`, width: `${right - left}%` }
  }

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
    if (state === 'shared') {
      return (
        <span
          className="key-marker marker-shared"
          aria-label={`${midiLabel(midi)} is in both the chord and the scale`}
        />
      )
    }
    if (state === 'scale-note') {
      return (
        <span className="key-marker marker-scale-note" aria-label={`${midiLabel(midi)} is a scale note`} />
      )
    }
    return null
  }

  // No chord-only element in scale view (S4a+1, phase-4 correction): the bass
  // marker, the voiced-note outline, and the hand-grouping strip all follow.
  const showChordElements = viewMode !== 'scale'

  const bassBar = (midi: number) =>
    showChordElements && midi === bassMidi ? (
      <span className="key-marker marker-bass" aria-label={`${midiLabel(midi)} is the bass note`} />
    ) : null

  const leftBracket = handBracket('left')
  const rightBracket = handBracket('right')

  return (
    <div className="keyboard-wrap">
      {voicingType === 'leftRight' && showChordElements && (
        <div className="hand-strip" role="group" aria-label="Hand grouping">
          {leftBracket && (
            <div className="hand-bracket hand-bracket-left" style={leftBracket}>
              <span className="hand-tag">L</span>
            </div>
          )}
          {rightBracket && (
            <div className="hand-bracket hand-bracket-right" style={rightBracket}>
              <span className="hand-tag">R</span>
            </div>
          )}
        </div>
      )}
      <div className="keyboard" role="group" aria-label={`Piano keyboard ${effectiveStart}–${effectiveEnd}`}>
        <div className="keyboard-track">
          <div className="keyboard-whites">
            {whiteMidis.map((midi) => {
              const state: KeyState = classify(midi, root, voicedMidis, scaleSet, viewMode, inScaleBand, scaleBandStart)
              return (
                <button
                  key={midi}
                  type="button"
                  className={`key key-white key-${state}${showChordElements && midi === bassMidi ? ' key-bass' : ''}${showChordElements && voicedMidis.has(midi) ? ' key-voiced' : ''}`}
                  data-midi={midi}
                  data-state={state}
                  data-bass={(showChordElements && midi === bassMidi) || undefined}
                  data-voiced={(showChordElements && voicedMidis.has(midi)) || undefined}
                  data-hand={handByMidi.get(midi)}
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
                  {bassBar(midi)}
                </button>
              )
            })}
          </div>
          <div className="keyboard-blacks">
            {blackMidis.map((midi) => {
              const state: KeyState = classify(midi, root, voicedMidis, scaleSet, viewMode, inScaleBand, scaleBandStart)
              return (
                <button
                  key={midi}
                  type="button"
                  className={`key key-black key-${state}${showChordElements && midi === bassMidi ? ' key-bass' : ''}${showChordElements && voicedMidis.has(midi) ? ' key-voiced' : ''}`}
                  data-midi={midi}
                  data-state={state}
                  data-bass={(showChordElements && midi === bassMidi) || undefined}
                  data-voiced={(showChordElements && voicedMidis.has(midi)) || undefined}
                  data-hand={handByMidi.get(midi)}
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
                  {bassBar(midi)}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}