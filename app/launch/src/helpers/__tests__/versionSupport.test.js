import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  isSupported,
  normalizeEndOfSupport,
  orderBySupport,
  todayIsoDate,
} from '../versionSupport'

afterEach(() => {
  vi.useRealTimers()
})

describe('todayIsoDate', () => {
  it('formats the local calendar date as yyyy-MM-dd', () => {
    expect(todayIsoDate(new Date(2026, 9, 29, 23, 59))).toBe('2026-10-29')
    expect(todayIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('defaults to the current date', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 29, 12))

    expect(todayIsoDate()).toBe('2026-10-29')
  })
})

describe('normalizeEndOfSupport', () => {
  it.each([undefined, null, '', 'soon', 42, '2026-10-31T00:00:00Z'])(
    'treats %j as unknown',
    (value) => {
      expect(normalizeEndOfSupport(value)).toBeNull()
    }
  )

  it('keeps an ISO date, trimming whitespace', () => {
    expect(normalizeEndOfSupport(' 2026-10-31 ')).toBe('2026-10-31')
  })
})

describe('isSupported', () => {
  const today = '2026-10-29'

  it('is supported through the end of support day inclusive', () => {
    expect(isSupported('2026-10-29', today)).toBe(true)
    expect(isSupported('2026-10-30', today)).toBe(true)
    expect(isSupported('2027-12-31', today)).toBe(true)
  })

  it('is unsupported from the day after', () => {
    expect(isSupported('2026-10-28', today)).toBe(false)
    expect(isSupported('2025-01-01', today)).toBe(false)
  })

  it('treats an unknown date as supported', () => {
    expect(isSupported(undefined, today)).toBe(true)
    expect(isSupported(null, today)).toBe(true)
    expect(isSupported('n/a', today)).toBe(true)
  })

  it('uses the current date by default', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 1))

    expect(isSupported('2026-10-31')).toBe(false)
    expect(isSupported('2026-11-01')).toBe(true)
  })
})

describe('orderBySupport', () => {
  const options = [
    { version: '7.0.17', supported: false },
    { version: '7.1.7', supported: false },
    { version: '7.2.4', supported: true },
    // No flag at all counts as supported
    { version: '8.0.0' },
    { version: '9.0.0-SNAPSHOT', supported: true },
  ]

  it('moves unsupported options after the supported ones, keeping each run in order', () => {
    expect(orderBySupport(options).map((o) => o.version)).toEqual([
      '7.2.4',
      '8.0.0',
      '9.0.0-SNAPSHOT',
      '7.0.17',
      '7.1.7',
    ])
  })

  it('returns a new array and leaves the input alone', () => {
    const copy = [...options]

    const ordered = orderBySupport(options)

    expect(ordered).not.toBe(options)
    expect(options).toEqual(copy)
  })
})
