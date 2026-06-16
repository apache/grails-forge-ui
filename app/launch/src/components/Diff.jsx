// Diff.js
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
} from 'react'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
} from '@mui/material'

import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import messages from '../constants/messages.json'

import { DIFF_SHORTCUT } from '../constants/shortcuts'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import { useStarterForm } from '../state/store'
import { capitalize } from '../utility'
import TooltipButton from './TooltipButton'

const Diff = ({ theme = 'light', disabled, onLoad, onClose }, ref) => {
  const { gorm, servlet } = useStarterForm()

  const [diff, setDiff] = useState(null)
  useKeyboardShortcuts(DIFF_SHORTCUT.keys, onLoad, disabled)

  useImperativeHandle(ref, () => ({
    show: async (text) => {
      setDiff(text)
    },
  }))

  const handleClose = useMemo(() => {
    return () => {
      setDiff('')
      if (onClose) onClose()
    }
  }, [onClose, setDiff])

  return (
    <React.Fragment>
      <TooltipButton
        tooltip={messages.tooltips.diff}
        disabled={disabled}
        className={theme}
        style={{ marginRight: '5px', width: '100%' }}
        onClick={onLoad}
        tabIndex={1}
      >
        <Icon className="action-button-icon" style={{ marginRight: 8 }}>
          compare_arrows
        </Icon>
        Diff
      </TooltipButton>

      <Dialog
        open={!!diff}
        onClose={handleClose}
        maxWidth={false}
        fullWidth
        className={`diff ${theme}`}
        PaperProps={{
          className: `diff ${theme}`,
          style: { width: '95vw', height: '90vh', maxWidth: '95vw' },
        }}
      >
        <DialogTitle style={{ paddingBottom: 0, fontSize: '24px' }}>
          <strong style={{ fontSize: '24px' }}>
            {'Showing Diff for a Grails application using ' +
              capitalize(gorm) + ', ' + capitalize(servlet)}
          </strong>
        </DialogTitle>
        <DialogContent style={{ paddingTop: 8 }}>
          <Grid container className="grid-container" style={{ paddingTop: 0 }}>
            <Grid size={12} className={'grid-column'}>
              {diff && (
                <SyntaxHighlighter
                  className="codePreview"
                  language="diff"
                  style={theme === 'light' ? prism : darcula}
                  showLineNumbers={true}
                >
                  {diff}
                </SyntaxHighlighter>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default forwardRef(Diff)
