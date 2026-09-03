import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import NextSteps from '../NextSteps'

vi.mock('../../../state/store', () => ({
  useStarterForm: () => ({ name: 'sample-app' }),
}))

it('shows ZIP unpack instructions without GitHub repository details', () => {
  render(
    <NextSteps
      info={{ show: true, type: 'zip' }}
      onClose={vi.fn()}
      onStartOver={vi.fn()}
    />
  )

  expect(screen.getByText('Unzip the archive')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Unix/Linux/macOS' }))
  expect(screen.getByText('unzip sample-app.zip')).toBeTruthy()
})
