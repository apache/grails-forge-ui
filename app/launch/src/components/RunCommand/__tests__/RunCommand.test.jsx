import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CreateCommand } from '../../../micronaut/CreateCommand'
import RunCommand from '../RunCommand'

const createCommand = new CreateCommand(
  {
    type: 'WEB',
    javaVersion: 'JDK_25',
    name: 'demo',
    package: 'com.example',
    features: {},
  },
  'https://latest.grails.org'
)

let current = createCommand

vi.mock('../../../state/store', () => ({
  useCreateCommand: () => current,
}))

afterEach(() => {
  current = createCommand
})

describe('RunCommand', () => {
  it('renders nothing while closed', () => {
    render(<RunCommand open={false} onClose={vi.fn()} />)

    expect(screen.queryByText('Run it from your terminal')).toBeNull()
  })

  it('shows the one-line command with a button that copies it', () => {
    render(<RunCommand open onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Unix/Linux/macOS' }))

    expect(screen.getByText(createCommand.toRunCommand('*nix'))).toBeTruthy()
    expect(document.querySelector('.copy-to-clipboard')).toBeTruthy()
    expect(screen.getByText(/needs JDK 25 or newer/)).toBeTruthy()
  })

  it('switches to the PowerShell command for Windows', () => {
    render(<RunCommand open onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Windows' }))

    expect(screen.getByText(createCommand.toRunCommand('win'))).toBeTruthy()
    expect(screen.getByText(/Paste it into PowerShell/)).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: 'Windows' })
        .getAttribute('aria-pressed')
    ).toBe('true')
  })

  it('offers nothing to copy for a name a shared link could not have come from Forge with', () => {
    current = new CreateCommand(
      { ...createCommand, package: 'com.example', name: "demo';touch pwned;'" },
      'https://latest.grails.org'
    )
    render(<RunCommand open onClose={vi.fn()} />)

    expect(document.querySelector('.copy-to-clipboard')).toBeNull()
    expect(screen.queryByText(/touch pwned/)).toBeNull()
    expect(
      screen.getByText(/Use a name that starts with a letter/)
    ).toBeTruthy()
  })

  it('closes from its Close button', () => {
    const onClose = vi.fn()
    render(<RunCommand open onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
