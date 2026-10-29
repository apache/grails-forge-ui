import { useMemo } from 'react'
import Lang from '../../helpers/Lang'
import { useSelectedVersions } from '../../state/store'
import RadioGroup from '../RadioGroup'
import { useStarterVersionKeyboardEvents } from './useStarterFormKeyboardEvents'

/**
 * Options arrive ordered supported first and unsupported last (see
 * MicronautStarterSDK.loadVersions). Give the unsupported run a group heading
 * so RadioGroup draws a divider ahead of it, and say when support ended.
 * The store keeps the undecorated options.
 *
 * @param {Array<Object>} options
 * @return {Array<Object>}
 */
export function decorateVersionOptions(options) {
  return options.map((option) =>
    option.supported === false
      ? {
          ...option,
          group: Lang.trans('versions.unsupportedGroup'),
          hint: Lang.trans('versions.supportEnded', {
            date: option.endOfSupport,
          }),
        }
      : option
  )
}

export default function MicronautVersion() {
  const [version, setter, options] = useSelectedVersions()
  const decorated = useMemo(() => decorateVersionOptions(options), [options])

  const handleVersionChange = (event) => {
    const { value } = event.target
    if (!value) return
    setter(options.find((v) => v.value === value))
  }
  useStarterVersionKeyboardEvents(handleVersionChange, version, options)

  return (
    <RadioGroup
      tabIndex={1}
      label="Grails Version"
      id="micronautApi"
      name="micronautApi"
      value={version?.value}
      onChange={handleVersionChange}
      options={decorated}
      expected={2}
    />
  )
}
