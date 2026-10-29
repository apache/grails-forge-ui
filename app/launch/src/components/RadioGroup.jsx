// RadioGroup.js
import React from 'react'
import { Icon } from '@mui/material'

/**
 * Options may carry two optional presentation fields on top of `value` and
 * `label`:
 *
 *  - `group`  heading text. A divider carrying it is drawn ahead of the first
 *             option in a run of consecutive options that share the group.
 *             With `onToggleGroup` the divider is a disclosure button, and the
 *             options of any group listed in `collapsedGroups` are left out,
 *             except the selected one, which always stays visible.
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
}) => {
  const finalOpts = loading
    ? new Array(expected).fill().map((_i) => ({ value: '', label: '...' }))
    : options

  const isCollapsed = (group) =>
    Boolean(group) && Boolean(onToggleGroup) && collapsedGroups.includes(group)

  return (
    <div className={['radio-group', loading ? 'loading' : ''].join(' ')}>
      {typeof label === 'string' && (
        <label className="input-field">{label}</label>
      )}
      {finalOpts.map((option, idx) => {
        const previous = idx > 0 ? finalOpts[idx - 1] : undefined
        const startsGroup =
          Boolean(option.group) && option.group !== previous?.group
        const hidden = isCollapsed(option.group) && option.value !== value
        return (
          <React.Fragment key={idx.toString()}>
            {startsGroup && onToggleGroup && (
              <button
                type="button"
                className="radio-divider radio-divider-toggle"
                tabIndex={tabIndex}
                aria-expanded={!isCollapsed(option.group)}
                onClick={() => onToggleGroup(option.group)}
              >
                <Icon className="radio-divider-chevron" aria-hidden="true">
                  {isCollapsed(option.group)
                    ? 'arrow_right'
                    : 'arrow_drop_down'}
                </Icon>
                <span className="radio-divider-text">{option.group}</span>
              </button>
            )}
            {startsGroup && !onToggleGroup && (
              <div
                className="radio-divider"
                role="separator"
                aria-label={option.group}
              >
                <span className="radio-divider-text">{option.group}</span>
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
