// TooltipButton.js
import React from 'react'
import Button from '@material-ui/core/Button'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

const theme = createTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '0.9em',
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
