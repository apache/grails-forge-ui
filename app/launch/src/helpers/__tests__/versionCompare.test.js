import { describe, expect, it } from 'vitest'

import { compareVersions, sortByVersion } from '../versionCompare'

const sorted = (versions) => [...versions].sort(compareVersions)

describe('compareVersions', () => {
  it('orders a realistic feed oldest first', () => {
    // The order the version radio group is expected to render
    expect(
      sorted([
        '7.2.3',
        '7.2.4-SNAPSHOT',
        '8.0.0-M6',
        '8.0.0-SNAPSHOT',
        '7.1.6',
        '7.1.7-SNAPSHOT',
        '7.0.6',
      ])
    ).toEqual([
      '7.0.6',
      '7.1.6',
      '7.1.7-SNAPSHOT',
      '7.2.3',
      '7.2.4-SNAPSHOT',
      '8.0.0-M6',
      '8.0.0-SNAPSHOT',
    ])
  })

  it('compares release parts numerically, not as text', () => {
    expect(sorted(['7.10.0', '7.9.0', '7.2.0'])).toEqual([
      '7.2.0',
      '7.9.0',
      '7.10.0',
    ])
    expect(compareVersions('10.0.0', '9.0.0')).toBeGreaterThan(0)
  })

  it('treats missing release parts as zero', () => {
    expect(compareVersions('7.1', '7.1.0')).toBe(0)
    expect(compareVersions('7', '7.0.1')).toBeLessThan(0)
  })

  it('sorts a prerelease before its own release', () => {
    expect(compareVersions('8.0.0-SNAPSHOT', '8.0.0')).toBeLessThan(0)
    expect(compareVersions('8.0.0', '8.0.0-M6')).toBeGreaterThan(0)
  })

  it('sorts a prerelease after the previous release', () => {
    expect(compareVersions('7.1.7-SNAPSHOT', '7.1.6')).toBeGreaterThan(0)
  })

  it('orders milestones by their number', () => {
    expect(sorted(['8.0.0-M10', '8.0.0-M2', '8.0.0-M6'])).toEqual([
      '8.0.0-M2',
      '8.0.0-M6',
      '8.0.0-M10',
    ])
  })

  it('orders milestones ahead of release candidates and snapshots', () => {
    expect(sorted(['8.0.0-SNAPSHOT', '8.0.0-RC1', '8.0.0-M6'])).toEqual([
      '8.0.0-M6',
      '8.0.0-RC1',
      '8.0.0-SNAPSHOT',
    ])
  })

  it('ignores build metadata', () => {
    expect(compareVersions('7.2.3+build.9', '7.2.3')).toBe(0)
  })

  it('sorts unparseable versions last without reordering them', () => {
    expect(sorted(['nightly', '8.0.0-M6', 'unknown', '7.0.6'])).toEqual([
      '7.0.6',
      '8.0.0-M6',
      'nightly',
      'unknown',
    ])
  })

  it('tolerates missing values', () => {
    expect(compareVersions(undefined, '7.0.6')).toBeGreaterThan(0)
    expect(compareVersions(null, undefined)).toBe(0)
  })
})

describe('sortByVersion', () => {
  it('orders option objects by their version', () => {
    const options = [
      { key: 'RELEASE', version: '7.2.3' },
      { key: 'NEXT', version: '8.0.0-M6' },
      { key: 'OLDER', version: '7.0.6' },
    ]

    expect(sortByVersion(options).map((o) => o.key)).toEqual([
      'OLDER',
      'RELEASE',
      'NEXT',
    ])
  })

  it('does not mutate the array it was given', () => {
    const options = [{ version: '8.0.0' }, { version: '7.0.6' }]
    sortByVersion(options)
    expect(options.map((o) => o.version)).toEqual(['8.0.0', '7.0.6'])
  })
})
