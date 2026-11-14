import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CreateCommand } from '../../../micronaut/CreateCommand'
import GenerateButtons from '../GenerateButtons'

const createCommand = new CreateCommand(
  {
    type: 'WEB',
    javaVersion: 'JDK_21',
    name: 'demo',
    package: 'com.example',
    features: {},
  },
  'https://latest.grails.org'
)

vi.mock('../../../state/store', () => ({
  useStarterForm: () => ({ name: 'demo' }),
  useCreateCommand: () => createCommand,
}))

describe('GenerateButtons', () => {
  it('opens the one-line run command from the Generate project menu and closes the menu', async () => {
    render(<GenerateButtons generateProject={vi.fn()} theme="light" />)

    fireEvent.click(screen.getByRole('button', { name: /Generate project/ }))
    fireEvent.click(screen.getByRole('menuitem', { name: /Run from Terminal/ }))

    expect(screen.getByText('Run it from your terminal')).toBeTruthy()
    await waitFor(() =>
      expect(
        screen.queryByRole('menuitem', { name: /Download Zip/ })
      ).toBeNull()
    )
  })
})
