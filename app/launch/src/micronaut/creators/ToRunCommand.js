import { OS_WINDOWS } from '../../utility'

// One line that downloads the project, unzips it and starts it. curl -f stops
// the line on an error response instead of saving it as the archive.
export default class ToRunCommand {
  static make(createCommand, os) {
    const { name } = createCommand
    const url = createCommand.toUrl('create')
    const zip = `${name}.zip`

    if (os === OS_WINDOWS) {
      // PowerShell, the default Windows shell: Windows PowerShell 5.1 has no &&,
      // so $? gates the rest. curl.exe and tar ship with Windows 10 and later.
      return `curl.exe -fsSLo ${zip} "${url}"; if ($?) { tar -xf ${zip}; cd ${name}; .\\gradlew.bat bootRun }`
    }
    return `curl -fsSLo ${zip} '${url}' && unzip -q ${zip} && cd ${name} && ./gradlew bootRun`
  }
}
