import type { PitchClass } from './pitch'
import { noteName } from './pitch'
import type { ScaleTypeId } from './scales'

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

export type GenreId = 'Any' | 'Pop' | 'Rock' | 'Jazz' | 'Blues' | 'Classical'

/** Canonical genre catalogue — single source for the genre selector's options (tech-spec §Data model). */
export const GENRES: readonly GenreId[] = ['Any', 'Pop', 'Rock', 'Jazz', 'Blues', 'Classical']

export interface ChordQuality {
  id: QualityId
  /** Semitone intervals from the root, canonical in tech-spec §Data model. */
  intervals: readonly number[]
  /** Symbol suffix appended to the root label, e.g. major -> "" (plain root). */
  suffix: string
  /** Full readable word(s) for the screen title, e.g. "diminished" -> "A diminished". */
  name: string
  /** Static genre-relevance guidance labels; guidance, never an objective claim. */
  genreGuide: readonly string[]
  /** Structured genre tags read by isRecommendedForGenre; canonical in tech-spec §Data model. */
  genres: readonly GenreId[]
}

/** Catalogue order is normative (variationsFor, selectors, variation panel). */
export const QUALITIES: readonly ChordQuality[] = [
  { id: 'major', intervals: [0, 4, 7], suffix: '', name: 'major', genreGuide: ['The most common chord in music'], genres: [] },
  { id: 'minor', intervals: [0, 3, 7], suffix: 'm', name: 'minor', genreGuide: ['Common in pop and rock'], genres: ['Pop', 'Rock'] },
  { id: 'diminished', intervals: [0, 3, 6], suffix: 'dim', name: 'diminished', genreGuide: ['A jazz and film-music tension chord'], genres: ['Jazz'] },
  { id: 'augmented', intervals: [0, 4, 8], suffix: 'aug', name: 'augmented', genreGuide: ['Used for colour and suspense'], genres: [] },
  { id: 'sus2', intervals: [0, 2, 7], suffix: 'sus2', name: 'suspended 2nd', genreGuide: ['Common in rock and ambient music'], genres: ['Rock'] },
  { id: 'sus4', intervals: [0, 5, 7], suffix: 'sus4', name: 'suspended 4th', genreGuide: ['Common in rock and folk'], genres: ['Rock'] },
  { id: '6', intervals: [0, 4, 7, 9], suffix: '6', name: 'sixth', genreGuide: ['A jazz and swing favourite'], genres: ['Jazz'] },
  { id: '7', intervals: [0, 4, 7, 10], suffix: '7', name: 'dominant seventh', genreGuide: ['The blues staple'], genres: ['Blues'] },
  { id: 'maj7', intervals: [0, 4, 7, 11], suffix: 'maj7', name: 'major seventh', genreGuide: ['A jazz favourite'], genres: ['Jazz'] },
  { id: 'm7', intervals: [0, 3, 7, 10], suffix: 'm7', name: 'minor seventh', genreGuide: ['Common in jazz and neo-soul'], genres: ['Jazz'] },
  { id: '9', intervals: [0, 4, 7, 10, 14], suffix: '9', name: 'dominant ninth', genreGuide: ['Popular in jazz and R&B'], genres: ['Jazz'] },
  { id: 'add9', intervals: [0, 4, 7, 14], suffix: 'add9', name: 'added ninth', genreGuide: ['A soft, modern colour'], genres: [] },
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

export function chordFullName(root: PitchClass, quality: QualityId): string {
  if (!QUALITY_BY_ID[quality]) throw new Error(`unknown chord quality: ${String(quality)}`)
  return `${noteName(root)} ${QUALITY_BY_ID[quality].name}`
}

/** The one catalogue scale containing every chord tone of `quality`, for chord-root mode (tech-spec §Chord-scale mapping). */
const CHORD_SCALE_TYPE: Readonly<Record<QualityId, ScaleTypeId>> = {
  major: 'major',
  sus2: 'major',
  sus4: 'major',
  '6': 'major',
  maj7: 'major',
  add9: 'major',
  minor: 'naturalMinor',
  m7: 'naturalMinor',
  diminished: 'locrian',
  augmented: 'augmented',
  '7': 'mixolydian',
  '9': 'mixolydian',
}

export function chordScaleType(quality: QualityId): ScaleTypeId {
  const scaleType = CHORD_SCALE_TYPE[quality]
  if (!scaleType) throw new Error(`unknown chord quality: ${String(quality)}`)
  return scaleType
}

export function isRecommendedForGenre(quality: QualityId, genre: GenreId): boolean {
  if (!QUALITY_BY_ID[quality]) throw new Error(`unknown chord quality: ${String(quality)}`)
  if (genre === 'Any') return false
  return QUALITY_BY_ID[quality].genres.includes(genre)
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