import { useSelectionStore } from '../store/useSelectionStore'
import './Legend.css'

interface Role {
  state: 'root' | 'chord-tone' | 'scale-note' | 'shared'
  label: string
}

const ROOT: Role = { state: 'root', label: 'Root' }
const CHORD: Role = { state: 'chord-tone', label: 'Chord note' }
const SCALE: Role = { state: 'scale-note', label: 'Scale note' }
const SHARED: Role = { state: 'shared', label: 'Chord + scale' }

/**
 * A compact key beside the piano naming only the roles the active view actually
 * uses (design-brief §Legend). Each row carries the marker's own shape as well
 * as its colour, so it reads the same way the keys do.
 */
export default function Legend() {
  const viewMode = useSelectionStore((s) => s.selection.viewMode)

  const roles: Role[] =
    viewMode === 'chord'
      ? [ROOT, CHORD]
      : viewMode === 'scale'
        ? [ROOT, SCALE]
        : [ROOT, CHORD, SCALE, SHARED]

  return (
    <ul className="legend" aria-label="Keyboard legend">
      {roles.map((role) => (
        <li className="legend-row" key={role.state}>
          <span className={`legend-swatch legend-swatch-${role.state}`} aria-hidden="true">
            <span className={`key-marker marker-${role.state}`} />
          </span>
          <span className="legend-label">{role.label}</span>
        </li>
      ))}
    </ul>
  )
}
