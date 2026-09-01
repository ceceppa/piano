import type { PitchClass } from './pitch'
import { noteName } from './pitch'

export type ScaleTypeId = 'major' | 'naturalMinor' | 'augmented' | 'locrian' | 'mixolydian'

export interface ScaleType {
  id: ScaleTypeId
  /** Semitone intervals from the root, canonical in tech-spec §Data model. */
  intervals: readonly number[]
}

export const SCALES: Record<ScaleTypeId, ScaleType> = {
  major: { id: 'major', intervals: [0, 2, 4, 5, 7, 9, 11] },
  naturalMinor: { id: 'naturalMinor', intervals: [0, 2, 3, 5, 7, 8, 10] },
  augmented: { id: 'augmented', intervals: [0, 3, 4, 7, 8, 11] },
  locrian: { id: 'locrian', intervals: [0, 1, 3, 5, 6, 8, 10] },
  mixolydian: { id: 'mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10] },
}

export function scaleTones(root: PitchClass, scaleType: ScaleTypeId = 'major'): PitchClass[] {
  return SCALES[scaleType].intervals.map((semi) => (root + semi) % 12)
}

export function scaleLabel(root: PitchClass, scaleType: ScaleTypeId): string {
  return `${noteName(root)} ${scaleType === 'naturalMinor' ? 'minor' : 'major'}`
}