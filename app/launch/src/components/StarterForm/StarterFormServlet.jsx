import { NEXT_SERVLET_SHORTCUT } from '../../constants/shortcuts'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { useServlet } from '../../state/store'
import RadioGroup from '../RadioGroup'
import { useOptHandler } from './useStarterFormKeyboardEvents'

export default function StarterFormServlet() {
  const [value, setter, select] = useServlet()
  const handleChange = (event) => setter(event.target.value)

  const next = useOptHandler('servlet', value, select?.options ?? [], handleChange)
  useKeyboardShortcuts(NEXT_SERVLET_SHORTCUT.keys, next)

  return (
    <RadioGroup
      tabIndex={1}
      label="Embedded Servlet Container"
      id="servlet"
      name="servlet"
      value={value}
      onChange={handleChange}
      options={select?.options ?? []}
      loading={!select}
      expected={3}
    />
  )
}
