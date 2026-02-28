import ToUrl from './creators/ToUrl'

export class FeatureCommand {
  constructor(
    { javaVersion, servlet, gorm, reloading },
    featuresUrl = ''
  ) {
    this.javaVersion = javaVersion
    this.servlet = servlet
    this.gorm = gorm
    this.reloading = reloading
    this.baseUrl = featuresUrl
  }

  toUrl() {
    return ToUrl.makeFeaturesUrl(this, this.baseUrl)
  }

}
