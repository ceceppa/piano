import { describe, expect, it } from 'vitest'
import {
  chordFullName,
  chordName,
  chordTones,
  isRecommendedForGenre,
  noteName,
  QUALITIES,
  rootPositionVoice,
  scaleLabel,
  scaleTones,
  variationsFor,
  VOICE_BAND_HIGH,
  VOICE_BAND_LOW,
} from './index'

const C = 0
const CS = 1
const D = 2
const DS = 3
const E = 4
const F = 5
const FS = 6
const G = 7
const GS = 8
const A = 9
const AS = 10
const B = 11

function asNotes(pcs: number[]): string[] {
  return pcs.map(noteName)
}

describe('noteName', () => {
  it('returns sharp spellings across the chromatic circle', () => {
    expect(asNotes([C, CS, D, DS, E, F, FS, G, GS, A, AS, B])).toEqual([
      'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B',
    ])
  })
})

describe('chordTones', () => {
  it('maps every catalogue quality to the correct pitch class set', () => {
    const expected: Record<string, number[]> = {
      major: [C, E, G],
      minor: [C, DS, G],
      diminished: [C, DS, FS],
      augmented: [C, E, GS],
      sus2: [C, D, G],
      sus4: [C, F, G],
      '6': [C, E, G, A],
      '7': [C, E, G, AS],
      maj7: [C, E, G, B],
      m7: [C, DS, G, AS],
      '9': [C, E, G, AS, D],
      add9: [C, E, G, D],
    }
    for (const q of QUALITIES) {
      expect(chordTones(C, q.id)).toEqual(expected[q.id])
    }
  })

  it('spells a dominant 7th (A7) per the spec example', () => {
    expect(asNotes(chordTones(A, '7'))).toEqual(['A', 'C♯', 'E', 'G'])
  })

  it('spells a major 7th (Amaj7) per the spec example', () => {
    expect(asNotes(chordTones(A, 'maj7'))).toEqual(['A', 'C♯', 'E', 'G♯'])
  })

  it('handles roots that are not the tonic C', () => {
    expect(chordTones(FS, 'major')).toEqual([FS, AS, CS])
    expect(chordTones(AS, 'minor')).toEqual([AS, CS, F])
  })
})

describe('scaleTones', () => {
  it('returns the chromatic circle under a full-octave range for C major', () => {
    expect(scaleTones(C, 'major')).toEqual([C, D, E, F, G, A, B])
  })

  it('returns A natural-minor spelling', () => {
    expect(scaleTones(A, 'naturalMinor')).toEqual([A, B, C, D, E, F, G])
  })

  it('defaults to major scale when no scale type is given', () => {
    expect(scaleTones(C)).toEqual(scaleTones(C, 'major'))
  })

  it('labels scales with the expected names', () => {
    expect(scaleLabel(C, 'major')).toBe('C major')
    expect(scaleLabel(A, 'naturalMinor')).toBe('A minor')
  })
})

describe('chordName', () => {
  it('renders plain root (no suffix) for major', () => {
    expect(chordName(C, 'major')).toBe('C')
    expect(chordName(AS, 'major')).toBe('A♯')
  })

  it('renders quality suffixes for others', () => {
    expect(chordName(A, 'minor')).toBe('Am')
    expect(chordName(A, '7')).toBe('A7')
    expect(chordName(A, 'maj7')).toBe('Amaj7')
    expect(chordName(G, 'add9')).toBe('Gadd9')
  })
})

describe('chordFullName', () => {
  it('renders the full readable name per the phase brief example', () => {
    expect(chordFullName(A, 'diminished')).toBe('A diminished')
  })

  it('renders a full readable name for every catalogue quality', () => {
    for (const q of QUALITIES) {
      expect(chordFullName(C, q.id)).toBe(`C ${q.name}`)
    }
  })
})

describe('isRecommendedForGenre', () => {
  it('is true only when the quality is tagged with that genre', () => {
    expect(isRecommendedForGenre('minor', 'Pop')).toBe(true)
    expect(isRecommendedForGenre('minor', 'Jazz')).toBe(false)
    expect(isRecommendedForGenre('7', 'Blues')).toBe(true)
  })

  it('is always false for "Any" — Any clears the cue, it is not a wildcard match', () => {
    for (const q of QUALITIES) {
      expect(isRecommendedForGenre(q.id, 'Any')).toBe(false)
    }
  })

  it('is false for a quality untagged for any genre', () => {
    expect(isRecommendedForGenre('major', 'Pop')).toBe(false)
    expect(isRecommendedForGenre('major', 'Jazz')).toBe(false)
  })
})

describe('variationsFor', () => {
  it('returns all catalogue qualities except the current one, in catalogue order', () => {
    const variations = variationsFor(C, 'major')
    const ids = variations.map((v) => v.quality)
    expect(ids).not.toContain('major')
    expect(ids).toEqual(QUALITIES.map((q) => q.id).filter((id) => id !== 'major'))
    expect(ids[0]).toBe('minor')
  })

  it('names variations with the root applied', () => {
    const variations = variationsFor(A, 'minor')
    expect(variations.find((v) => v.quality === 'maj7')?.name).toBe('Amaj7')
  })

  it('returns the full 11 variations for a root', () => {
    expect(variationsFor(G, 'sus2')).toHaveLength(QUALITIES.length - 1)
  })
})

describe('rootPositionVoice', () => {
  it('stacks a root-position close voicing within the C3–B4 band', () => {
    const voice = rootPositionVoice({ root: C, quality: 'maj7' })
    expect(voice).toEqual([48, 52, 55, 59])
    voice.forEach((midi) => expect(midi).toBeGreaterThanOrEqual(VOICE_BAND_LOW))
    voice.forEach((midi) => expect(midi).toBeLessThanOrEqual(VOICE_BAND_HIGH))
  })

  it('keeps the root as the lowest note (inversion 0)', () => {
    const voice = rootPositionVoice({ root: A, quality: 'major' })
    expect(voice[0]).toBe(48 + A)
    expect(voice).toEqual([57, 61, 64])
  })

  it('preserves octave information (add9 spans 14 semitones)', () => {
    expect(rootPositionVoice({ root: C, quality: 'add9' })).toEqual([48, 52, 55, 62])
  })
})