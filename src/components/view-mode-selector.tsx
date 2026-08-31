import { useSelectionStore } from '../store/useSelectionStore'
import type { ViewMode } from '../store/useSelectionStore'
import SegmentedControl from './shared/SegmentedControl'

const OPTIONS: { value: ViewMode; label: string }[] = [
  { value: 'chord', label: 'Chord' },
  { value: 'scale', label: 'Scale' },
  { value: 'both', label: 'Both' },
]

export default function ViewModeSelector() {
  const viewMode = useSelectionStore((s) => s.selection.viewMode)
  const setViewMode = useSelectionStore((s) => s.setViewMode)

  return (
    <SegmentedControl label="View mode" options={OPTIONS} value={viewMode} onChange={setViewMode} />
  )
}
