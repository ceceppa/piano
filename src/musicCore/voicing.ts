import type { PitchClass } from './pitch'
import { noteName } from './pitch'
import type { QualityId } from './qualities'
import { chordName, intervalsFor } from './qualities'

export interface ChordRef {
  root: PitchClass
  quality: QualityId
}

/** Default playback band around C3 (tech-spec §Data model, DisplayRange default). */
export const VOICE_BAND_LOW = 48
export const VOICE_BAND_HIGH = 71

/**
 * Root-position close voicing of a chord in the default C3–B4 band.
 * Always inversion 0: the root is the lowest note and the remaining tones
 * are stacked from it by their exact intervals (octave info preserved,
 * e.g. add9 keeps a 14-semitone stretch), wrapping a tone above the band
 * down an octave.
 */
export function rootPositionVoice(chord: ChordRef): number[] {
  const base = VOICE_BAND_LOW + chord.root
  return intervalsFor(chord.quality)
    .map((semi) => base + semi)
    .map((midi) => (midi > VOICE_BAND_HIGH ? midi - 12 : midi))
    .sort((a, b) => a - b)
}

export type VoicingType = 'close' | 'open' | 'leftRight'

export interface VoicedNote {
  midi: number
  hand?: 'left' | 'right'
}

const INVERSION_NAMES = ['Root position', '1st inversion', '2nd inversion', '3rd inversion']

/** Root position + every inversion this chord has (tech-spec §Data model → Selection). */
export function validInversionCount(chord: ChordRef): number {
  return intervalsFor(chord.quality).length
}

/**
 * Ascending bass→treble semitone offsets from the root for `inversion`
 * (tech-spec §Key technical decisions → Voicing algorithms): rotate the
 * root-position stack left by `inversion` positions, adding an octave to
 * each wrapped-around tone so the result stays ascending.
 */
function invertedIntervals(chord: ChordRef, inversion: number): number[] {
  const offsets = intervalsFor(chord.quality)
  const n = offsets.length
  const i = ((inversion % n) + n) % n
  return [...offsets.slice(i), ...offsets.slice(0, i).map((o) => o + 12)]
}

const INVERSION_SHORT_NAMES = ['Root', '1st', '2nd', '3rd', '4th']

/** "Root position", "1st inversion", "2nd inversion", … */
export function inversionName(inversion: number): string {
  return INVERSION_NAMES[inversion] ?? `${inversion}th inversion`
}

/** The compact button label: "Root", "1st", "2nd", … */
export function inversionShortName(inversion: number): string {
  return INVERSION_SHORT_NAMES[inversion] ?? `${inversion}th`
}

/** `null` at root position; otherwise `"{chordSymbol}/{bassNote}"` (tech-spec §Voicing algorithms). */
export function slashChordLabel(chord: ChordRef, inversion: number): string | null {
  if (inversion === 0) return null
  const offsets = invertedIntervals(chord, inversion)
  const bassPitchClass = (((chord.root + offsets[0]) % 12) + 12) % 12
  return `${chordName(chord.root, chord.quality)}/${noteName(bassPitchClass)}`
}

/**
 * The exact notes for `chord` at `inversion` and voicing `type`, ascending
 * bass→treble; `notes[0]` is always the bass (tech-spec §Data model → Voicing).
 * `inversion` is clamped into the chord's valid range, and every voicing
 * type is defined for every inversion, so no combination is invalid.
 */
export function voice(chord: ChordRef, inversion: number, type: VoicingType = 'close'): VoicedNote[] {
  const n = validInversionCount(chord)
  const clamped = ((inversion % n) + n) % n
  const base = VOICE_BAND_LOW + chord.root
  const midis = invertedIntervals(chord, clamped).map((semi) => base + semi)

  if (type === 'open') {
    return midis
      .map((midi, idx) => (idx % 2 === 1 ? midi + 12 : midi))
      .sort((a, b) => a - b)
      .map((midi) => ({ midi }))
  }

  if (type === 'leftRight') {
    const [bass, ...rest] = midis
    const notes: VoicedNote[] = [
      { midi: bass - 12, hand: 'left' },
      ...rest.map((midi): VoicedNote => ({ midi, hand: 'right' })),
    ]
    return notes.sort((a, b) => a.midi - b.midi)
  }

  return midis.map((midi) => ({ midi }))
}