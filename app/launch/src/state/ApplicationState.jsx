import { useLayoutEffect, useRef } from 'react'
import { initializeStateFactory } from './factories/initializeState'
import { useAppStore } from './store'

export default function ApplicationState({
  initialData = {},
  stateInitializer,
  children,
}) {
  const initialized = useRef(false)

  useLayoutEffect(() => {
    if (initialized.current) return

    initialized.current = true
    const initializer = typeof stateInitializer === 'function'
      ? stateInitializer
      : initializeStateFactory(initialData)

    if (typeof initializer === 'function') {
      initializer(useAppStore)
    }
  }, [initialData, stateInitializer])

  return <>{children}</>
}
