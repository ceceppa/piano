export type PitchClass = number

export const MIDI_TO_PITCH = 12

/** Sharp spellings are canonical (project rule §Naming). C = 0 … B = 11. */
export const PITCH_CLASS_LABELS: readonly string[] = [
  'C',
  'C♯',
  'D',
  'D♯',
  'E',
  'F',
  'F♯',
  'G',
  'G♯',
  'A',
  'A♯',
  'B',
]

/**
 * Flat spelling for the five accidentals, empty for the seven naturals
 * (tech-spec §Data model → PitchClass `flatLabel`). The root buttons show both
 * spellings stacked until a notation preference exists; sharps stay canonical
 * everywhere else in code (project-rules §Naming).
 */
export const PITCH_CLASS_FLAT_LABELS: readonly string[] = [
  '',
  'D♭',
  '',
  'E♭',
  '',
  '',
  'G♭',
  '',
  'A♭',
  '',
  'B♭',
  '',
]

export function noteName(value: number): string {
  return PITCH_CLASS_LABELS[((value % 12) + 12) % 12]
}

export function flatName(value: number): string {
  return PITCH_CLASS_FLAT_LABELS[((value % 12) + 12) % 12]
}