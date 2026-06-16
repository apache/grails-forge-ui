import { useEffect, useCallback } from 'react'
import { create } from 'zustand'

export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'

export const loadTheme = () => {
  const mode = window.localStorage.getItem('theme')
  switch (mode) {
    case THEME_LIGHT:
    case THEME_DARK:
      return mode
    default:
      return THEME_LIGHT
  }
}

export const registerTheme = (theme) => {
  window.localStorage.setItem('theme', theme)
  document.body.className = theme
  return theme
}

export const nextTheme = (theme) => {
  return theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT
}

const useThemeStore = create((set) => ({
  theme: registerTheme(loadTheme()),
  setTheme: (theme) => set({ theme }),
}))

export default function useAppTheme() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  useEffect(() => {
    registerTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(nextTheme(theme))
  }, [setTheme, theme])

  return [theme, toggleTheme]
}
