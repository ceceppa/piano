import type { ButtonHTMLAttributes } from 'react'
import './shared.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  pressed?: boolean
  round?: boolean
}

export default function Button({
  variant = 'ghost',
  pressed,
  round = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, round ? 'btn-round' : '', pressed ? 'btn-pressed' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <button
      type="button"
      className={classes}
      aria-pressed={pressed === undefined ? undefined : pressed}
      {...rest}
    >
      {children}
    </button>
  )
}
