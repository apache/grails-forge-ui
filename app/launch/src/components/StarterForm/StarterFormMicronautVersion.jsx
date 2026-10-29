import { useCallback, useEffect, useMemo, useState } from 'react'
import Lang from '../../helpers/Lang'
import { useSelectedVersions } from '../../state/store'
import RadioGroup from '../RadioGroup'
import { useStarterVersionKeyboardEvents } from './useStarterFormKeyboardEvents'

export const UNSUPPORTED_GROUP = 'unsupported'

/**
 * Options arrive ordered supported first, oldest to newest, then unsupported,
 * most recently ended first (see MicronautStarterSDK.loadVersions). Put the
 * unsupported run in a group so
 * RadioGroup draws a disclosure ahead of it, and say when support ended.
 * The store keeps the undecorated options.
 *
 * @param {Array<Object>} options
 * @return {Array<Object>}
 */
export function decorateVersionOptions(options) {
  if (!options.some((option) => option.supported === false)) return options
  return options.map((option) =>
    option.supported === false
      ? {
          ...option,
          group: UNSUPPORTED_GROUP,
          hint: Lang.trans('versions.supportEnded', {
            date: option.endOfSupport,
          }),
        }
      : option
  )
}

/**
 * Heading for the unsupported group. Collapsed with the selected version
 * pinned in view, it counts what is still hidden; otherwise it counts the
 * whole group.
 *
 * @param {String} _group
 * @param {Object} state  {collapsed, hidden, total} from RadioGroup
 * @return {String}
 */
export function unsupportedGroupLabel(_group, { collapsed, hidden, total }) {
  return collapsed && hidden < total
    ? Lang.trans('versions.unsupportedGroupMore', { count: hidden })
    : Lang.trans('versions.unsupportedGroup', { count: total })
}

export default function MicronautVersion() {
  const [version, setter, options] = useSelectedVersions()
  const [showUnsupported, setShowUnsupported] = useState(false)
  const decorated = useMemo(() => decorateVersionOptions(options), [options])

  // Landing on an unsupported version (share link, remembered choice,
  // keyboard cycling) opens the group so the neighbours are in view. It can
  // still be collapsed afterwards: RadioGroup keeps the selected row visible.
  useEffect(() => {
    if (version?.supported === false) setShowUnsupported(true)
  }, [version])
  const collapsedGroups = useMemo(
    () => (showUnsupported ? [] : [UNSUPPORTED_GROUP]),
    [showUnsupported]
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
      groupLabel={unsupportedGroupLabel}
      expected={2}
    />
  )
}
