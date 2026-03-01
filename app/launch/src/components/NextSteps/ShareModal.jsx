// ShareModal.js
import React, { forwardRef, useMemo, useState, cloneElement } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@material-ui/core'
import messages from '../../constants/messages.json'
import {
  fullyQualifySharableLink,
  ACTIVITY_KEY,
  FEATURES_KEY,
  PREVIEW_ACTIVITY,
  DIFF_ACTIVITY,
  CREATE_ACTIVITY,
} from '../../helpers/Routing'
import { useSharableLink } from '../../state/store'
import CopyToClipboard from '../CopyToClipboard'

const ShareModal = ({ theme, trigger, onClose }, _ref) => {
  const sharable = useSharableLink()
  const [open, setOpen] = useState(false)

  const actions = useMemo(() => {
    return [
      {
        title: messages.share.config,
        link: fullyQualifySharableLink(sharable),
      },
      {
        title: messages.share.preview,
        link: fullyQualifySharableLink(sharable, {
          [ACTIVITY_KEY]: PREVIEW_ACTIVITY,
        }),
      },
      {
        title: messages.share.diff,
        link: fullyQualifySharableLink(sharable, {
          [ACTIVITY_KEY]: DIFF_ACTIVITY,
        }),
        exclude: !`${sharable}`.includes(FEATURES_KEY),
      },
      {
        title: messages.share.zip,
        link: fullyQualifySharableLink(sharable, {
          [ACTIVITY_KEY]: CREATE_ACTIVITY,
        }),
      },
    ].filter((i) => !i.exclude)
  }, [sharable])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    if (onClose) onClose()
  }

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
        className={`${theme} next-steps share`}
        PaperProps={{ className: `${theme}` }}
      >
        <DialogTitle>{messages.share.header}</DialogTitle>
        <DialogContent>
          {actions.map((action) => {
            return (
              <div key={action.link} className="next-steps-wrapper">
                <h6 className="heading">{action.title}</h6>
                <Grid container className="next-steps-row">
                  <Grid item className="text">{action.link}</Grid>
                  <Grid item className="icon">
                    <CopyToClipboard value={action.link} />
                  </Grid>
                </Grid>
              </div>
            )
          })}
          <p className="info">
            Once you{"'"}ve gotten your new project started, you can continue your
            journey by reviewing our{' '}
            <a href="https://grails.org/documentation.html">documentation</a> and{' '}
            <a href="https://guides.grails.org/index.html">Grails Guides</a>
          </p>
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

export default forwardRef(ShareModal)
