import type { SelectHTMLAttributes } from 'react'
import type { ReactNode } from 'react'
import './shared.css'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  children: ReactNode
}

export default function Select({ label, className = '', children, ...rest }: SelectProps) {
  return (
    <label className={`field ${className}`.trim()}>
      <span className="field-label">{label}</span>
      <select {...rest}>{children}</select>
    </label>
  )
}
