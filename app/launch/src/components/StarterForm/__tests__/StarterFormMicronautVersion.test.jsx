import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAppStore } from '../../../state/store'
import MicronautVersion, {
  decorateVersionOptions,
} from '../StarterFormMicronautVersion'

const option = (key, version, host, endOfSupport, supported) => ({
  key,
  version,
  label: version,
  value: `https://${host}`,
  api: `https://${host}`,
  endOfSupport,
  supported,
})

// Ordered the way loadVersions returns them: supported first, then unsupported
const OPTIONS = [
  option('RELEASE', '7.2.4', 'latest.grails.org', '2026-12-31', true),
  option('NEXT', '8.0.0', 'next.grails.org', null, true),
  option('OLDER', '7.0.17', 'older.grails.org', '2026-10-31', false),
  option('PREV', '7.1.7', 'prev.grails.org', '2026-10-31', false),
]

beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState())
  window.localStorage.clear()
  useAppStore.getState().setAvailableVersions(OPTIONS)
})

describe('decorateVersionOptions', () => {
  it('groups unsupported versions and says when their support ended', () => {
    const [release, next, older, prev] = decorateVersionOptions(OPTIONS)

    expect(release.group).toBeUndefined()
    expect(release.hint).toBeUndefined()
    expect(next.group).toBeUndefined()
    expect(older).toMatchObject({
      group: 'Unsupported versions',
      hint: 'Support ended 2026-10-31',
    })
    expect(prev.group).toBe('Unsupported versions')
  })

  it('does not mutate the options it is given', () => {
    decorateVersionOptions(OPTIONS)

    expect(OPTIONS[2].group).toBeUndefined()
  })
})

describe('MicronautVersion', () => {
  it('lists unsupported versions under a divider after the supported ones', async () => {
    const { container } = render(<MicronautVersion />)

    await waitFor(() =>
      expect(screen.getByRole('radio', { name: /7\.2\.4/ }).checked).toBe(true)
    )
    const children = [...container.querySelectorAll('.radio-group > div')]
    expect(children.map((el) => el.className)).toEqual([
      'radio-row',
      'radio-row',
      'radio-divider',
      'radio-row',
      'radio-row',
    ])
    expect(screen.getByRole('separator').textContent).toBe(
      'Unsupported versions'
    )
    expect(screen.getAllByText('Support ended 2026-10-31')).toHaveLength(2)
  })

  it('still lets an unsupported version be selected', async () => {
    render(<MicronautVersion />)
    await waitFor(() =>
      expect(useAppStore.getState().selectedVersion?.key).toBe('RELEASE')
    )

    fireEvent.click(screen.getByRole('radio', { name: /7\.0\.17/ }))

    const selected = useAppStore.getState().selectedVersion
    expect(selected).toMatchObject({ key: 'OLDER', supported: false })
    // The store keeps the undecorated option
    expect(selected.group).toBeUndefined()
    expect(selected.hint).toBeUndefined()
  })

  it('renders no divider when every version is supported', async () => {
    useAppStore.getState().setAvailableVersions(OPTIONS.slice(0, 2))

    render(<MicronautVersion />)

    await waitFor(() =>
      expect(screen.getByRole('radio', { name: /7\.2\.4/ }).checked).toBe(true)
    )
    expect(screen.queryByRole('separator')).toBeNull()
  })
})
