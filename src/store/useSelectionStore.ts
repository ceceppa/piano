import { create } from 'zustand'
import type { PitchClass } from '../musicCore'
import type { QualityId, ScaleTypeId, VoicingType } from '../musicCore'
import { validInversionCount } from '../musicCore'

export type ViewMode = 'chord' | 'scale' | 'both'
export type Theme = 'light' | 'dark'

/**
 * The whole Explore selection (tech-spec §Data model → Selection). One root
 * drives both the chord and the scale; `quality`, `scaleType`, and `inversion`
 * are independent fields that `viewMode` only shows or hides, so a hidden
 * chord or scale is remembered and returns unchanged when its view does.
 */
export interface Selection {
  root: PitchClass
  quality: QualityId
  scaleType: ScaleTypeId
  viewMode: ViewMode
  inversion: number
  voicingType: VoicingType
}

export interface OctaveRange {
  startMidi: number
  endMidi: number
}

interface SelectionState {
  theme: Theme
  selection: Selection
  octaveStart: number
  octaveEnd: number
  setTheme: (theme: Theme) => void
  setRoot: (root: PitchClass) => void
  setQuality: (quality: QualityId) => void
  setScaleType: (scaleType: ScaleTypeId) => void
  setViewMode: (viewMode: ViewMode) => void
  setInversion: (inversion: number) => void
  setVoicingType: (voicingType: VoicingType) => void
}

const C = 0

/**
 * Fixed keyboard window (tech-spec §Data model → DisplayRange). There is no
 * range control any more; the Keyboard relaxes both bounds around the current
 * voicing itself, so nothing writes these.
 */
export const DEFAULT_OCTAVE_RANGE: OctaveRange = { startMidi: 48, endMidi: 83 }

export function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

export const useSelectionStore = create<SelectionState>((set) => ({
  theme: getSystemTheme(),
  selection: {
    root: C,
    quality: 'major',
    scaleType: 'major',
    viewMode: 'chord',
    inversion: 0,
    voicingType: 'close',
  },
  octaveStart: DEFAULT_OCTAVE_RANGE.startMidi,
  octaveEnd: DEFAULT_OCTAVE_RANGE.endMidi,
  setTheme: (theme) => set({ theme }),
  setRoot: (root) => set((state) => ({ selection: { ...state.selection, root } })),
  setQuality: (quality) =>
    set((state) => {
      const maxInversion = validInversionCount({ root: state.selection.root, quality }) - 1
      const inversion = Math.min(state.selection.inversion, maxInversion)
      return { selection: { ...state.selection, quality, inversion } }
    }),
  setScaleType: (scaleType) => set((state) => ({ selection: { ...state.selection, scaleType } })),
  setViewMode: (viewMode) => set((state) => ({ selection: { ...state.selection, viewMode } })),
  setInversion: (inversion) => set((state) => ({ selection: { ...state.selection, inversion } })),
  setVoicingType: (voicingType) => set((state) => ({ selection: { ...state.selection, voicingType } })),
}))
