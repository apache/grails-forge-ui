import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import RadioGroup from '../RadioGroup'

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', group: 'Legacy', hint: 'ended 2026-10-31' },
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
  [...container.querySelectorAll('.radio-group > *')]
    .filter((el) => el.tagName !== 'LABEL')
    .map((el) => el.className)

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

  it('shows a hint after its option and keeps the option selectable', () => {
    const onChange = vi.fn()
    renderGroup({ onChange })

    expect(screen.getByText('ended 2026-10-31').className).toBe('radio-hint')
    fireEvent.click(screen.getByRole('radio', { name: /Gamma/ }))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('renders placeholders without dividers while loading', () => {
    const { container } = renderGroup({ loading: true, expected: 2 })

    expect(screen.queryByRole('separator')).toBeNull()
    expect(rowClasses(container)).toEqual(['radio-row', 'radio-row'])
  })

  describe('with a group toggle', () => {
    it('leaves out the options of a collapsed group behind a disclosure button', () => {
      const onToggleGroup = vi.fn()
      const { container } = renderGroup({
        collapsedGroups: ['Legacy'],
        onToggleGroup,
      })

      const toggle = screen.getByRole('button', { name: 'Legacy' })
      expect(toggle.getAttribute('aria-expanded')).toBe('false')
      expect(screen.queryByRole('separator')).toBeNull()
      expect(screen.queryByRole('radio', { name: /Gamma/ })).toBeNull()
      expect(rowClasses(container)).toEqual([
        'radio-row',
        'radio-row',
        'radio-divider radio-divider-toggle',
      ])

      fireEvent.click(toggle)
      expect(onToggleGroup).toHaveBeenCalledWith('Legacy')
    })

    it('lists the options of an expanded group under the disclosure button', () => {
      const { container } = renderGroup({
        collapsedGroups: [],
        onToggleGroup: vi.fn(),
      })

      const toggle = screen.getByRole('button', { name: 'Legacy' })
      expect(toggle.getAttribute('aria-expanded')).toBe('true')
      expect(screen.getByRole('radio', { name: /Gamma/ })).toBeTruthy()
      expect(rowClasses(container)).toEqual([
        'radio-row',
        'radio-row',
        'radio-divider radio-divider-toggle',
        'radio-row',
        'radio-row',
      ])
    })

    it('keeps option ids stable so a collapsed group does not renumber the rest', () => {
      renderGroup({ collapsedGroups: ['Legacy'], onToggleGroup: vi.fn() })

      expect(screen.getByRole('radio', { name: 'Beta' }).id).toBe(
        'demo-radio-1'
      )
    })
  })
})
