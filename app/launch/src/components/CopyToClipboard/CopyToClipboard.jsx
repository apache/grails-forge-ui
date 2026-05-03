import React, { useState } from 'react'
import AssignmentIcon from '@mui/icons-material/Assignment'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'

import { copyToClipboard } from '../../utility'

const CopyToClipboard = ({ value, copiedMessage = 'Copied!', children }) => {
  const [copied, setCopied] = useState(false)
  const onClick = () => {
    setCopied(true)
    copyToClipboard(value)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }
  const copyClass = ['copied']
  if (copied) {
    copyClass.push('active')
  }

  const Icon = copied ? AssignmentTurnedInIcon : AssignmentIcon
  return (
    <div
      className="copy-to-clipboard clickable"
      onClick={onClick}
      role="button"
    >
      <span className={copyClass.join(' ')}>{copiedMessage}</span>
      {children}
      <Icon />
    </div>
  )
}

export default CopyToClipboard
