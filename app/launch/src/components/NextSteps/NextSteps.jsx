import React, { useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
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
  const { htmlUrl, cloneUrl } = info
  const [os, setOs] = useState(guessedOs)

  const unpackCommand = useMemo(() => {
    switch (info.type.toLowerCase()) {
      case 'clone':
        const all = `git clone ${cloneUrl}`
        const cmd = { [OS_NIX]: all, [OS_WINDOWS]: all }
        return { action: 'Clone the repo', cmd }
      case 'zip':
        const nix = `unzip ${name}.zip`
        const unzip = { [OS_NIX]: nix }
        return { action: 'Unzip the archive', cmd: unzip }
      default:
        return null
    }
  }, [info.type, cloneUrl, name])

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

        {htmlUrl && (
          <div className="next-steps-wrapper">
            <h5 className="heading">View your new repo on GitHub</h5>
            <Grid container className="next-steps-row">
              <Grid item className="text">{htmlUrl}</Grid>
              <Grid item className="icon">
                <a target="_blank" rel="noopener noreferrer" href={htmlUrl}>
                  <Icon>link</Icon>
                </a>
              </Grid>
            </Grid>
          </div>
        )}

        {unpackCommand && (
          <div className="next-steps-wrapper">
            <h5 className="heading">{unpackCommand.action}</h5>
            {unpackCommand.cmd[os] && (
              <Grid container className="next-steps-row">
                <Grid item className="text">{unpackCommand.cmd[os]}</Grid>
                <Grid item className="icon">
                  <CopyToClipboard value={unpackCommand.cmd[os]} />
                </Grid>
              </Grid>
            )}
          </div>
        )}

        <div className="next-steps-wrapper">
          <h5 className="heading">cd into the project</h5>
          <Grid container className="next-steps-row">
            <Grid item className="text">{cdCommand.cmd[os]}</Grid>
            <Grid item className="icon">
              <CopyToClipboard value={cdCommand.cmd[os]} />
            </Grid>
          </Grid>
        </div>

        <div className="next-steps-wrapper">
          <h5 className="heading">{launchCommand.action}</h5>
          <Grid container className="next-steps-row">
            <Grid item className="text">{launchCommand.cmd[os]}</Grid>
            <Grid item className="icon">
              <CopyToClipboard value={launchCommand.cmd[os]} />
            </Grid>
          </Grid>
        </div>

        <p className="info">
          Once you've gotten your new project started, you can continue your
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
