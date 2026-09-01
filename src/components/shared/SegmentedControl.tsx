import { useRef, useState } from 'react'
import './shared.css'

export interface SegmentedOption<T extends string | number> {
  value: T
  label: string
}

export interface SegmentedControlProps<T extends string | number> {
  label: string
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  /** One plain sentence revealed by a "?" affordance beside the label. */
  hint?: string
}

export default function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className = '',
  hint,
}: SegmentedControlProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null)
  const [hintOpen, setHintOpen] = useState(false)

  // One single-select group under the arrow keys: Left/Up step back, Right/Down
  // step forward, Home/End jump to the ends, and the selection follows focus.
  const onKeyDown = (index: number) => (e: React.KeyboardEvent) => {
    const last = options.length - 1
    let next: number
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    else return

    e.preventDefault()
    onChange(options[next].value)
    groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus()
  }

  return (
    <fieldset className={`seg-group ${className}`.trim()}>
      <legend className="seg-label">
        {label}
        {hint && (
          <span className="seg-hint">
            <button
              type="button"
              className="seg-hint-toggle"
              aria-expanded={hintOpen}
              aria-label={`What ${label} does`}
              onClick={() => setHintOpen((open) => !open)}
            >
              ?
            </button>
            <span className="seg-hint-text" role="tooltip" data-open={hintOpen || undefined}>
              {hint}
            </span>
          </span>
        )}
      </legend>
      <div className="seg" role="radiogroup" aria-label={label} ref={groupRef}>
        {options.map((o, i) => {
          const selected = o.value === value
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              className={`seg-option${selected ? ' seg-option-selected' : ''}`}
              onClick={() => onChange(o.value)}
              onKeyDown={onKeyDown(i)}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
