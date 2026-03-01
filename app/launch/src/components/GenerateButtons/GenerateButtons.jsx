import React, { useState } from 'react'
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import Icon from '@material-ui/core/Icon'

import messages from '../../constants/messages.json'

import { GENERATE_SHORTCUT } from '../../constants/shortcuts'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { useStarterForm } from '../../state/store'
import OtherCommands from '../OtherCommands'
import { TooltipWrapper } from '../TooltipButton'

const GenerateButtons = ({
  disabled,
  theme,
  generateProject,
  _cloneProject,
  baseUrl,
}) => {
  const createPayload = useStarterForm()
  const [anchorEl, setAnchorEl] = useState(null)

  useKeyboardShortcuts(GENERATE_SHORTCUT.keys, generateProject, disabled)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDownload = (e) => {
    handleClose()
    generateProject(e)
  }

  return (
    <>
      <Button
        variant="contained"
        disabled={disabled}
        style={{ width: '100%' }}
        className={theme}
        onClick={handleClick}
        tabIndex={1}
      >
        <Icon className="action-button-icon" style={{ marginRight: 8 }}>
          build
        </Icon>
        Generate project
      </Button>
      <Menu
        id="build_now_dropdown"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ className: theme }}
      >
        <TooltipWrapper tooltip={messages.tooltips.generate}>
          <MenuItem onClick={handleDownload}>
            <ListItemIcon>
              <Icon>get_app</Icon>
            </ListItemIcon>
            <ListItemText primary="Download Zip" />
          </MenuItem>
        </TooltipWrapper>

        <OtherCommands
          baseUrl={baseUrl}
          createPayload={createPayload}
          theme={theme}
          trigger={
            <MenuItem>
              <ListItemIcon>
                <Icon>code</Icon>
              </ListItemIcon>
              <ListItemText primary="Commands" />
            </MenuItem>
          }
        />
      </Menu>
    </>
  )
}

export default GenerateButtons
