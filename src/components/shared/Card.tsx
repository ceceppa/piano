import type { ReactNode } from 'react'
import './shared.css'

export interface CardProps {
  header?: string
  className?: string
  children: ReactNode
}

export default function Card({ header, className = '', children }: CardProps) {
  return (
    <section className={`card ${className}`.trim()}>
      {header && <header className="card-header">{header}</header>}
      <div className="card-body">{children}</div>
    </section>
  )
}
