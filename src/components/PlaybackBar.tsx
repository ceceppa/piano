import { useEffect, useState } from 'react'
import { chordName, scaleLabel, scaleTones, voice } from '../musicCore'
import type { VoicingType } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import * as audioEngine from '../audioEngine'
import Button from './shared/Button'
import ChordOptions from './ChordOptions'
import './PlaybackBar.css'

/** The state-summary caption, in place of the old static "Ready" label. */
const VOICING_SUMMARY: Record<VoicingType, string> = {
  close: 'Close voicing · both hands',
  open: 'Open voicing · both hands',
  leftRight: 'Left and right hands',
}

/**
 * One primary action for the current view, one secondary action that changes
 * with it, and — where a chord is showing — the Chord options control
 * (ux-flow §Explore, design-brief §Screen Composition item 5).
 */
export default function PlaybackBar() {
  const selection = useSelectionStore((s) => s.selection)
  const [playing, setPlaying] = useState<'idle' | 'playing'>('idle')

  useEffect(() => {
    audioEngine.setPlaybackListener(setPlaying)
    return () => audioEngine.setPlaybackListener(null)
  }, [])

  const { root, quality, scaleType, viewMode, inversion, voicingType } = selection
  const voiced = voice({ root, quality }, inversion, voicingType).map((n) => n.midi)
  const scale = scaleTones(root, scaleType).map((pc) => 48 + pc)

  const chordTitle = chordName(root, quality)
  const scaleTitle = `${scaleLabel(root, scaleType)} scale`
  const showChord = viewMode !== 'scale'

  const run = (action: () => void) => {
    void audioEngine.init().then(() => action())
  }

  const playChord = () => run(() => audioEngine.playChord(voiced))
  const playScaleUp = () => run(() => audioEngine.playScale(scale))

  const primary = showChord
    ? { label: `Hear ${chordTitle}`, action: playChord }
    : { label: `Hear ${scaleTitle}`, action: playScaleUp }

  const secondary =
    viewMode === 'chord'
      ? { label: 'Play as arpeggio', action: () => run(() => audioEngine.playArpeggio(voiced)) }
      : viewMode === 'scale'
        ? { label: 'Play descending', action: () => run(() => audioEngine.playScale(scale, 'down')) }
        : { label: `Hear ${scaleTitle}`, action: playScaleUp }

  return (
    <div className="playback-bar">
      <Button variant="primary" round aria-label={primary.label} onClick={primary.action}>
        <svg className="play-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </Button>
      <Button variant="primary" className="playback-primary" onClick={primary.action}>
        {primary.label}
      </Button>
      <Button variant="ghost" className="playback-secondary" onClick={secondary.action}>
        {secondary.label}
      </Button>
      {showChord && <ChordOptions />}
      <span className="playback-state" role="status" aria-live="polite">
        {playing === 'playing' ? 'Playing…' : ''}
      </span>
      {showChord && <span className="playback-summary">{VOICING_SUMMARY[voicingType]}</span>}
      {playing === 'playing' && (
        <Button variant="ghost" onClick={() => audioEngine.stopPlayback()}>
          Stop
        </Button>
      )}
    </div>
  )
}
