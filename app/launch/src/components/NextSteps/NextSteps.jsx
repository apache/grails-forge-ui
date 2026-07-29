import React, { useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material'
import { useStarterForm } from '../../state/store'
import { guessOs, osOpts, OS_WINDOWS, OS_NIX } from '../../utility'
import CopyToClipboard from '../CopyToClipboard'

const guessedOs = guessOs()
const sortedOsOpts = osOpts.sort((a, b) => {
  return a.value === guessedOs
    ? -1
    : b.value === guessedOs
    ? 0
    : a.value > b.value
    ? 0
    : -1
})

const NextSteps = ({ info, theme = 'light', onClose, onStartOver }) => {
  const { name } = useStarterForm()
  const [os, setOs] = useState(guessedOs)

  const unpackCommand = useMemo(() => {
    const nix = `unzip ${name}.zip`
    return { action: 'Unzip the archive', cmd: { [OS_NIX]: nix } }
  }, [name])

  const cdCommand = useMemo(() => {
    const cd = `cd ${name}`
    return {
      action: 'cd into the project',
      cmd: {
        [OS_NIX]: cd,
        [OS_WINDOWS]: cd,
      },
    }
  }, [name])

  const launchCommand = useMemo(() => {
    const cmd = { action: 'Run Application!' }
    cmd.cmd = {
      [OS_NIX]: './gradlew bootRun',
      [OS_WINDOWS]: 'gradlew bootRun',
    }
    return cmd
  }, [])

  return (
    <Dialog
      open={info.show}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={`${theme} next-steps`}
      PaperProps={{ className: `${theme}` }}
    >
      <DialogTitle>Your Grails app is ready for takeoff.</DialogTitle>
      <DialogContent>
        <div className="os-select-opt-row">
          {sortedOsOpts.map((anOs) => (
            <div key={anOs.value} className="os-select-opt-col">
              <span
                className={['os-select', anOs.value === os && 'active'].join(' ')}
                role="button"
                onClick={() => setOs(anOs.value)}
              >
                {anOs.label}
              </span>
            </div>
          ))}
        </div>

        <div className="next-steps-wrapper">
          <h5 className="heading">{unpackCommand.action}</h5>
          {unpackCommand.cmd[os] && (
            <Grid container className="next-steps-row">
              <Grid className="text">{unpackCommand.cmd[os]}</Grid>
              <Grid className="icon">
                <CopyToClipboard value={unpackCommand.cmd[os]} />
              </Grid>
            </Grid>
          )}
        </div>

        <div className="next-steps-wrapper">
          <h5 className="heading">cd into the project</h5>
          <Grid container className="next-steps-row">
            <Grid className="text">{cdCommand.cmd[os]}</Grid>
            <Grid className="icon">
              <CopyToClipboard value={cdCommand.cmd[os]} />
            </Grid>
          </Grid>
        </div>

        <div className="next-steps-wrapper">
          <h5 className="heading">{launchCommand.action}</h5>
          <Grid container className="next-steps-row">
            <Grid className="text">{launchCommand.cmd[os]}</Grid>
            <Grid className="icon">
              <CopyToClipboard value={launchCommand.cmd[os]} />
            </Grid>
          </Grid>
        </div>

        <p className="info">
          Once you{"'"}ve gotten your new project started, you can continue your
          journey by reviewing our{' '}
          <a href="https://grails.apache.org/documentation.html">documentation</a> and{' '}
          <a href="https://guides.grails.org/index.html">Grails Guides</a>
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
        <Button onClick={onStartOver}>
          Start Over
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NextSteps
