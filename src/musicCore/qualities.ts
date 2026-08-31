import type { PitchClass } from './pitch'
import { noteName } from './pitch'

export type QualityId =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'augmented'
  | 'sus2'
  | 'sus4'
  | '6'
  | '7'
  | 'maj7'
  | 'm7'
  | '9'
  | 'add9'

export interface ChordQuality {
  id: QualityId
  /** Semitone intervals from the root, canonical in tech-spec §Data model. */
  intervals: readonly number[]
  /** Symbol suffix appended to the root label, e.g. major -> "" (plain root). */
  suffix: string
  /** Static genre-relevance guidance labels; guidance, never an objective claim. */
  genreGuide: readonly string[]
}

/** Catalogue order is normative (variationsFor, selectors, variation panel). */
export const QUALITIES: readonly ChordQuality[] = [
  { id: 'major', intervals: [0, 4, 7], suffix: '', genreGuide: ['The most common chord in music'] },
  { id: 'minor', intervals: [0, 3, 7], suffix: 'm', genreGuide: ['Common in pop and rock'] },
  { id: 'diminished', intervals: [0, 3, 6], suffix: 'dim', genreGuide: ['A jazz and film-music tension chord'] },
  { id: 'augmented', intervals: [0, 4, 8], suffix: 'aug', genreGuide: ['Used for colour and suspense'] },
  { id: 'sus2', intervals: [0, 2, 7], suffix: 'sus2', genreGuide: ['Common in rock and ambient music'] },
  { id: 'sus4', intervals: [0, 5, 7], suffix: 'sus4', genreGuide: ['Common in rock and folk'] },
  { id: '6', intervals: [0, 4, 7, 9], suffix: '6', genreGuide: ['A jazz and swing favourite'] },
  { id: '7', intervals: [0, 4, 7, 10], suffix: '7', genreGuide: ['The blues staple'] },
  { id: 'maj7', intervals: [0, 4, 7, 11], suffix: 'maj7', genreGuide: ['A jazz favourite'] },
  { id: 'm7', intervals: [0, 3, 7, 10], suffix: 'm7', genreGuide: ['Common in jazz and neo-soul'] },
  { id: '9', intervals: [0, 4, 7, 10, 14], suffix: '9', genreGuide: ['Popular in jazz and R&B'] },
  { id: 'add9', intervals: [0, 4, 7, 14], suffix: 'add9', genreGuide: ['A soft, modern colour'] },
]

const QUALITY_BY_ID: Readonly<Record<QualityId, ChordQuality>> = Object.fromEntries(
  QUALITIES.map((q) => [q.id, q]),
) as Record<QualityId, ChordQuality>

export function intervalsFor(quality: QualityId): readonly number[] {
  const q = QUALITY_BY_ID[quality]
  if (!q) throw new Error(`unknown chord quality: ${String(quality)}`)
  return q.intervals
}

export function chordTones(root: PitchClass, quality: QualityId): PitchClass[] {
  return intervalsFor(quality).map((semi) => (root + semi) % 12)
}

export function chordName(root: PitchClass, quality: QualityId): string {
  if (!QUALITY_BY_ID[quality]) throw new Error(`unknown chord quality: ${String(quality)}`)
  return `${noteName(root)}${QUALITY_BY_ID[quality].suffix}`
}

export interface Variation {
  quality: QualityId
  /** Full chord name for the root, e.g. "A7". */
  name: string
  genreGuide: readonly string[]
}

export function variationsFor(root: PitchClass, currentQuality: QualityId): Variation[] {
  return QUALITIES.filter((q) => q.id !== currentQuality).map((q) => ({
    quality: q.id,
    name: chordName(root, q.id),
    genreGuide: q.genreGuide,
  }))
}