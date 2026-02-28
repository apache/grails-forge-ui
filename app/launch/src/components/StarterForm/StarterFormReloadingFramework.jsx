import { NEXT_RELOADING_SHORTCUT } from '../../constants/shortcuts'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { useReloadingFramework } from '../../state/store'
import RadioGroup from '../RadioGroup'
import { useOptHandler } from './useStarterFormKeyboardEvents'

export default function StarterFormReloadingFramework() {
  const [value, setter, select] = useReloadingFramework()
  const handleChange = (event) => setter(event.target.value)

  const next = useOptHandler('reloading', value, select?.options ?? [], handleChange)
  useKeyboardShortcuts(NEXT_RELOADING_SHORTCUT.keys, next)

  return (
    <RadioGroup
      tabIndex={1}
      label="Development Reloading"
      id="reloading"
      name="reloading"
      value={value}
      onChange={handleChange}
      options={select?.options ?? []}
      loading={!select}
      expected={2}
    />
  )
}
