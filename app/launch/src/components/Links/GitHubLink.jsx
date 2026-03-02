// GitHubLink.js
import React from 'react'
import GitHubIcon from '@material-ui/icons/GitHub'

export const GitHubLink = ({ className, theme }) => {
  const backgroundColor = theme === 'dark' ? 'var(--theme-dark)' : 'white'

  return (
    <a
      href="https://github.com/grails/grails-forge"
      aria-label="Grails Application Forge Github Repo"
      title="Grails Application Forge Github Repo"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{ backgroundColor }}
    >
      <GitHubIcon />
    </a>
  )
}
export default GitHubLink
