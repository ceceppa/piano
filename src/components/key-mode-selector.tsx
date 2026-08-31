import { PITCH_CLASS_LABELS } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import type { ScaleTypeId } from '../musicCore'
import Select from './shared/Select'

const SCALE_TYPE_OPTIONS: { id: ScaleTypeId; label: string }[] = [
  { id: 'major', label: 'Major' },
  { id: 'naturalMinor', label: 'Natural minor' },
]

export default function KeyModeSelector() {
  const key = useSelectionStore((s) => s.selection.key)
  const setKeyRoot = useSelectionStore((s) => s.setKeyRoot)
  const setKeyScaleType = useSelectionStore((s) => s.setKeyScaleType)

  return (
    <details className="advanced-control">
      <summary>Advanced: key / mode</summary>
      <div className="advanced-control-body">
        <Select
          label="Key root"
          value={key.root}
          onChange={(e) => setKeyRoot(Number(e.target.value))}
        >
          {PITCH_CLASS_LABELS.map((label, value) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select
          label="Mode"
          value={key.scaleType}
          onChange={(e) => setKeyScaleType(e.target.value as ScaleTypeId)}
        >
          {SCALE_TYPE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>
    </details>
  )
}
