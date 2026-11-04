import { describe, expect, it } from 'vitest'

import Lang from '../Lang'

describe('Lang.trans', () => {
  it('returns the message text for a key without substitutions', () => {
    expect(Lang.trans('share.header')).toBe(
      'Copy one of the following links to share this project'
    )
    // A second lookup is served from the cache and must return the same text
    expect(Lang.trans('share.header')).toBe(
      'Copy one of the following links to share this project'
    )
  })

  it('interpolates substitutions', () => {
    expect(Lang.trans('versions.supportEnded', { date: '2026-10-31' })).toBe(
      'ended 2026-10-31'
    )
    expect(Lang.trans('versions.unsupportedGroup', { count: 2 })).toBe(
      'Unsupported Versions (2)'
    )
  })

  it('still interpolates after the key was used without substitutions', () => {
    expect(Lang.trans('versions.unsupportedGroupMore')).toBe(
      'Unsupported Versions ({{count}} more)'
    )
    expect(Lang.trans('versions.unsupportedGroupMore', { count: 1 })).toBe(
      'Unsupported Versions (1 more)'
    )
    // And the other way round: the cache holds the template, not a result
    expect(Lang.trans('versions.unsupportedGroupMore', { count: 3 })).toBe(
      'Unsupported Versions (3 more)'
    )
    expect(Lang.trans('versions.unsupportedGroupMore')).toBe(
      'Unsupported Versions ({{count}} more)'
    )
  })

  it('falls back to the key itself when the message is unknown', () => {
    expect(Lang.trans('nope.missing')).toBe('nope.missing')
  })
})
