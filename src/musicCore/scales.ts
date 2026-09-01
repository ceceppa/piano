import type { PitchClass } from './pitch'
import { noteName } from './pitch'
import type { IntervalFormula } from './formula'
import { degreeToSemitone } from './formula'

export type ScaleTypeId = 'major' | 'naturalMinor' | 'augmented' | 'locrian' | 'mixolydian' | 'diminished'

export interface ScaleType {
  id: ScaleTypeId
  /** Scale-degree formula from the root, canonical in tech-spec §Interval formula notation. */
  formula: readonly IntervalFormula[]
  /** Readable name for a tile or a title, e.g. "Natural minor". */
  name: string
  /** One short plain sentence about the scale, shown in the Understand section. */
  description: string
  /** Whether the scale picker offers it (tech-spec §Data model → ScaleType). */
  selectable: boolean
}

export const SCALES: Record<ScaleTypeId, ScaleType> = {
  major: {
    id: 'major',
    formula: ['1', '2', '3', '4', '5', '6', '7'],
    name: 'Major',
    description: 'Seven notes with a bright, settled sound — the scale most tunes are built from.',
    selectable: true,
  },
  naturalMinor: {
    id: 'naturalMinor',
    formula: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    name: 'Natural minor',
    description: 'Seven notes with a lowered third, sixth and seventh, which give it a darker feel.',
    selectable: true,
  },
  augmented: {
    id: 'augmented',
    formula: ['1', 'b3', '3', '5', '#5', '7'],
    name: 'Augmented',
    description: 'Six notes alternating small and large steps, built around a stretched fifth.',
    selectable: false,
  },
  locrian: {
    id: 'locrian',
    formula: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
    name: 'Locrian',
    description: 'Seven notes with both a lowered second and a lowered fifth, so it never settles.',
    selectable: false,
  },
  mixolydian: {
    id: 'mixolydian',
    formula: ['1', '2', '3', '4', '5', '6', 'b7'],
    name: 'Mixolydian',
    description: 'A major scale with a lowered seventh, which keeps it from fully resolving.',
    selectable: false,
  },
  diminished: {
    id: 'diminished',
    formula: ['1', '2', 'b3', '4', 'b5', 'b6', '6', '7'],
    name: 'Diminished',
    description: 'Eight notes alternating whole and half steps, built around the diminished chord.',
    selectable: false,
  },
}

/** The scales the picker offers, in catalogue order (tech-spec §Scale catalogue). */
export const SELECTABLE_SCALES: readonly ScaleType[] = Object.values(SCALES).filter((s) => s.selectable)

export function scaleTones(root: PitchClass, scaleType: ScaleTypeId = 'major'): PitchClass[] {
  return SCALES[scaleType].formula.map(degreeToSemitone).map((semi) => (root + semi) % 12)
}

/** "Major", "Natural minor", "Mixolydian", … */
export function scaleName(scaleType: ScaleTypeId): string {
  return SCALES[scaleType].name
}

/** "G major", "G natural minor" — correct for every scale, not just the two the picker offers. */
export function scaleLabel(root: PitchClass, scaleType: ScaleTypeId): string {
  return `${noteName(root)} ${scaleName(scaleType).toLowerCase()}`
}

/** "W-W-H-W-W-W-H" — whole/half step pattern between consecutive scale degrees, root-relative. */
export function scaleStepPattern(scaleType: ScaleTypeId): string {
  const semitones = SCALES[scaleType].formula.map(degreeToSemitone)
  return semitones
    .map((semi, i) => (i + 1 < semitones.length ? semitones[i + 1] : 12) - semi)
    .map((step) => (step === 1 ? 'H' : step === 2 ? 'W' : `${step}`))
    .join(' · ')
}
