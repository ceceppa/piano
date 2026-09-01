import { describe, expect, it } from 'vitest'
import {
  chordFullName,
  chordName,
  chordScaleType,
  chordTones,
  inversionName,
  isRecommendedForGenre,
  noteName,
  QUALITIES,
  rootPositionVoice,
  scaleLabel,
  scaleName,
  scaleStepPattern,
  scaleTones,
  sharedTones,
  slashChordLabel,
  validInversionCount,
  variationsFor,
  voice,
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
    expect(scaleLabel(A, 'naturalMinor')).toBe('A natural minor')
    // Every scale gets its own name, not a major/minor fallback.
    expect(scaleLabel(C, 'mixolydian')).toBe('C mixolydian')
    expect(scaleName('naturalMinor')).toBe('Natural minor')
  })

  it('derives the whole/half step pattern from the interval formula', () => {
    expect(scaleStepPattern('major')).toBe('W · W · H · W · W · W · H')
    expect(scaleStepPattern('naturalMinor')).toBe('W · H · W · W · H · W · W')
  })
})

describe('chordScaleType', () => {
  it('maps C augmented to the augmented scale, spelled per the phase-2 backlog record (E1a)', () => {
    expect(asNotes(scaleTones(C, chordScaleType('augmented')))).toEqual([
      'C', 'D♯', 'E', 'G', 'G♯', 'B',
    ])
  })

  it('every catalogue quality maps to a scale containing all of its own chord tones, across several roots (E1b)', () => {
    for (const root of [C, FS, A, DS]) {
      for (const q of QUALITIES) {
        const scale = new Set(scaleTones(root, chordScaleType(q.id)))
        for (const tone of chordTones(root, q.id)) {
          expect(scale.has(tone)).toBe(true)
        }
      }
    }
  })

  it('matches the exact tech-spec §Chord-scale mapping table', () => {
    const expected: Record<string, string> = {
      major: 'major', sus2: 'major', sus4: 'major', '6': 'major', maj7: 'major', add9: 'major',
      minor: 'naturalMinor', m7: 'naturalMinor',
      diminished: 'diminished',
      augmented: 'augmented',
      '7': 'mixolydian', '9': 'mixolydian',
    }
    for (const q of QUALITIES) {
      expect(chordScaleType(q.id)).toBe(expected[q.id])
    }
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

describe('validInversionCount', () => {
  it('is root position plus every inversion a chord has', () => {
    expect(validInversionCount({ root: C, quality: 'major' })).toBe(3)
    expect(validInversionCount({ root: C, quality: '7' })).toBe(4)
    expect(validInversionCount({ root: C, quality: '9' })).toBe(5)
  })
})

describe('inversionName', () => {
  it('names root position and each inversion', () => {
    expect(inversionName(0)).toBe('Root position')
    expect(inversionName(1)).toBe('1st inversion')
    expect(inversionName(2)).toBe('2nd inversion')
    expect(inversionName(3)).toBe('3rd inversion')
  })
})

describe('slashChordLabel', () => {
  it('is null at root position', () => {
    expect(slashChordLabel({ root: C, quality: '7' }, 0)).toBeNull()
  })

  it('names the chord over its inverted bass note', () => {
    expect(slashChordLabel({ root: C, quality: '7' }, 1)).toBe('C7/E')
    expect(slashChordLabel({ root: A, quality: 'major' }, 1)).toBe('A/C♯')
    expect(slashChordLabel({ root: A, quality: 'major' }, 2)).toBe('A/E')
  })
})

describe('voice', () => {
  it('close voicing at root position matches rootPositionVoice', () => {
    expect(voice({ root: C, quality: 'maj7' }, 0, 'close').map((n) => n.midi)).toEqual([48, 52, 55, 59])
  })

  it('rotates the bass for each inversion, staying ascending', () => {
    const chord = { root: C, quality: '7' as const }
    expect(voice(chord, 0).map((n) => n.midi)).toEqual([48, 52, 55, 58])
    expect(voice(chord, 1).map((n) => n.midi)).toEqual([52, 55, 58, 60])
    expect(voice(chord, 2).map((n) => n.midi)).toEqual([55, 58, 60, 64])
    expect(voice(chord, 3).map((n) => n.midi)).toEqual([58, 60, 64, 67])
  })

  it('clamps an inversion beyond the chord’s valid range', () => {
    const chord = { root: C, quality: 'major' as const }
    expect(voice(chord, 5)).toEqual(voice(chord, 2))
  })

  it('open voicing spreads every other note up an octave', () => {
    expect(voice({ root: C, quality: 'major' }, 0, 'open').map((n) => n.midi)).toEqual([48, 55, 64])
  })

  it('left/right-hand voicing drops the bass an octave and tags hands', () => {
    const notes = voice({ root: C, quality: 'major' }, 0, 'leftRight')
    expect(notes).toEqual([
      { midi: 36, hand: 'left' },
      { midi: 52, hand: 'right' },
      { midi: 55, hand: 'right' },
    ])
  })

  it('combines any voicing with any inversion', () => {
    const notes = voice({ root: C, quality: '7' }, 2, 'leftRight')
    expect(notes[0].hand).toBe('left')
    expect(notes[0].midi).toBeLessThan(notes[1].midi)
  })
})

describe('sharedTones', () => {
  it('returns the notes a chord and a scale have in common, in chord-tone order', () => {
    // C major triad sits entirely inside the C major scale.
    expect(sharedTones(C, 'major', 'major')).toEqual(chordTones(C, 'major'))
  })

  it('leaves out a chord tone the scale does not contain', () => {
    // C augmented is C · E · G♯; G♯ is not in C major.
    expect(sharedTones(C, 'augmented', 'major')).toEqual([0, 4])
    // Against C natural minor the third drops out instead: C and G♯ remain.
    expect(sharedTones(C, 'augmented', 'naturalMinor')).toEqual([0, 8])
  })

  it('agrees with chordTones and scaleTones for every quality and selectable scale', () => {
    for (const q of QUALITIES) {
      for (const scale of ['major', 'naturalMinor'] as const) {
        const scaleSet = new Set(scaleTones(A, scale))
        expect(sharedTones(A, q.id, scale)).toEqual(
          chordTones(A, q.id).filter((pc) => scaleSet.has(pc)),
        )
      }
    }
  })
})
