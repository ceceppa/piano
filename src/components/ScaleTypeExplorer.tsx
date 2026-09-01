import { SELECTABLE_SCALES, noteName } from '../musicCore'
import type { ScaleTypeId } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import ExploreTile from './shared/ExploreTile'
import './explore-list.css'

/**
 * The scale-type picker, in the same tile language as the chord grid so the two
 * read as one pattern (design-brief §Scale-type list). It offers the scales the
 * app already supports; while that is only Major and Natural minor they sit
 * under a single "Common" heading. Choosing one keeps the chord and inversion.
 */
export default function ScaleTypeExplorer() {
  const root = useSelectionStore((s) => s.selection.root)
  const scaleType = useSelectionStore((s) => s.selection.scaleType)
  const setScaleType = useSelectionStore((s) => s.setScaleType)

  return (
    <section className="explore-list scale-explore" aria-label={`Explore ${noteName(root)} scales`}>
      <h2 className="explore-list-title scale-explore-title">Explore {noteName(root)} scales</h2>
      <div className="explore-group">
        <h3 className="explore-group-title">Common</h3>
        <div className="explore-tile-grid">
          {SELECTABLE_SCALES.map((scale) => (
            <ExploreTile
              key={scale.id}
              title={scale.name}
              description={scale.description}
              selected={scale.id === scaleType}
              onClick={() => setScaleType(scale.id as ScaleTypeId)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
