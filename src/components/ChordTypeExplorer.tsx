import { QUALITIES, chordName, isRecommendedForGenre, noteName, rootPositionVoice } from '../musicCore'
import type { QualityId } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import * as audioEngine from '../audioEngine'
import Chip from './shared/Chip'
import './ChordTypeExplorer.css'

interface Group {
  title: string
  ids: readonly QualityId[]
}

/** Grouping is a design-brief decision (§Chord-type tile grid), not derived. */
const GROUPS: readonly Group[] = [
  { title: 'Core', ids: ['major', 'minor', 'diminished', 'augmented'] },
  { title: 'Colour', ids: ['sus2', 'sus4', '6', 'add9'] },
  { title: 'Sevenths & extensions', ids: ['7', 'maj7', 'm7', '9'] },
]

function qualityById(id: QualityId) {
  const q = QUALITIES.find((q) => q.id === id)
  if (!q) throw new Error(`unknown chord quality: ${id}`)
  return q
}

export default function ChordTypeExplorer() {
  const selection = useSelectionStore((s) => s.selection)
  const setQuality = useSelectionStore((s) => s.setQuality)
  const setViewMode = useSelectionStore((s) => s.setViewMode)

  const { root, quality, genre } = selection

  const selectQualityId = (id: QualityId) => {
    setQuality(id)
    setViewMode('both')
    void audioEngine.init().then(() => {
      audioEngine.playChord(rootPositionVoice({ root, quality: id }))
    })
  }

  return (
    <section className="chord-explore" aria-label={`Explore ${noteName(root)} chord types`}>
      <h2 className="chord-explore-title">Explore {noteName(root)} chord types</h2>
      {GROUPS.map((group) => (
        <div className="chord-group" key={group.title}>
          <h3 className="chord-group-title">{group.title}</h3>
          <div className="chord-tile-grid">
            {group.ids.map((id) => {
              const q = qualityById(id)
              const selected = id === quality
              const recommended = isRecommendedForGenre(id, genre)
              return (
                <button
                  key={id}
                  type="button"
                  className={`chord-tile${selected ? ' chord-tile-selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => selectQualityId(id)}
                >
                  <span className="chord-tile-symbol">{chordName(root, id)}</span>
                  <span className="chord-tile-label">{q.genreGuide[0]}</span>
                  {recommended && <Chip className="chord-tile-recommended">Recommended</Chip>}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}
