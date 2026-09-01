import type { ButtonHTMLAttributes, Ref } from 'react'
import './shared.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  pressed?: boolean
  round?: boolean
  ref?: Ref<HTMLButtonElement>
}

export default function Button({
  variant = 'ghost',
  pressed,
  round = false,
  className = '',
  children,
  ref,
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, round ? 'btn-round' : '', pressed ? 'btn-pressed' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      aria-pressed={pressed === undefined ? undefined : pressed}
      {...rest}
    >
      {children}
    </button>
  )
}
