import React, { useEffect } from 'react'
import { render, act } from '@testing-library/react'
import ApplicationState from '../../../state/ApplicationState'
import {
  useAppStore,
  useApplicationType,
  useAvailableFeatures,
} from '../../../state/store'

const MockTypes = {
  WEB: { features: ['a', 'b', 'c'] },
}
const MockSdk = {
  baseUrl: 'http://pretend.com',
  features: async ({ type }) => {
    const types = MockTypes[type]
    if (!types) {
      throw new Error('Invalid Type')
    }
    return types
  },
  defaultIncludedFeatures: async ({ type }) => {
    const types = MockTypes[type]
    if (!types) {
      throw new Error('Invalid Type')
    }
    return { features: [] }
  },
}

beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState())
})

const TestView = ({ sdk, applicationType, onError }) => {
  const { features, error } = useAvailableFeatures()
  const [, setType] = useApplicationType()
  const loadAvailableFeatures = useAppStore((s) => s.loadAvailableFeatures)

  useEffect(() => {
    useAppStore.getState().setSelectedVersion({ api: sdk.baseUrl })
    useAppStore.getState().setSdkFactory(() => sdk)
    setType(applicationType)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (applicationType) {
      loadAvailableFeatures()
    }
  }, [applicationType, loadAvailableFeatures])

  useEffect(() => {
    if (error) onError(error)
  }, [error, onError])

  return <div className="reloading">{JSON.stringify(features, null, 2)}</div>
}

const TEST_DATA = [
  { initialData: { type: 'WEB' }, hasError: false },
  { initialData: { type: 'BOOM' }, hasError: true },
]

TEST_DATA.forEach(({ initialData, hasError }) => {
  it(`Initial Form Data with "${initialData.type}"`, async () => {
    let error = null
    const onError = (e) => {
      error = e
    }

    let container
    await act(async () => {
      const result = render(
        <ApplicationState>
          <TestView
            sdk={MockSdk}
            applicationType={initialData.type}
            onError={onError}
          />
        </ApplicationState>
      )
      container = result.container
    })

    // Wait for async feature loading to complete
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    if (hasError) {
      expect(error).not.toBeNull()
      expect(container.querySelector('.reloading').textContent).toEqual('[]')
    } else {
      expect(error).toBeNull()
      expect(JSON.parse(container.querySelector('.reloading').textContent)).toEqual([
        'a',
        'b',
        'c',
      ])
    }
  })
})
