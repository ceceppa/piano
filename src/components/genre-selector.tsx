import { GENRES } from '../musicCore'
import type { GenreId } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import Select from './shared/Select'

export default function GenreSelector() {
  const genre = useSelectionStore((s) => s.selection.genre)
  const setGenre = useSelectionStore((s) => s.setGenre)

  return (
    <Select
      label="Genre context"
      value={genre}
      onChange={(e) => setGenre(e.target.value as GenreId)}
    >
      {GENRES.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
    </Select>
  )
}
