// Select.js
import React from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import SelectProxy from '@mui/material/Select'

const Select = ({
  name,
  label,
  options,
  id,
  value,
  onChange,
  tabIndex = '0',
}) => {
  const controlId = id ?? name

  return (
    <div className="MuiFormControlOverrides select-wrapper input-field col">
      <FormControl variant="standard">
        <InputLabel id={`${controlId}-select-label`}>{label}</InputLabel>
        <SelectProxy
          name={name}
          labelId={`${controlId}-select-label`}
          id={`${controlId}-select`}
          value={value ?? ''}
          onChange={onChange}
          tabIndex={tabIndex}
          variant="standard"
        >
          {options.map((opt, idx) => (
            <MenuItem key={`select-${opt.value}-${idx}`} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </SelectProxy>
      </FormControl>
    </div>
  )
}

export default Select
