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

const GROUP = 'Unsupported Versions (2)'

const seed = (options = OPTIONS, initialValues = {}) => {
  useAppStore.getState().setAvailableVersions(options)
  useAppStore.getState().setInitialValues(initialValues)
}

const toggle = () => screen.getByRole('button', { name: GROUP })
const radio = (version) =>
  screen.getByRole('radio', { name: new RegExp(version.replace('.', '\\.')) })
const queryRadio = (version) =>
  screen.queryByRole('radio', {
    name: new RegExp(version.replace('.', '\\.')),
  })

beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState())
  window.localStorage.clear()
  seed()
})

describe('decorateVersionOptions', () => {
  it('groups unsupported versions with a count and says when their support ended', () => {
    const [release, next, older, prev] = decorateVersionOptions(OPTIONS)

    expect(release.group).toBeUndefined()
    expect(release.hint).toBeUndefined()
    expect(next.group).toBeUndefined()
    expect(older).toMatchObject({ group: GROUP, hint: 'ended 2026-10-31' })
    expect(prev.group).toBe(GROUP)
  })

  it('returns the options untouched when every version is supported', () => {
    const supported = OPTIONS.slice(0, 2)

    expect(decorateVersionOptions(supported)).toBe(supported)
  })

  it('does not mutate the options it is given', () => {
    decorateVersionOptions(OPTIONS)

    expect(OPTIONS[2].group).toBeUndefined()
  })
})

describe('MicronautVersion', () => {
  it('hides unsupported versions behind a collapsed disclosure by default', async () => {
    const { container } = render(<MicronautVersion />)

    await waitFor(() => expect(radio('7.2.4').checked).toBe(true))
    expect(toggle().getAttribute('aria-expanded')).toBe('false')
    expect(queryRadio('7.0.17')).toBeNull()
    expect(queryRadio('7.1.7')).toBeNull()
    const rows = [...container.querySelectorAll('.radio-group > *')]
      .filter((el) => el.tagName !== 'LABEL')
      .map((el) => el.className)
    expect(rows).toEqual([
      'radio-row',
      'radio-row',
      'radio-divider radio-divider-toggle',
    ])
  })

  it('expands the disclosure to list unsupported versions with their end dates', async () => {
    render(<MicronautVersion />)
    await waitFor(() => expect(radio('7.2.4').checked).toBe(true))

    fireEvent.click(toggle())

    expect(toggle().getAttribute('aria-expanded')).toBe('true')
    expect(radio('7.0.17')).toBeTruthy()
    expect(screen.getAllByText('ended 2026-10-31')).toHaveLength(2)

    fireEvent.click(toggle())
    expect(queryRadio('7.0.17')).toBeNull()
  })

  it('still lets an unsupported version be selected', async () => {
    render(<MicronautVersion />)
    await waitFor(() =>
      expect(useAppStore.getState().selectedVersion?.key).toBe('RELEASE')
    )

    fireEvent.click(toggle())
    fireEvent.click(radio('7.0.17'))

    const selected = useAppStore.getState().selectedVersion
    expect(selected).toMatchObject({ key: 'OLDER', supported: false })
    // The store keeps the undecorated option
    expect(selected.group).toBeUndefined()
    expect(selected.hint).toBeUndefined()
  })

  it('keeps the disclosure open while an unsupported version is selected', async () => {
    render(<MicronautVersion />)
    await waitFor(() => expect(radio('7.2.4').checked).toBe(true))
    fireEvent.click(toggle())
    fireEvent.click(radio('7.0.17'))

    fireEvent.click(toggle())

    expect(toggle().getAttribute('aria-expanded')).toBe('true')
    expect(radio('7.0.17').checked).toBe(true)
  })

  it('opens expanded when the requested version is unsupported', async () => {
    seed(OPTIONS, { version: '7.1.7' })

    render(<MicronautVersion />)

    await waitFor(() => expect(radio('7.1.7').checked).toBe(true))
    expect(toggle().getAttribute('aria-expanded')).toBe('true')
  })

  it('shows no disclosure when every version is supported', async () => {
    seed(OPTIONS.slice(0, 2))

    render(<MicronautVersion />)

    await waitFor(() => expect(radio('7.2.4').checked).toBe(true))
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByRole('separator')).toBeNull()
  })
})
