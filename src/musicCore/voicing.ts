import type { PitchClass } from './pitch'
import type { QualityId } from './qualities'
import { intervalsFor } from './qualities'

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