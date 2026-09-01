import { chordScaleType, chordTones, noteName, scaleTones } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import Card from './shared/Card'
import './NotesPanel.css'

export default function NotesPanel() {
  const selection = useSelectionStore((s) => s.selection)
  const { root, quality, key, scaleMode, viewMode } = selection

  const chordNotes = chordTones(root, quality).map(noteName).join(' · ')

  const scaleRoot = scaleMode === 'key' ? key.root : root
  const scaleType = scaleMode === 'key' ? key.scaleType : chordScaleType(quality)
  const scaleNotes = scaleTones(scaleRoot, scaleType).map(noteName).join(' · ')

  return (
    <Card header="Notes" className="notes-panel">
      <div className="notes-row">
        <span className="notes-label">Chord:</span>
        <span className="notes-value">{chordNotes}</span>
      </div>
      {viewMode !== 'chord' && (
        <div className="notes-row">
          <span className="notes-label">Scale:</span>
          <span className="notes-value">{scaleNotes}</span>
        </div>
      )}
    </Card>
  )
}
