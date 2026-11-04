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

// Each release line reports the last day it is supported. Channels missing
// here omit the field, the way a Forge built before it existed does; an
// explicit null is what Forge sends when no date is configured.
const END_OF_SUPPORT = {
  'https://latest.grails.org': '2026-12-31',
  'https://snapshot.grails.org': '2026-12-31',
  'https://next-snapshot.grails.org': null,
  'https://prev.grails.org': '2026-10-31',
  'https://prev-snapshot.grails.org': '2026-10-31',
  'https://older.grails.org': '2026-09-30',
}

const jsonResponse = (body) => ({
  ok: true,
  json: async () => body,
})

const mockFetch = (grailsVersions = GRAILS_VERSIONS, endOfSupport = {}) =>
  vi.fn(async (url) => {
    if (String(url).endsWith('grails-version-feed.json')) {
      return jsonResponse(FEED)
    }

    const baseUrl = String(url).replace(/\/versions$/, '')
    const version = grailsVersions[baseUrl]
    if (!version) {
      return { ok: false, status: 404 }
    }
    const body = { versions: { 'grails.version': version } }
    if (Object.hasOwn(endOfSupport, baseUrl)) {
      body.endOfSupport = endOfSupport[baseUrl]
    }
    return jsonResponse(body)
  })

const setToday = (year, monthIndex, day) => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(year, monthIndex, day, 12))
}

beforeEach(() => {
  // The SDK caches /versions responses per baseUrl in session storage
  window.sessionStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
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

  it('treats a missing end of support date as supported', async () => {
    vi.stubGlobal('fetch', mockFetch())

    const loaded = await MicronautStarterSDK.loadVersions()

    expect(loaded.every((v) => v.supported === true)).toBe(true)
    expect(loaded.every((v) => v.endOfSupport === null)).toBe(true)
  })

  it('records each channel end of support date and support status', async () => {
    setToday(2026, 10, 15)
    vi.stubGlobal('fetch', mockFetch(GRAILS_VERSIONS, END_OF_SUPPORT))

    const loaded = await MicronautStarterSDK.loadVersions()
    const byKey = Object.fromEntries(loaded.map((v) => [v.key, v]))

    expect(byKey.RELEASE).toMatchObject({
      endOfSupport: '2026-12-31',
      supported: true,
    })
    expect(byKey.OLDER).toMatchObject({
      endOfSupport: '2026-09-30',
      supported: false,
    })
    // Omitted by the instance
    expect(byKey.NEXT).toMatchObject({ endOfSupport: null, supported: true })
    // Sent as null by the instance
    expect(byKey['NEXT-SNAPSHOT']).toMatchObject({
      endOfSupport: null,
      supported: true,
    })
  })

  it('lists release lines past their end of support after the supported ones, most recently ended first', async () => {
    setToday(2026, 10, 15)
    vi.stubGlobal('fetch', mockFetch(GRAILS_VERSIONS, END_OF_SUPPORT))

    const loaded = await MicronautStarterSDK.loadVersions()

    expect(loaded.map((v) => v.version)).toEqual([
      // supported, oldest first
      '7.2.3',
      '7.2.4-SNAPSHOT',
      '8.0.0-M6',
      '8.0.0-SNAPSHOT',
      // unsupported: the 7.1 line ended 2026-10-31 (newest version first),
      // the 7.0 line ended 2026-09-30
      '7.1.7-SNAPSHOT',
      '7.1.6',
      '7.0.6',
    ])
  })

  it('keeps a release line supported through its end of support day', async () => {
    setToday(2026, 8, 30)
    vi.stubGlobal('fetch', mockFetch(GRAILS_VERSIONS, END_OF_SUPPORT))

    const loaded = await MicronautStarterSDK.loadVersions()

    expect(loaded.every((v) => v.supported === true)).toBe(true)
    expect(loaded[0]).toMatchObject({ version: '7.0.6' })
  })
})
