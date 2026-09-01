/** Scale-degree formula token, e.g. "1", "b3", "#5" (tech-spec §Interval formula notation). */
export type IntervalFormula = string

const DEGREE_SEMITONES: Readonly<Record<string, number>> = {
  '1': 0,
  '2': 2,
  '3': 4,
  '4': 5,
  '5': 7,
  '6': 9,
  '7': 11,
  '9': 14,
}

/** Parses a formula token into semitones from the root (tech-spec §Interval formula notation). */
export function degreeToSemitone(token: IntervalFormula): number {
  const match = /^(b|#)?([0-9]+)$/.exec(token)
  if (!match) throw new Error(`unknown interval formula token: ${token}`)
  const base = DEGREE_SEMITONES[match[2]]
  if (base === undefined) throw new Error(`unknown interval formula token: ${token}`)
  const accidental = match[1]
  return accidental === 'b' ? base - 1 : accidental === '#' ? base + 1 : base
}
