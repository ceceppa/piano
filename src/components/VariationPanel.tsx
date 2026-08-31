import { QUALITIES, chordName, rootPositionVoice } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import * as audioEngine from '../audioEngine'
import Card from './shared/Card'
import Chip from './shared/Chip'
import './VariationPanel.css'

export default function VariationPanel() {
  const selection = useSelectionStore((s) => s.selection)
  const setQuality = useSelectionStore((s) => s.setQuality)
  const setViewMode = useSelectionStore((s) => s.setViewMode)

  const { root, quality } = selection

  const selectVariation = (id: (typeof QUALITIES)[number]['id']) => {
    setQuality(id)
    setViewMode('both')
    void audioEngine.init().then(() => {
      audioEngine.playChord(rootPositionVoice({ root, quality: id }))
    })
  }

  return (
    <Card header={`Variations of ${chordName(root, quality)}`}>
      <ul className="variation-list">
        {QUALITIES.map((q) => {
          const selected = q.id === quality
          return (
            <li key={q.id}>
              <button
                type="button"
                className={`variation-item${selected ? ' variation-item-selected' : ''}`}
                aria-pressed={selected}
                onClick={() => selectVariation(q.id)}
              >
                <span className="variation-name">{chordName(root, q.id)}</span>
                <Chip className="variation-guide">{q.genreGuide[0]}</Chip>
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
