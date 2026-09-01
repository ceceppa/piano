import { inversionName, validInversionCount } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import SegmentedControl from './shared/SegmentedControl'

export default function InversionSelector() {
  const root = useSelectionStore((s) => s.selection.root)
  const quality = useSelectionStore((s) => s.selection.quality)
  const inversion = useSelectionStore((s) => s.selection.inversion)
  const setInversion = useSelectionStore((s) => s.setInversion)

  const count = validInversionCount({ root, quality })
  const options = Array.from({ length: count }, (_, i) => ({ value: i, label: inversionName(i) }))

  return (
    <SegmentedControl label="Inversion" className="inversion-seg" options={options} value={inversion} onChange={setInversion} />
  )
}
