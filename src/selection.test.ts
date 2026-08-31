import { describe, expect, it } from 'vitest'
import { defaultSelectionLabel } from './selection'

describe('default selection', () => {
  it('shows C major before any user input', () => {
    expect(defaultSelectionLabel()).toBe('C major')
  })
})