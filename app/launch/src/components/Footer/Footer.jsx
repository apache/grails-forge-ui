// Footer.js
import React, { useState, useEffect } from 'react'
import { Fab } from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
import InfoButton from '../InfoButton'
import Getter from '../Links/GetterLink'
import GitHub from '../Links/GitHubLink'
import MailToLink from '../Links/MailToLink'
import Twitter from '../Links/TwitterLink'
import ShareModal from '../NextSteps/ShareModal'

const Footer = ({ _info, theme, onToggleTheme, _onShowInfo, sharable }) => {
  const [active, setActive] = useState(false)
  const toggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setActive((a) => !a)
  }

  useEffect(() => {
    const listener = (_e) => {
      setActive(false)
    }
    window.addEventListener('click', listener)
    return () => window.removeEventListener('click', listener)
  }, [])
  return (
    <footer className="container mn-footer-container">
      <div className={`icon-wrapper ${active && 'active'}`}>
        <div
          className="mobile-icon-control"
          style={{ zIndex: 4000 }}
          onClick={toggle}
        >
          <Fab size="small" className={`${theme} header-icon`}>
            <Icon>add</Icon>
          </Fab>
        </div>
        <div>
          <InfoButton theme={theme} className="header-icon" />
        </div>
        <ShareModal
          sharable={sharable}
          theme={theme}
          trigger={
            <div>
              <Fab size="small" className={`${theme} header-icon`}>
                <Icon className="header-icon">share</Icon>
              </Fab>
            </div>
          }
        />
        <div>
          <Fab
            size="small"
            className={`${theme} header-icon`}
            onClick={onToggleTheme}
          >
            <Icon>brightness_medium</Icon>
          </Fab>
        </div>
        <div>
          <GitHub theme={theme} className="header-icon" />
        </div>
        <div>
          <Twitter theme={theme} className="header-icon" />
        </div>
        <div>
          <Getter theme={theme} className="header-icon" />
        </div>
        <div>
          <MailToLink theme={theme} className="header-icon" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
