function deriveCommand(type) {
  switch (type) {
    case 'WEB':
      return 'create-app'
    case 'REST_API':
      return 'create-restapi'
    case 'PLUGIN':
      return 'create-plugin'
    case 'WEB_PLUGIN':
      return 'create-web-plugin'
    default:
      return `create-${type}`.toLowerCase()
  }
}

function buildFeaturesArgs(features) {
  const entries = Object.keys(features)
  if (entries.length) {
    return `${entries.join(',')}`
  }
}

export default class ToCli {
  static make(createCommand) {
    const { gorm, servlet, reloading, javaVersion } = createCommand
    const jdk = javaVersion ? javaVersion.replace('JDK_', '') : null
    const command = deriveCommand(createCommand.type)
    const applicationName = createCommand.applicationName()

    const features = buildFeaturesArgs(createCommand.features)
    const opts = { servlet, jdk, gorm, reloading, features }
    const args = Object.keys(opts).reduce((acc, key) => {
      const value = opts[key]
      if (value) {
        acc.push(`--${key}=${value}`)
      }
      return acc
    }, [])

    return ['grails-forge-cli', command, ...args, applicationName].join(' ').toLowerCase()
  }
}
