// TooltipButton.js
import React from 'react'
import Button from '@mui/material/Button'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.9em',
        },
      },
    },
  },
})

const TooltipButton = ({ tooltip, children, disabled, className, style, onClick, tabIndex, ..._props }) => {
  return (
    <ThemeProvider theme={theme}>
      <Tooltip
        enterDelay={600}
        enterNextDelay={350}
        enterTouchDelay={300}
        title={tooltip}
        arrow
        placement="top"
      >
        <span>
          <Button
            variant="contained"
            disabled={disabled}
            className={className}
            style={style}
            onClick={onClick}
            tabIndex={tabIndex}
          >
            {children}
          </Button>
        </span>
      </Tooltip>
    </ThemeProvider>
  )
}

export const TooltipWrapper = ({ tooltip, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Tooltip
        enterDelay={600}
        enterNextDelay={350}
        enterTouchDelay={300}
        title={tooltip}
        arrow
        placement="top"
      >
        {children}
      </Tooltip>
    </ThemeProvider>
  )
}

export default TooltipButton
