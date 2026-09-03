import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  useAppStore,
  useConfigureInitialVersionEffect,
  useSelectedVersions,
} from '../store'

// Ordered oldest first, the way loadVersions now returns them
const OPTIONS = [
  { key: 'OLDER', version: '7.0.6', value: 'https://older.grails.org' },
  { key: 'PREV', version: '7.1.6', value: 'https://prev.grails.org' },
  { key: 'RELEASE', version: '7.2.3', value: 'https://latest.grails.org' },
  { key: 'NEXT', version: '8.0.0-M6', value: 'https://next.grails.org' },
]

beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState())
  window.localStorage.clear()
})

const seed = (options = OPTIONS, initialValues = {}) => {
  useAppStore.getState().setAvailableVersions(options)
  useAppStore.getState().setInitialValues(initialValues)
}

describe('useSelectedVersions', () => {
  it('preselects the RELEASE channel rather than the first option', async () => {
    seed()

    const { result } = renderHook(() => useSelectedVersions())

    await waitFor(() => expect(result.current[0]).toBeTruthy())
    expect(result.current[0]).toMatchObject({
      key: 'RELEASE',
      version: '7.2.3',
    })
  })

  it('honours a requested version over the default', async () => {
    seed(OPTIONS, { version: '8.0.0-M6' })

    const { result } = renderHook(() => useSelectedVersions())

    await waitFor(() => expect(result.current[0]).toBeTruthy())
    expect(result.current[0]).toMatchObject({ key: 'NEXT' })
  })

  it('falls back to the first option when the feed has no RELEASE channel', async () => {
    seed([
      { key: 'NEXT', version: '8.0.0-M6' },
      { key: 'NEXT-SNAPSHOT', version: '8.0.0-SNAPSHOT' },
    ])

    const { result } = renderHook(() => useSelectedVersions())

    await waitFor(() => expect(result.current[0]).toBeTruthy())
    expect(result.current[0]).toMatchObject({ key: 'NEXT' })
  })
})

describe('useConfigureInitialVersionEffect', () => {
  it('reports the RELEASE version when the requested one is unavailable', async () => {
    seed(OPTIONS, { version: '6.1.0' })
    const onError = vi.fn()

    renderHook(() => useConfigureInitialVersionEffect(onError))

    await waitFor(() => expect(onError).toHaveBeenCalled())
    expect(onError).toHaveBeenCalledWith({
      requested: '6.1.0',
      using: '7.2.3',
    })
    expect(useAppStore.getState().selectedVersion).toMatchObject({
      key: 'RELEASE',
    })
  })

  it('does not report an error when the requested version is available', async () => {
    seed(OPTIONS, { version: '7.1.6' })
    const onError = vi.fn()

    renderHook(() => useConfigureInitialVersionEffect(onError))

    await waitFor(() =>
      expect(useAppStore.getState().selectedVersion).toMatchObject({
        key: 'PREV',
      })
    )
    expect(onError).not.toHaveBeenCalled()
  })
})
