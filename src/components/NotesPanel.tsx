import { chordScaleType, noteName, scaleTones, voice } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import Card from './shared/Card'
import './NotesPanel.css'

export default function NotesPanel() {
  const selection = useSelectionStore((s) => s.selection)
  const { root, quality, key, scaleMode, viewMode, inversion } = selection

  // Bass to treble in the selected inversion (S2b+2, phase-4 correction) — the
  // voicing type stays keyboard-only, so this always reads the close voicing.
  const chordNotes = voice({ root, quality }, inversion, 'close')
    .map((n) => noteName(n.midi % 12))
    .join(' · ')

  const scaleRoot = scaleMode === 'key' ? key.root : root
  const scaleType = scaleMode === 'key' ? key.scaleType : chordScaleType(quality)
  const scaleNotes = scaleTones(scaleRoot, scaleType).map(noteName).join(' · ')

  return (
    <Card header="Notes" className="notes-panel">
      {viewMode !== 'scale' && (
        <div className="notes-row">
          <span className="notes-label">Chord:</span>
          <span className="notes-value">{chordNotes}</span>
        </div>
      )}
      {viewMode !== 'chord' && (
        <div className="notes-row">
          <span className="notes-label">Scale:</span>
          <span className="notes-value">{scaleNotes}</span>
        </div>
      )}
    </Card>
  )
}
