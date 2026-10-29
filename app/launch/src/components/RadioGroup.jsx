// RadioGroup.js
import React from 'react'
import { Icon } from '@mui/material'

const defaultGroupLabel = (group) => group

/**
 * Options may carry two optional presentation fields on top of `value` and
 * `label`:
 *
 *  - `group`  group key. A divider is drawn ahead of the first option in a run
 *             of consecutive options that share the group, showing the key
 *             or whatever `groupLabel(group, { collapsed, hidden, total })`
 *             returns. With `onToggleGroup` the divider is a disclosure
 *             button, and the options of any group listed in `collapsedGroups`
 *             are left out, except the selected one, which always stays
 *             visible. A collapsed group with nothing left to hide renders
 *             expanded.
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

  const groupState = (group) => {
    const members = finalOpts.filter((option) => option.group === group)
    const requested = Boolean(onToggleGroup) && collapsedGroups.includes(group)
    const hidden = requested
      ? members.filter((option) => option.value !== value).length
      : 0
    return { collapsed: hidden > 0, hidden, total: members.length }
  }

  return (
    <div className={['radio-group', loading ? 'loading' : ''].join(' ')}>
      {typeof label === 'string' && (
        <label className="input-field">{label}</label>
      )}
      {finalOpts.map((option, idx) => {
        const previous = idx > 0 ? finalOpts[idx - 1] : undefined
        const startsGroup =
          Boolean(option.group) && option.group !== previous?.group
        const state = option.group ? groupState(option.group) : undefined
        const hidden = Boolean(state?.collapsed) && option.value !== value
        return (
          <React.Fragment key={idx.toString()}>
            {startsGroup && onToggleGroup && (
              <button
                type="button"
                className="radio-divider radio-divider-toggle"
                tabIndex={tabIndex}
                aria-expanded={!state.collapsed}
                onClick={() => onToggleGroup(option.group)}
              >
                <Icon className="radio-divider-chevron" aria-hidden="true">
                  {state.collapsed ? 'arrow_right' : 'arrow_drop_down'}
                </Icon>
                <span className="radio-divider-text">
                  {groupLabel(option.group, state)}
                </span>
              </button>
            )}
            {startsGroup && !onToggleGroup && (
              <div
                className="radio-divider"
                role="separator"
                aria-label={groupLabel(option.group, state)}
              >
                <span className="radio-divider-text">
                  {groupLabel(option.group, state)}
                </span>
              </div>
            )}
            {!hidden && (
              <div className="radio-row">
                <label
                  key={`${idx}-${option.value}`}
                  className="radio-label"
                  htmlFor={`${id}-radio-${idx}`}
                >
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
                  {option.hint && (
                    <span className="radio-hint">{option.hint}</span>
                  )}
                </label>
                <div className="loading-wrapper">
                  <div className="loading-ghost" />
                </div>
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default RadioGroup
