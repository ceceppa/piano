import { useState } from 'react'
import {
  SCALES,
  chordName,
  noteName,
  qualityById,
  scaleLabel,
  scaleStepPattern,
  scaleTones,
  sharedTones,
  voice,
} from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import Card from './shared/Card'
import './UnderstandSection.css'

function noteList(pitchClasses: number[]): string {
  return pitchClasses.map(noteName).join(' · ')
}

/**
 * The mode-aware learning section (design-brief §Understand section). Chord view
 * lists the chord's notes and one plain sentence about it; Scale view does the
 * same for the scale and never repeats chord content, on screen or in what a
 * screen reader announces; Both view adds a shared-notes row.
 */
export default function UnderstandSection() {
  const { root, quality, scaleType, viewMode, inversion } = useSelectionStore((s) => s.selection)
  const [showDetail, setShowDetail] = useState(false)

  const showChord = viewMode !== 'scale'
  const showScale = viewMode !== 'chord'

  const chord = qualityById(quality)
  const scale = SCALES[scaleType]

  // Bass to treble in the selected inversion; the voicing type stays
  // keyboard-only, so this always reads the close voicing.
  const chordNotes = noteList(voice({ root, quality }, inversion, 'close').map((n) => n.midi % 12))
  const scaleNotes = noteList(scaleTones(root, scaleType))
  const shared = noteList(sharedTones(root, quality, scaleType))

  const chordTitle = chordName(root, quality)
  const scaleTitle = scaleLabel(root, scaleType)
  const header = showChord && showScale ? `${chordTitle} and ${scaleTitle}` : showChord ? chordTitle : scaleTitle

  const detailLabel = showChord ? 'intervals' : 'scale degrees'

  return (
    <Card header={`Understand ${header}`} className="understand">
      {showChord && (
        <div className="understand-row">
          <span className="understand-label">{showScale ? 'Chord:' : 'Notes:'}</span>
          <span className="understand-value">{chordNotes}</span>
        </div>
      )}
      {showScale && (
        <div className="understand-row">
          <span className="understand-label">{showChord ? 'Scale:' : 'Notes:'}</span>
          <span className="understand-value">{scaleNotes}</span>
        </div>
      )}
      {showChord && showScale && (
        <div className="understand-row">
          <span className="understand-label">Shared notes:</span>
          <span className="understand-value">{shared || 'None'}</span>
        </div>
      )}
      {showChord && <p className="understand-sentence">{chord.description}</p>}
      {showScale && <p className="understand-sentence">{scale.description}</p>}

      <button
        type="button"
        className="understand-detail-toggle"
        aria-expanded={showDetail}
        onClick={() => setShowDetail((open) => !open)}
      >
        {showDetail ? `Hide ${detailLabel}` : `Show ${detailLabel}`}
      </button>
      {showDetail && (
        <div className="understand-detail">
          {showChord && (
            <div className="understand-row">
              <span className="understand-label">Intervals:</span>
              <span className="understand-value">{chord.formula.join(' · ')}</span>
            </div>
          )}
          {showScale && (
            <div className="understand-row">
              <span className="understand-label">Scale degrees:</span>
              <span className="understand-value">{scale.formula.join(' · ')}</span>
            </div>
          )}
          {showScale && (
            <div className="understand-row">
              <span className="understand-label">Formula:</span>
              <span className="understand-value">{scaleStepPattern(scaleType)}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
