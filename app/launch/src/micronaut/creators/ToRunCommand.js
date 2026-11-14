import { OS_WINDOWS } from '../../utility'

// The form can be seeded from a shared link, so nothing reaches a command a
// visitor pastes into a shell unless it is a value Forge itself would accept:
// these match the application names, packages and options Forge generates.
const NAME = /^[A-Za-z][A-Za-z0-9_-]*$/
const PACKAGE = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/
const FEATURE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
const OPTION = /^[A-Za-z0-9_]*$/

const isSafe = (createCommand) => {
  const { name, type, gorm, servlet, reloading, javaVersion, features } =
    createCommand
  return (
    NAME.test(name || '') &&
    PACKAGE.test(createCommand.package || '') &&
    [type, gorm, servlet, reloading, javaVersion].every((option) =>
      OPTION.test(option || '')
    ) &&
    Object.keys(features || {}).every((feature) => FEATURE.test(feature))
  )
}

// POSIX shells: nothing inside single quotes is special but the quote itself
const posixQuote = (value) => `'${value.replace(/'/g, `'\\''`)}'`

// PowerShell: single-quoted strings expand nothing, and '' is a literal quote
const powerShellQuote = (value) => `'${value.replace(/'/g, `''`)}'`

// One line that downloads the project, unzips it and starts it, or null when
// the configuration holds a value Forge would not generate a project for.
// curl -f stops the line on an error response instead of saving it as the
// archive. The name needs no quoting once it has been checked.
export default class ToRunCommand {
  static make(createCommand, os) {
    if (!isSafe(createCommand)) {
      return null
    }
    const { name } = createCommand
    const url = createCommand.toUrl('create')
    const zip = `${name}.zip`

    if (os === OS_WINDOWS) {
      // PowerShell, the default Windows shell: Windows PowerShell 5.1 has no &&,
      // so $? gates the rest. curl.exe and tar ship with Windows 10 and later.
      return `curl.exe -fsSLo ${zip} ${powerShellQuote(url)}; if ($?) { tar -xf ${zip}; cd ${name}; .\\gradlew.bat bootRun }`
    }
    return `curl -fsSLo ${zip} ${posixQuote(url)} && unzip -q ${zip} && cd ${name} && ./gradlew bootRun`
  }
}
