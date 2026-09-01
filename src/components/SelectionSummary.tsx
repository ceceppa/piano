import type { ReactNode } from 'react'
import { chordName, inversionName, scaleLabel, slashChordLabel } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import Chip from './shared/Chip'
import './SelectionSummary.css'

interface SelectionSummaryProps {
  /** The legend sits on the same row, right-aligned. */
  aside?: ReactNode
}

/**
 * One line naming what is currently selected in the active view — "G6",
 * "G major scale", or "G6 with G major scale" (ux-flow §Explore). When an
 * inversion is chosen it also carries the slash-chord symbol and the inversion
 * name (design-brief §Header slash-chord label).
 */
export default function SelectionSummary({ aside }: SelectionSummaryProps) {
  const { root, quality, scaleType, viewMode, inversion } = useSelectionStore((s) => s.selection)

  const chord = chordName(root, quality)
  const scale = `${scaleLabel(root, scaleType)} scale`
  const slash = slashChordLabel({ root, quality }, inversion)

  // When an inversion is chosen the chord's own symbol becomes the slash-chord
  // symbol, so the line names the selection once rather than twice.
  const chordDisplay = slash ?? chord
  const showChordPart = viewMode !== 'scale'
  const showScalePart = viewMode !== 'chord'
  const title = showChordPart && showScalePart
    ? `${chordDisplay} with ${scale}`
    : showChordPart
      ? chordDisplay
      : scale
  // Only the selection is announced, so a change does not re-read the page
  // (phase brief 5b).
  const announcement = showChordPart && slash ? `${title}, ${inversionName(inversion)}` : title

  return (
    <div className="selection-summary">
      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>
      <div className="selection-summary-main">
        <h2 className="selection-title">
          {showChordPart && (slash ? <span className="slash-label">{slash}</span> : chord)}
          {showChordPart && showScalePart && ' with '}
          {showScalePart && scale}
          {showChordPart && slash && (
            <>
              {' '}
              <span className="inversion-name">{inversionName(inversion)}</span>
            </>
          )}
        </h2>
        {viewMode === 'both' && (
          <div className="selection-chips">
            <Chip>Chord: {chord}</Chip>
            <Chip>Scale: {scaleLabel(root, scaleType)}</Chip>
          </div>
        )}
      </div>
      {aside}
    </div>
  )
}
