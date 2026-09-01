import { QUALITIES, chordName, noteName, rootPositionVoice } from '../musicCore'
import type { QualityId } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import * as audioEngine from '../audioEngine'
import ExploreTile from './shared/ExploreTile'
import './explore-list.css'

interface Group {
  title: string
  ids: readonly QualityId[]
}

/** Grouping is a design-brief decision (§Chord-type tile grid), not derived. */
const GROUPS: readonly Group[] = [
  { title: 'Common', ids: ['major', 'minor', 'diminished', 'augmented'] },
  { title: 'Colour', ids: ['sus2', 'sus4', '6', 'add9'] },
  { title: 'Sevenths & extensions', ids: ['7', 'maj7', 'm7', '9'] },
]

function qualityById(id: QualityId) {
  const q = QUALITIES.find((q) => q.id === id)
  if (!q) throw new Error(`unknown chord quality: ${id}`)
  return q
}

/**
 * The only way to choose a chord type (design-brief §Chord-type tile grid).
 * Every supported quality is visible under its group heading — no filter row and
 * no See-all control. Choosing one keeps the selected scale untouched.
 */
export default function ChordTypeExplorer() {
  const selection = useSelectionStore((s) => s.selection)
  const setQuality = useSelectionStore((s) => s.setQuality)

  const { root, quality } = selection

  const selectQualityId = (id: QualityId) => {
    setQuality(id)
    void audioEngine.init().then(() => {
      audioEngine.playChord(rootPositionVoice({ root, quality: id }))
    })
  }

  return (
    <section className="explore-list chord-explore" aria-label={`Explore ${noteName(root)} chord types`}>
      <h2 className="explore-list-title chord-explore-title">Explore {noteName(root)} chord types</h2>
      {GROUPS.map((group) => (
        <div className="explore-group" key={group.title}>
          <h3 className="explore-group-title">{group.title}</h3>
          <div className="explore-tile-grid">
            {group.ids.map((id) => (
              <ExploreTile
                key={id}
                title={chordName(root, id)}
                description={qualityById(id).description}
                selected={id === quality}
                onClick={() => selectQualityId(id)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
