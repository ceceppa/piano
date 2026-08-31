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
}

export default function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <fieldset className={`seg-group ${className}`.trim()}>
      <legend className="seg-label">{label}</legend>
      <div className="seg" role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const selected = o.value === value
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`seg-option${selected ? ' seg-option-selected' : ''}`}
              onClick={() => onChange(o.value)}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
