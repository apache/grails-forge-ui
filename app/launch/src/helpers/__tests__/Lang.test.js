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

  it('falls back to the key itself when the message is unknown', () => {
    expect(Lang.trans('nope.missing')).toBe('nope.missing')
  })
})
