import { describe, expect, it } from 'vitest'

import { OS_NIX, OS_WINDOWS } from '../../utility'
import { CreateCommand } from '../CreateCommand'

const command = new CreateCommand(
  {
    type: 'WEB',
    javaVersion: 'JDK_25',
    servlet: 'TOMCAT',
    gorm: 'MONGODB',
    reloading: 'DEVTOOLS',
    name: 'demo',
    package: 'com.example',
    features: { 'grails-compile-static': {}, 'grails-startup-progress': {} },
  },
  'https://next-snapshot.grails.org'
)

const url =
  'https://next-snapshot.grails.org/create/web/com.example.demo?gorm=MONGODB&servlet=TOMCAT&reloading=DEVTOOLS&javaVersion=JDK_25&features=grails-compile-static&features=grails-startup-progress'

describe('ToRunCommand', () => {
  it('downloads, unzips and starts the project in one line on Unix, Linux and macOS', () => {
    expect(command.toRunCommand(OS_NIX)).toBe(
      `curl -fsSLo demo.zip '${url}' && unzip -q demo.zip && cd demo && ./gradlew bootRun`
    )
  })

  it('downloads the same archive the Download Zip button does', () => {
    expect(command.toRunCommand(OS_NIX)).toContain(
      `'${command.toUrl('create')}'`
    )
  })

  it('uses PowerShell syntax on Windows, which Windows PowerShell 5.1 can run without &&', () => {
    const windows = command.toRunCommand(OS_WINDOWS)

    expect(windows).toBe(
      `curl.exe -fsSLo demo.zip "${url}"; if ($?) { tar -xf demo.zip; cd demo; .\\gradlew.bat bootRun }`
    )
    expect(windows).not.toContain('&&')
  })
})
