// RadioGroup.js
import React from 'react'
import { Icon } from '@mui/material'

const defaultGroupLabel = (group) => group

/**
 * Count each group's options and how many of them are left out while the
 * group is collapsed. The selected option always stays visible, so a
 * collapsed group with nothing left to hide counts as expanded.
 *
 * @param {Array<Object>} options
 * @param {*} value                       the selected option's value
 * @param {Array<String>} collapsedGroups
 * @return {Map<String, {collapsed: Boolean, hidden: Number, total: Number}>}
 */
function groupStates(options, value, collapsedGroups) {
  const states = new Map()
  for (const option of options) {
    if (!option.group) continue
    const state = states.get(option.group) ?? {
      collapsed: false,
      hidden: 0,
      total: 0,
    }
    state.total += 1
    if (collapsedGroups.includes(option.group) && option.value !== value) {
      state.hidden += 1
      state.collapsed = true
    }
    states.set(option.group, state)
  }
  return states
}

/**
 * Split the options into runs of consecutive options that share a group.
 * Each run keeps the index of its first option in the full list, so option
 * ids stay the same whether or not a group is collapsed.
 *
 * @param {Array<Object>} options
 * @return {Array<{group: String|undefined, start: Number, members: Array<Object>}>}
 */
function groupRuns(options) {
  const runs = []
  options.forEach((option, idx) => {
    const group = option.group || undefined
    const last = runs[runs.length - 1]
    if (last && last.group === group) {
      last.members.push(option)
    } else {
      runs.push({ group, start: idx, members: [option] })
    }
  })
  return runs
}

/**
 * Options may carry two optional presentation fields on top of `value` and
 * `label`:
 *
 *  - `group`  group key. A divider is drawn ahead of the first option in a run
 *             of consecutive options that share the group, showing the key
 *             or whatever `groupLabel(group, { collapsed, hidden, total })`
 *             returns, and the run's rows are wrapped in a section of their
 *             own. With `onToggleGroup` the divider is a disclosure button
 *             controlling that section, and the options of any group listed
 *             in `collapsedGroups` are left out, except the selected one,
 *             which always stays visible. A collapsed group with nothing
 *             left to hide renders expanded.
 *  - `hint`   secondary text shown after the option label.
 */
const RadioGroup = ({
  name,
  label,
  options,
  id,
  value,
  onChange,
  expected = 3,
  loading = false,
  tabIndex = 0,
  collapsedGroups = [],
  onToggleGroup,
  groupLabel = defaultGroupLabel,
}) => {
  const finalOpts = loading
    ? new Array(expected).fill().map((_i) => ({ value: '', label: '...' }))
    : options
  const states = groupStates(
    finalOpts,
    value,
    onToggleGroup ? collapsedGroups : []
  )

  const renderOption = (option, idx) => (
    <div className="radio-row" key={idx}>
      <label className="radio-label" htmlFor={`${id}-radio-${idx}`}>
        <input
          tabIndex={tabIndex}
          id={`${id}-radio-${idx}`}
          type="radio"
          name={name}
          value={option.value}
          checked={loading ? undefined : value === option.value}
          onChange={loading ? undefined : onChange}
        />
        <span className="radio-text">{option.label}</span>
        {option.hint && <span className="radio-hint">{option.hint}</span>}
      </label>
      <div className="loading-wrapper">
        <div className="loading-ghost" />
      </div>
    </div>
  )

  return (
    <div className={['radio-group', loading ? 'loading' : ''].join(' ')}>
      {typeof label === 'string' && (
        <label className="input-field">{label}</label>
      )}
      {groupRuns(finalOpts).map(({ group, start, members }) => {
        if (!group) {
          return (
            <React.Fragment key={start}>
              {members.map((option, offset) =>
                renderOption(option, start + offset)
              )}
            </React.Fragment>
          )
        }
        const state = states.get(group)
        const text = groupLabel(group, state)
        const sectionId = `${id}-group-${start}`
        return (
          <React.Fragment key={start}>
            {onToggleGroup ? (
              <button
                type="button"
                className="radio-divider radio-divider-toggle"
                tabIndex={tabIndex}
                aria-expanded={!state.collapsed}
                aria-controls={sectionId}
                onClick={() => onToggleGroup(group)}
              >
                <Icon className="radio-divider-chevron" aria-hidden="true">
                  {state.collapsed ? 'arrow_right' : 'arrow_drop_down'}
                </Icon>
                <span className="radio-divider-text">{text}</span>
              </button>
            ) : (
              <div className="radio-divider" role="separator" aria-label={text}>
                <span className="radio-divider-text">{text}</span>
              </div>
            )}
            <div id={sectionId} className="radio-group-section">
              {members.map((option, offset) =>
                state.collapsed && option.value !== value
                  ? null
                  : renderOption(option, start + offset)
              )}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default RadioGroup
