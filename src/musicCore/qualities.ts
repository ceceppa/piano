import type { PitchClass } from './pitch'
import { noteName } from './pitch'
import type { ScaleTypeId } from './scales'
import { scaleTones } from './scales'
import type { IntervalFormula } from './formula'
import { degreeToSemitone } from './formula'

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
  /** Scale-degree formula from the root, canonical in tech-spec §Interval formula notation. */
  formula: readonly IntervalFormula[]
  /** Symbol suffix appended to the root label, e.g. major -> "" (plain root). */
  suffix: string
  /** Full readable word(s) for the screen title, e.g. "diminished" -> "A diminished". */
  name: string
  /** One short plain sentence about the chord itself, with no genre reference. */
  description: string
  /** Static genre-relevance guidance labels; guidance, never an objective claim. */
  genreGuide: readonly string[]
  /** Structured genre tags read by isRecommendedForGenre; canonical in tech-spec §Data model. */
  genres: readonly GenreId[]
}

/** Catalogue order is normative (variationsFor, selectors, variation panel). */
export const QUALITIES: readonly ChordQuality[] = [
  { id: 'major', formula: ['1', '3', '5'], suffix: '', name: 'major', description: 'The bright, settled sound most songs start from.', genreGuide: ['The most common chord in music'], genres: [] },
  { id: 'minor', formula: ['1', 'b3', '5'], suffix: 'm', name: 'minor', description: 'A major chord with its third lowered, which darkens the whole sound.', genreGuide: ['Common in pop and rock'], genres: ['Pop', 'Rock'] },
  { id: 'diminished', formula: ['1', 'b3', 'b5'], suffix: 'dim', name: 'diminished', description: 'Both upper notes squeezed down, so it sounds tense and unfinished.', genreGuide: ['A jazz and film-music tension chord'], genres: ['Jazz'] },
  { id: 'augmented', formula: ['1', '3', '#5'], suffix: 'aug', name: 'augmented', description: 'The fifth stretched up a semitone, which leaves the chord hanging.', genreGuide: ['Used for colour and suspense'], genres: [] },
  { id: 'sus2', formula: ['1', '2', '5'], suffix: 'sus2', name: 'suspended 2nd', description: 'The third swapped for a second, so it is neither bright nor dark.', genreGuide: ['Common in rock and ambient music'], genres: ['Rock'] },
  { id: 'sus4', formula: ['1', '4', '5'], suffix: 'sus4', name: 'suspended 4th', description: 'The third swapped for a fourth, which leans towards resolving.', genreGuide: ['Common in rock and folk'], genres: ['Rock'] },
  { id: '6', formula: ['1', '3', '5', '6'], suffix: '6', name: 'sixth', description: 'A major chord with the sixth added on top for a gentle lift.', genreGuide: ['A jazz and swing favourite'], genres: ['Jazz'] },
  { id: '7', formula: ['1', '3', '5', 'b7'], suffix: '7', name: 'dominant seventh', description: 'A major chord with a lowered seventh that pulls somewhere else.', genreGuide: ['The blues staple'], genres: ['Blues'] },
  { id: 'maj7', formula: ['1', '3', '5', '7'], suffix: 'maj7', name: 'major seventh', description: 'A major chord with its natural seventh, soft and unhurried.', genreGuide: ['A jazz favourite'], genres: ['Jazz'] },
  { id: 'm7', formula: ['1', 'b3', '5', 'b7'], suffix: 'm7', name: 'minor seventh', description: 'A minor chord with a lowered seventh, rounder than plain minor.', genreGuide: ['Common in jazz and neo-soul'], genres: ['Jazz'] },
  { id: '9', formula: ['1', '3', '5', 'b7', '9'], suffix: '9', name: 'dominant ninth', description: 'A seventh chord with the ninth stacked on for extra colour.', genreGuide: ['Popular in jazz and R&B'], genres: ['Jazz'] },
  { id: 'add9', formula: ['1', '3', '5', '9'], suffix: 'add9', name: 'added ninth', description: 'A major chord with the ninth added and no seventh underneath.', genreGuide: ['A soft, modern colour'], genres: [] },
]

const QUALITY_BY_ID: Readonly<Record<QualityId, ChordQuality>> = Object.fromEntries(
  QUALITIES.map((q) => [q.id, q]),
) as Record<QualityId, ChordQuality>

export function qualityById(quality: QualityId): ChordQuality {
  const q = QUALITY_BY_ID[quality]
  if (!q) throw new Error(`unknown chord quality: ${String(quality)}`)
  return q
}

export function intervalsFor(quality: QualityId): readonly number[] {
  const q = QUALITY_BY_ID[quality]
  if (!q) throw new Error(`unknown chord quality: ${String(quality)}`)
  return q.formula.map(degreeToSemitone)
}

export function chordTones(root: PitchClass, quality: QualityId): PitchClass[] {
  return intervalsFor(quality).map((semi) => (root + semi) % 12)
}

/**
 * The pitch classes present in both the chord and the scale, in chord-tone order
 * (tech-spec §Public / integration interface contracts). One source for the
 * keyboard's shared role and the Understand section's shared-notes row, so the
 * two can never disagree.
 */
export function sharedTones(
  root: PitchClass,
  quality: QualityId,
  scaleType: ScaleTypeId,
): PitchClass[] {
  const scale = new Set(scaleTones(root, scaleType))
  return chordTones(root, quality).filter((pc) => scale.has(pc))
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
  diminished: 'diminished',
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