import { useCallback, useEffect, useMemo, useState } from 'react'
import Lang from '../../helpers/Lang'
import { useSelectedVersions } from '../../state/store'
import RadioGroup from '../RadioGroup'
import { useStarterVersionKeyboardEvents } from './useStarterFormKeyboardEvents'

/**
 * Options arrive ordered supported first and unsupported last (see
 * MicronautStarterSDK.loadVersions). Give the unsupported run a group heading
 * so RadioGroup draws a disclosure ahead of it, and say when support ended.
 * The store keeps the undecorated options.
 *
 * @param {Array<Object>} options
 * @return {Array<Object>}
 */
export function decorateVersionOptions(options) {
  const count = options.filter((option) => option.supported === false).length
  if (!count) return options
  const group = Lang.trans('versions.unsupportedGroup', { count })
  return options.map((option) =>
    option.supported === false
      ? {
          ...option,
          group,
          hint: Lang.trans('versions.supportEnded', {
            date: option.endOfSupport,
          }),
        }
      : option
  )
}

export default function MicronautVersion() {
  const [version, setter, options] = useSelectedVersions()
  const [showUnsupported, setShowUnsupported] = useState(false)
  const decorated = useMemo(() => decorateVersionOptions(options), [options])
  const unsupportedGroup = decorated.find((option) => option.group)?.group

  // Landing on an unsupported version (share link, remembered choice,
  // keyboard cycling) opens the group so the neighbours are in view. It can
  // still be collapsed afterwards: RadioGroup keeps the selected row visible.
  useEffect(() => {
    if (version?.supported === false) setShowUnsupported(true)
  }, [version])
  const collapsedGroups = useMemo(
    () => (unsupportedGroup && !showUnsupported ? [unsupportedGroup] : []),
    [unsupportedGroup, showUnsupported]
  )
  const toggleUnsupported = useCallback(
    () => setShowUnsupported((shown) => !shown),
    []
  )

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
      collapsedGroups={collapsedGroups}
      onToggleGroup={toggleUnsupported}
      expected={2}
    />
  )
}
