import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material'

import { useCreateCommand } from '../../state/store'
import { guessOs, osOpts, OS_NIX, OS_WINDOWS } from '../../utility'
import CopyToClipboard from '../CopyToClipboard'

export default function RunCommand({ open, onClose, theme }) {
  const createCommand = useCreateCommand()
  const [os, setOs] = useState(() => guessOs() || OS_NIX)

  const command = createCommand ? createCommand.toRunCommand(os) : null
  const name = createCommand ? createCommand.name : ''
  const jdk = createCommand?.javaVersion?.replace('JDK_', '')

  return (
    <Dialog
      open={Boolean(open)}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={`${theme} next-steps run-command`}
      slotProps={{ paper: { className: `${theme}` } }}
    >
      <DialogTitle>Run it from your terminal</DialogTitle>
      <DialogContent>
        <div className="os-select-opt-row">
          {osOpts.map((anOs) => (
            <div key={anOs.value} className="os-select-opt-col">
              <span
                className={['os-select', anOs.value === os && 'active']
                  .filter(Boolean)
                  .join(' ')}
                role="button"
                aria-pressed={anOs.value === os}
                onClick={() => setOs(anOs.value)}
              >
                {anOs.label}
              </span>
            </div>
          ))}
        </div>

        <div className="next-steps-wrapper">
          {command ? (
            <>
              <Grid container className="next-steps-row multi-line">
                <Grid className="text">
                  <code>{command}</code>
                </Grid>
                <Grid className="icon">
                  <CopyToClipboard value={command} />
                </Grid>
              </Grid>
              <p className="run-command-note">
                {os === OS_WINDOWS && 'Paste it into PowerShell. '}
                It downloads the project into <code>{name}</code> and starts it
                {jdk ? `, which needs JDK ${jdk} or newer` : ''}.
              </p>
            </>
          ) : (
            <p className="run-command-note">
              Use a name that starts with a letter and has only letters, digits,
              - and _, and a package of Java identifiers, to get a command for
              this project.
            </p>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
