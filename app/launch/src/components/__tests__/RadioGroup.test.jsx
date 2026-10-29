import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import RadioGroup from '../RadioGroup'

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  {
    value: 'c',
    label: 'Gamma',
    group: 'Legacy',
    hint: 'Support ended 2026-10-31',
  },
  { value: 'd', label: 'Delta', group: 'Legacy' },
]

const renderGroup = (props = {}) =>
  render(
    <RadioGroup
      id="demo"
      name="demo"
      label="Demo"
      value="a"
      onChange={vi.fn()}
      options={OPTIONS}
      {...props}
    />
  )

const rowClasses = (container) =>
  [...container.querySelectorAll('.radio-group > div')].map(
    (el) => el.className
  )

describe('RadioGroup', () => {
  it('renders no divider when options carry no group', () => {
    const { container } = renderGroup({ options: OPTIONS.slice(0, 2) })

    expect(screen.queryByRole('separator')).toBeNull()
    expect(rowClasses(container)).toEqual(['radio-row', 'radio-row'])
  })

  it('draws one divider ahead of the first option of a group', () => {
    const { container } = renderGroup()

    const separators = screen.getAllByRole('separator')
    expect(separators).toHaveLength(1)
    expect(separators[0].textContent).toBe('Legacy')
    expect(rowClasses(container)).toEqual([
      'radio-row',
      'radio-row',
      'radio-divider',
      'radio-row',
      'radio-row',
    ])
  })

  it('shows a hint under its option and keeps the option selectable', () => {
    const onChange = vi.fn()
    renderGroup({ onChange })

    expect(screen.getByText('Support ended 2026-10-31').className).toBe(
      'radio-hint'
    )
    fireEvent.click(screen.getByRole('radio', { name: /Gamma/ }))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('renders placeholders without dividers while loading', () => {
    const { container } = renderGroup({ loading: true, expected: 2 })

    expect(screen.queryByRole('separator')).toBeNull()
    expect(rowClasses(container)).toEqual(['radio-row', 'radio-row'])
  })
})
