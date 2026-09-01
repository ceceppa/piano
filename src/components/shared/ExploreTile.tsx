import './shared.css'

export interface ExploreTileProps {
  /** The chord symbol or scale name, in notation type. */
  title: string
  /** One short explanatory line beneath it. */
  description: string
  selected: boolean
  onClick: () => void
}

/**
 * One selectable tile in an Explore list. The chord list and the scale list use
 * the same component so the two read as one pattern and a person learns the
 * interaction once (design-brief §Chord-type tile grid, §Scale-type list).
 */
export default function ExploreTile({ title, description, selected, onClick }: ExploreTileProps) {
  return (
    <button
      type="button"
      className={`explore-tile${selected ? ' explore-tile-selected' : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className="explore-tile-title">{title}</span>
      <span className="explore-tile-label">{description}</span>
    </button>
  )
}
