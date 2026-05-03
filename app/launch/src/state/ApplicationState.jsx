import { useEffect } from 'react'
import { useAppStore } from './store'
import { initializeStateFactory } from './factories/initializeState'

export default function ApplicationState({
  initialData,
  stateInitializer,
  children,
}) {
  useEffect(() => {
    const initializer = typeof stateInitializer === 'function'
      ? stateInitializer
      : initializeStateFactory(initialData)

    // Apply initial state to the store
    if (typeof initializer === 'function') {
      initializer(useAppStore)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>
}
