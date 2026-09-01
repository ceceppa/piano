import { inversionShortName, validInversionCount } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import SegmentedControl from './shared/SegmentedControl'

/**
 * Compact inversion buttons in the same tier as the view and root selectors
 * (design-brief §Inversion selector). Only the inversions the current chord
 * quality actually has are offered; App hides the whole control in Scale view.
 */
export default function InversionSelector() {
  const root = useSelectionStore((s) => s.selection.root)
  const quality = useSelectionStore((s) => s.selection.quality)
  const inversion = useSelectionStore((s) => s.selection.inversion)
  const setInversion = useSelectionStore((s) => s.setInversion)

  const count = validInversionCount({ root, quality })
  const options = Array.from({ length: count }, (_, i) => ({ value: i, label: inversionShortName(i) }))

  return (
    <SegmentedControl
      label="Inversion"
      className="inversion-seg"
      hint="Changes which chord note is lowest."
      options={options}
      value={inversion}
      onChange={setInversion}
    />
  )
}
