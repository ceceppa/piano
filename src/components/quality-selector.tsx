import { QUALITIES } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import Select from './shared/Select'

export default function QualitySelector() {
  const quality = useSelectionStore((s) => s.selection.quality)
  const setQuality = useSelectionStore((s) => s.setQuality)

  return (
    <Select
      label="Chord quality"
      value={quality}
      onChange={(e) => setQuality(e.target.value as (typeof QUALITIES)[number]['id'])}
    >
      {QUALITIES.map((q) => (
        <option key={q.id} value={q.id}>
          {q.id}
        </option>
      ))}
    </Select>
  )
}
