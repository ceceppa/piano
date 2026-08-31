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

export function noteName(value: number): string {
  return PITCH_CLASS_LABELS[((value % 12) + 12) % 12]
}