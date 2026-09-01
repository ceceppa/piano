import type { PitchClass } from './pitch'
import { noteName } from './pitch'
import type { IntervalFormula } from './formula'
import { degreeToSemitone } from './formula'

export type ScaleTypeId = 'major' | 'naturalMinor' | 'augmented' | 'locrian' | 'mixolydian' | 'diminished'

export interface ScaleType {
  id: ScaleTypeId
  /** Scale-degree formula from the root, canonical in tech-spec §Interval formula notation. */
  formula: readonly IntervalFormula[]
}

export const SCALES: Record<ScaleTypeId, ScaleType> = {
  major: { id: 'major', formula: ['1', '2', '3', '4', '5', '6', '7'] },
  naturalMinor: { id: 'naturalMinor', formula: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
  augmented: { id: 'augmented', formula: ['1', 'b3', '3', '5', '#5', '7'] },
  locrian: { id: 'locrian', formula: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'] },
  mixolydian: { id: 'mixolydian', formula: ['1', '2', '3', '4', '5', '6', 'b7'] },
  diminished: { id: 'diminished', formula: ['1', '2', 'b3', '4', 'b5', 'b6', '6', '7'] },
}

export function scaleTones(root: PitchClass, scaleType: ScaleTypeId = 'major'): PitchClass[] {
  return SCALES[scaleType].formula.map(degreeToSemitone).map((semi) => (root + semi) % 12)
}

export function scaleLabel(root: PitchClass, scaleType: ScaleTypeId): string {
  return `${noteName(root)} ${scaleType === 'naturalMinor' ? 'minor' : 'major'}`
}