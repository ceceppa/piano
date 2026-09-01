import { useSelectionStore } from '../store/useSelectionStore'
import type { VoicingType } from '../musicCore'
import SegmentedControl from './shared/SegmentedControl'

const OPTIONS: { value: VoicingType; label: string }[] = [
  { value: 'close', label: 'Close' },
  { value: 'open', label: 'Open' },
  { value: 'leftRight', label: 'Left/Right hands' },
]

export default function VoicingSelector() {
  const voicingType = useSelectionStore((s) => s.selection.voicingType)
  const setVoicingType = useSelectionStore((s) => s.setVoicingType)

  return (
    <SegmentedControl label="Voicing" className="voicing-seg" options={OPTIONS} value={voicingType} onChange={setVoicingType} />
  )
}
