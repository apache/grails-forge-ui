// OtherCommands.js
import React, { useMemo, useState, cloneElement } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@material-ui/core'
import { useCreateCommand } from '../../state/store'
import CopyToClipboard from '../CopyToClipboard'

export default function OtherCommands({ theme, trigger }) {
  const createCommand = useCreateCommand()
  const [open, setOpen] = useState(false)
  const actions = useMemo(() => {
    if (!createCommand) return []
    return [
      { link: createCommand.toCli(), title: 'Using the Grails CLI' },
      { link: createCommand.toCurl(), title: 'Using cURL' },
    ]
  }, [createCommand])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const triggerElement = trigger
    ? cloneElement(trigger, { onClick: handleOpen })
    : null

  return (
    <>
      {triggerElement}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        className={`${theme} next-steps other-configuration`}
        PaperProps={{ className: `${theme}` }}
      >
        <DialogTitle>Other ways to build this configuration.</DialogTitle>
        <DialogContent>
          {actions.map((action) => {
            return (
              <div key={action.link} className="next-steps-wrapper">
                <h6 className="heading">{action.title}</h6>
                <Grid container className="next-steps-row multi-line">
                  <Grid item className="text">{action.link}</Grid>
                  <Grid item className="icon">
                    <CopyToClipboard value={action.link} />
                  </Grid>
                </Grid>
              </div>
            )
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
