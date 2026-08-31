import { PITCH_CLASS_LABELS } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import SegmentedControl from './shared/SegmentedControl'

export default function RootSelector() {
  const root = useSelectionStore((s) => s.selection.root)
  const setRoot = useSelectionStore((s) => s.setRoot)

  return (
    <SegmentedControl
      label="Root note"
      className="root-seg"
      options={PITCH_CLASS_LABELS.map((label, value) => ({ value, label }))}
      value={root}
      onChange={setRoot}
    />
  )
}
