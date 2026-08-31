import { describe, expect, it } from 'vitest'

import { BASE_PATH, resetRoute, updateRoute, withAppBase } from '../Routing'

describe('Routing base path', () => {
  it('uses an empty BASE_PATH when Vite base is /', () => {
    expect(BASE_PATH).toBe('')
  })

  it('withAppBase returns root and activity paths', () => {
    expect(withAppBase()).toBe('/')
    expect(withAppBase('preview')).toBe('/preview')
    expect(withAppBase('/diff')).toBe('/diff')
  })

  it('resetRoute writes the app base path', () => {
    window.history.replaceState({}, '', '/preview?x=1')
    resetRoute()
    expect(`${window.location.pathname}${window.location.search}`).toBe('/')
  })

  it('updateRoute writes an activity path under the app base', () => {
    window.history.replaceState({}, '', '/')
    updateRoute('preview')
    expect(window.location.pathname).toBe('/preview')
  })
})
