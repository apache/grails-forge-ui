// InfoButton.js
import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Icon,
} from '@mui/material'
import { HELP_SHORTCUT, SHORTCUT_REGISTRY } from '../constants/shortcuts'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'

const InfoButton = ({ className = '', theme, style }) => {
  const [open, setOpen] = useState(false)

  const onShow = useCallback(() => {
    setOpen(true)
  }, [])

  const onClose = useMemo(() => {
    return () => setOpen(false)
  }, [setOpen])

  useKeyboardShortcuts(HELP_SHORTCUT.keys, onShow)

  return (
    <>
      <Fab
        size="small"
        style={style}
        onClick={onShow}
        className={`${theme} ${className}`}
      >
        <Icon>info</Icon>
      </Fab>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className={`${theme} info-modal`}
        PaperProps={{ className: `${theme}` }}
      >
        <DialogTitle>{"What's this?"}</DialogTitle>
        <DialogContent>
          <div className="info-contents">
            <p>
              Grails Forge is a web application that allows you to create
              Grails projects through an interface instead of using the console
              CLI. You can set the project type, the project name, the
              Grails Data implementation (Hibernate5, MongoDB, Neo4J), the embedded servlet container (Tomcat, Jetty, Undertow, or None),
              the Java version and the features you need to develop your software.
            </p>
            <div className="shortcut-legend">
              <label>
                <b>Keyboard Shortcuts</b>
              </label>
              <ul style={{ marginTop: 0 }}>
                {SHORTCUT_REGISTRY.map((sc) => (
                  <li key={sc.textValue}>
                    <span className={`${theme} pill`}>{sc.textValue}</span>{' '}
                    {sc.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default InfoButton
