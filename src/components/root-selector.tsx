import { useRef } from 'react'
import { PITCH_CLASS_FLAT_LABELS, PITCH_CLASS_LABELS } from '../musicCore'
import { useSelectionStore } from '../store/useSelectionStore'
import './root-selector.css'

/**
 * The twelve chromatic roots as directly selectable buttons — never a dropdown,
 * at any screen width (design-brief §Chromatic root selector). Its own component
 * rather than the shared SegmentedControl because each button carries two
 * stacked labels: the sharp spelling over the flat one for the five accidentals.
 */
export default function RootSelector() {
  const root = useSelectionStore((s) => s.selection.root)
  const setRoot = useSelectionStore((s) => s.setRoot)
  const groupRef = useRef<HTMLDivElement>(null)

  const focusRoot = (value: number) => {
    groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[value]?.focus()
  }

  const onKeyDown = (value: number) => (e: React.KeyboardEvent) => {
    let next: number
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (value + 1) % 12
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (value + 11) % 12
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = 11
    else return

    e.preventDefault()
    setRoot(next)
    focusRoot(next)
  }

  return (
    <fieldset className="seg-group root-selector">
      <legend className="seg-label">Root note</legend>
      <div className="root-row" role="radiogroup" aria-label="Root note" ref={groupRef}>
        {PITCH_CLASS_LABELS.map((label, value) => {
          const flat = PITCH_CLASS_FLAT_LABELS[value]
          const selected = value === root
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={flat ? `${label} or ${flat}` : label}
              tabIndex={selected ? 0 : -1}
              className={`root-button${selected ? ' root-button-selected' : ''}`}
              onClick={() => setRoot(value)}
              onKeyDown={onKeyDown(value)}
            >
              <span className="root-sharp" aria-hidden="true">
                {label}
              </span>
              {flat && (
                <span className="root-flat" aria-hidden="true">
                  {flat}
                </span>
              )}
              <span className="root-marker" aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
