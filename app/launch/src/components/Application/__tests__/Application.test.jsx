import React from 'react'
import { render } from '@testing-library/react'
import { useAppStore } from '../../../state/store'
import ApplicationState from '../../../state/ApplicationState'

import { App } from '../App'

beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState())
})

it(`Application Launches`, () => {
  const { container } = render(
    <ApplicationState initialData={{}}>
      <App />
    </ApplicationState>
  )
  expect(container).toBeDefined()
})
