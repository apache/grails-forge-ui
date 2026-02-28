// TextInput.js
import React, { forwardRef } from 'react'
import TextField from '@material-ui/core/TextField'

const TextInput = ({ onChangeText, label, placeholder, className, id, name, s, autoComplete, value, ...rest }, ref) => {
  const onChange = (event) => {
    if (onChangeText instanceof Function) {
      const text = event.target.value
      onChangeText(text)
    }
    if (rest.onChange instanceof Function) {
      rest.onChange(event)
    }
  }

  return (
    <TextField
      inputRef={ref}
      id={id}
      name={name}
      label={label}
      placeholder={placeholder}
      className={className}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      fullWidth
      variant="standard"
      InputLabelProps={{ shrink: true }}
    />
  )
}

export default forwardRef(TextInput)
