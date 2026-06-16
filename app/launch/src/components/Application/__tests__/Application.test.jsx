import React from 'react'
import { render } from '@testing-library/react'
import ApplicationState from '../../../state/ApplicationState'
import { useAppStore } from '../../../state/store'

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

  expect(container.querySelector('.mn-starter-form-main')).not.toBeNull()
  expect(container.querySelector('.button-row')).not.toBeNull()
})
