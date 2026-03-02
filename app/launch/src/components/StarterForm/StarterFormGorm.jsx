import {NEXT_GORM_SHORTCUT} from '../../constants/shortcuts'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import {useGorm} from '../../state/store'
import RadioGroup from '../RadioGroup'
import { useOptHandler } from './useStarterFormKeyboardEvents'

export default function StarterFormGorm() {
  const [value, setter, select] = useGorm()
  const handleChange = (event) => setter(event.target.value)

  const next = useOptHandler('gorm', value, select?.options ?? [], handleChange)
  useKeyboardShortcuts(NEXT_GORM_SHORTCUT.keys, next)

  return (
    <RadioGroup
      tabIndex={1}
      label="GORM Implementation"
      id="gorm"
      name="gorm"
      value={value}
      onChange={handleChange}
      options={select?.options ?? []}
      loading={!select}
      expected={3}
    />
  )
}
