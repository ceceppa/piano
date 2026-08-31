import { useSelectionStore } from '../store/useSelectionStore'
import type { ScaleMode } from '../store/useSelectionStore'
import SegmentedControl from './shared/SegmentedControl'

const OPTIONS: { value: ScaleMode; label: string }[] = [
  { value: 'chord-root', label: 'Chord root' },
  { value: 'key', label: 'Selected key' },
]

export default function ScaleFollow() {
  const scaleMode = useSelectionStore((s) => s.selection.scaleMode)
  const setScaleMode = useSelectionStore((s) => s.setScaleMode)

  return (
    <SegmentedControl label="Scale follows" options={OPTIONS} value={scaleMode} onChange={setScaleMode} />
  )
}
