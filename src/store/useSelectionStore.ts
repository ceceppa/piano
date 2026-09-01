import { create } from 'zustand'
import type { PitchClass } from '../musicCore'
import type { GenreId, QualityId, ScaleTypeId, VoicingType } from '../musicCore'
import { validInversionCount } from '../musicCore'

export type ScaleMode = 'chord-root' | 'key'
export type ViewMode = 'chord' | 'scale' | 'both'
export type Theme = 'light' | 'dark'

export interface KeyContext {
  root: PitchClass
  scaleType: ScaleTypeId
}

export interface Selection {
  root: PitchClass
  quality: QualityId
  key: KeyContext
  scaleMode: ScaleMode
  viewMode: ViewMode
  genre: GenreId
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
  setKeyRoot: (root: PitchClass) => void
  setKeyScaleType: (scaleType: ScaleTypeId) => void
  setScaleMode: (scaleMode: ScaleMode) => void
  setViewMode: (viewMode: ViewMode) => void
  setGenre: (genre: GenreId) => void
  setOctaveRange: (startMidi: number, endMidi: number) => void
  setInversion: (inversion: number) => void
  setVoicingType: (voicingType: VoicingType) => void
}

const C = 0

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
    key: { root: C, scaleType: 'major' },
    scaleMode: 'chord-root',
    viewMode: 'both',
    genre: 'Any',
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
  setKeyRoot: (root) =>
    set((state) => ({ selection: { ...state.selection, key: { ...state.selection.key, root } } })),
  setKeyScaleType: (scaleType) =>
    set((state) => ({ selection: { ...state.selection, key: { ...state.selection.key, scaleType } } })),
  setScaleMode: (scaleMode) =>
    set((state) => ({ selection: { ...state.selection, scaleMode } })),
  setViewMode: (viewMode) => set((state) => ({ selection: { ...state.selection, viewMode } })),
  setGenre: (genre) => set((state) => ({ selection: { ...state.selection, genre } })),
  setOctaveRange: (startMidi, endMidi) => set({ octaveStart: startMidi, octaveEnd: endMidi }),
  setInversion: (inversion) => set((state) => ({ selection: { ...state.selection, inversion } })),
  setVoicingType: (voicingType) => set((state) => ({ selection: { ...state.selection, voicingType } })),
}))