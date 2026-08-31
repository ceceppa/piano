import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Button from './Button'
import Card from './Card'
import Chip from './Chip'
import SegmentedControl from './SegmentedControl'
import Select from './Select'
import ToggleSwitch from './ToggleSwitch'

let container: HTMLDivElement
let root: Root

function render(node: React.ReactNode) {
  act(() => {
    root.render(node)
  })
}

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('shared Button', () => {
  it('renders a native button of type button', () => {
    render(<Button>Go</Button>)
    const btn = container.querySelector('button')!
    expect(btn.tagName).toBe('BUTTON')
    expect(btn.type).toBe('button')
    expect(btn.textContent).toBe('Go')
  })

  it('reflects pressed state via aria-pressed and a pressed class', () => {
    render(<Button pressed>Go</Button>)
    const btn = container.querySelector('button')!
    expect(btn.getAttribute('aria-pressed')).toBe('true')
    expect(btn.classList.contains('btn-pressed')).toBe(true)
  })

  it('disables with the native disabled attribute', () => {
    render(<Button disabled>Go</Button>)
    const btn = container.querySelector('button')!
    expect(btn.disabled).toBe(true)
  })
})

describe('shared Select', () => {
  it('renders a native select with a visible label', () => {
    render(
      <Select label="Chord quality" value="major" onChange={() => {}}>
        <option value="major">major</option>
      </Select>,
    )
    const label = container.querySelector('.field-label')!
    expect(label.textContent).toBe('Chord quality')
    expect(container.querySelector('select')!.tagName).toBe('SELECT')
  })
})

describe('shared SegmentedControl', () => {
  it('renders a single-choice radio group with a checked option', () => {
    render(
      <SegmentedControl
        label="View mode"
        options={[
          { value: 'chord', label: 'Chord' },
          { value: 'scale', label: 'Scale' },
        ]}
        value="chord"
        onChange={() => {}}
      />,
    )
    const group = container.querySelector('[role="radiogroup"]')!
    expect(group.getAttribute('aria-label')).toBe('View mode')
    const radios = [...container.querySelectorAll<HTMLButtonElement>('[role="radio"]')]
    expect(radios).toHaveLength(2)
    expect(radios[0].getAttribute('aria-checked')).toBe('true')
    expect(radios[1].getAttribute('aria-checked')).toBe('false')
  })

  it('calls onChange with the selected value', () => {
    const onChange = vi.fn()
    render(
      <SegmentedControl
        label="Root"
        options={[{ value: 0, label: 'C' }]}
        value={0}
        onChange={onChange}
      />,
    )
    act(() => {
      container.querySelector('[role="radio"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(onChange).toHaveBeenCalledWith(0)
  })
})

describe('shared ToggleSwitch', () => {
  it('renders a switch whose aria-checked reflects the state and is togglable', () => {
    const onChange = vi.fn()
    render(<ToggleSwitch label="Dark" checked={false} onChange={onChange} />)
    const input = container.querySelector('input[role="switch"]')!
    expect(input.getAttribute('aria-checked')).toBe('false')
    act(() => {
      input.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(onChange).toHaveBeenCalledWith(true)
    expect(input.getAttribute('aria-checked')).toBe('false')
  })
})

describe('shared Card and Chip', () => {
  it('Card renders a padded container with a themed header', () => {
    render(<Card header="Variations">rows</Card>)
    expect(container.querySelector('.card-header')!.textContent).toBe('Variations')
    expect(container.querySelector('.card-body')!.textContent).toBe('rows')
  })

  it('Chip renders a pill label with always-visible text', () => {
    render(<Chip>Common in Blues</Chip>)
    const chip = container.querySelector('.chip')!
    expect(chip.textContent).toBe('Common in Blues')
  })
})
