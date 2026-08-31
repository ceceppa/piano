import { useSelectionStore } from '../store/useSelectionStore'
import Select from './shared/Select'

const GENRES = ['Any', 'Pop', 'Rock', 'Jazz', 'Blues', 'Classical'] as const

export default function GenreSelector() {
  const genre = useSelectionStore((s) => s.selection.genre)
  const setGenre = useSelectionStore((s) => s.setGenre)

  return (
    <Select label="Genre context" value={genre} onChange={(e) => setGenre(e.target.value)}>
      {GENRES.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
    </Select>
  )
}
