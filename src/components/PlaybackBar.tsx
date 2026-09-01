import { useEffect, useState } from 'react'
import { chordScaleType, rootPositionVoice, scaleTones } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import * as audioEngine from '../audioEngine'
import Button from './shared/Button'
import './PlaybackBar.css'

export default function PlaybackBar() {
  const selection = useSelectionStore((s) => s.selection)
  const [playing, setPlaying] = useState<'idle' | 'playing'>('idle')

  useEffect(() => {
    audioEngine.setPlaybackListener(setPlaying)
    return () => audioEngine.setPlaybackListener(null)
  }, [])

  const { root, quality, key, scaleMode } = selection
  const voice = rootPositionVoice({ root, quality })
  const scaleRoot = scaleMode === 'key' ? key.root : root
  const scaleType = scaleMode === 'key' ? key.scaleType : chordScaleType(quality)
  const scale = scaleTones(scaleRoot, scaleType).map((pc) => 48 + pc)

  const run = (action: () => void) => {
    void audioEngine.init().then(() => action())
  }

  return (
    <div className="playback-bar">
      <Button
        variant="primary"
        round
        aria-label="Play chord"
        onClick={() => run(() => audioEngine.playChord(voice))}
      >
        <svg className="play-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </Button>
      <Button variant="ghost" onClick={() => run(() => audioEngine.playChord(voice))}>
        Play chord
      </Button>
      <Button variant="ghost" onClick={() => run(() => audioEngine.playArpeggio(voice))}>
        Arpeggiate
      </Button>
      <Button variant="ghost" onClick={() => run(() => audioEngine.playScale(scale))}>
        Play scale
      </Button>
      <span className="playback-state" role="status" aria-live="polite">
        {playing === 'playing' ? 'Playing…' : 'Ready'}
      </span>
      {playing === 'playing' && (
        <Button variant="ghost" onClick={() => audioEngine.stopPlayback()}>
          Stop
        </Button>
      )}
    </div>
  )
}
