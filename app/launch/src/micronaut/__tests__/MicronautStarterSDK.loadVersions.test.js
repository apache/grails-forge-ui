import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { MicronautStarterSDK } from '../MicronautStarterSDK'

// The feed lists publishing channels in channel order, which is unrelated to
// how the Grails versions behind them compare.
const FEED = {
  versions: [
    { key: 'RELEASE', baseUrl: 'https://latest.grails.org', order: 0 },
    { key: 'SNAPSHOT', baseUrl: 'https://snapshot.grails.org', order: 1 },
    { key: 'NEXT', baseUrl: 'https://next.grails.org', order: 2 },
    {
      key: 'NEXT-SNAPSHOT',
      baseUrl: 'https://next-snapshot.grails.org',
      order: 3,
    },
    { key: 'PREV', baseUrl: 'https://prev.grails.org', order: 4 },
    {
      key: 'PREV-SNAPSHOT',
      baseUrl: 'https://prev-snapshot.grails.org',
      order: 5,
    },
    { key: 'OLDER', baseUrl: 'https://older.grails.org', order: 6 },
  ],
}

const GRAILS_VERSIONS = {
  'https://latest.grails.org': '7.2.3',
  'https://snapshot.grails.org': '7.2.4-SNAPSHOT',
  'https://next.grails.org': '8.0.0-M6',
  'https://next-snapshot.grails.org': '8.0.0-SNAPSHOT',
  'https://prev.grails.org': '7.1.6',
  'https://prev-snapshot.grails.org': '7.1.7-SNAPSHOT',
  'https://older.grails.org': '7.0.6',
}

const jsonResponse = (body) => ({
  ok: true,
  json: async () => body,
})

const mockFetch = (grailsVersions = GRAILS_VERSIONS) =>
  vi.fn(async (url) => {
    if (String(url).endsWith('grails-version-feed.json')) {
      return jsonResponse(FEED)
    }

    const baseUrl = String(url).replace(/\/versions$/, '')
    const version = grailsVersions[baseUrl]
    if (!version) {
      return { ok: false, status: 404 }
    }
    return jsonResponse({ versions: { 'grails.version': version } })
  })

beforeEach(() => {
  // The SDK caches /versions responses per baseUrl in session storage
  window.sessionStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('MicronautStarterSDK.loadVersions', () => {
  it('returns the versions ordered oldest first', async () => {
    vi.stubGlobal('fetch', mockFetch())

    const loaded = await MicronautStarterSDK.loadVersions()

    expect(loaded.map((v) => v.version)).toEqual([
      '7.0.6',
      '7.1.6',
      '7.1.7-SNAPSHOT',
      '7.2.3',
      '7.2.4-SNAPSHOT',
      '8.0.0-M6',
      '8.0.0-SNAPSHOT',
    ])
  })

  it('keeps the channel key alongside the resolved version', async () => {
    vi.stubGlobal('fetch', mockFetch())

    const loaded = await MicronautStarterSDK.loadVersions()

    expect(loaded.find((v) => v.key === 'RELEASE')).toMatchObject({
      version: '7.2.3',
      label: '7.2.3',
      api: 'https://latest.grails.org',
    })
  })

  it('drops channels that fail to load and still sorts the rest', async () => {
    const partial = { ...GRAILS_VERSIONS }
    delete partial['https://next.grails.org']
    delete partial['https://prev-snapshot.grails.org']
    vi.stubGlobal('fetch', mockFetch(partial))

    const loaded = await MicronautStarterSDK.loadVersions()

    expect(loaded.map((v) => v.version)).toEqual([
      '7.0.6',
      '7.1.6',
      '7.2.3',
      '7.2.4-SNAPSHOT',
      '8.0.0-SNAPSHOT',
    ])
  })
})
