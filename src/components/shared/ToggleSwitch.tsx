import './shared.css'

export interface ToggleSwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export default function ToggleSwitch({ label, checked, onChange, className = '' }: ToggleSwitchProps) {
  return (
    <label className={`switch ${className}`.trim()}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        aria-checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-track" aria-hidden="true">
        <span className="switch-knob" />
      </span>
      <span className="switch-text">{label}</span>
    </label>
  )
}
