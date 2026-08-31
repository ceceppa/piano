import type { ReactNode } from 'react'
import './shared.css'

export interface ChipProps {
  children: ReactNode
  className?: string
}

export default function Chip({ children, className = '' }: ChipProps) {
  return <span className={`chip ${className}`.trim()}>{children}</span>
}
