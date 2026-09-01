import { useSelectionStore } from '../store/useSelectionStore'
import type { ViewMode } from '../store/useSelectionStore'
import SegmentedControl from './shared/SegmentedControl'

const OPTIONS: { value: ViewMode; label: string }[] = [
  { value: 'chord', label: 'Chord' },
  { value: 'scale', label: 'Scale' },
  { value: 'both', label: 'Both' },
]

/**
 * "Show on piano" — the primary intent control (design-brief §View selector).
 * The choice sets what the whole screen shows, so it sits in the top tier
 * beside the root selector rather than in a quieter secondary row.
 */
export default function ViewModeSelector() {
  const viewMode = useSelectionStore((s) => s.selection.viewMode)
  const setViewMode = useSelectionStore((s) => s.setViewMode)

  return (
    <SegmentedControl
      label="Show on piano"
      className="view-seg"
      options={OPTIONS}
      value={viewMode}
      onChange={setViewMode}
    />
  )
}
