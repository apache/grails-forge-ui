import { describe, expect, it } from 'vitest'

import { OS_NIX, OS_WINDOWS } from '../../utility'
import { CreateCommand } from '../CreateCommand'

const configuration = {
  type: 'WEB',
  javaVersion: 'JDK_25',
  servlet: 'TOMCAT',
  gorm: 'MONGODB',
  reloading: 'DEVTOOLS',
  name: 'demo',
  package: 'com.example',
  features: { 'grails-compile-static': {}, 'grails-startup-progress': {} },
}
const baseUrl = 'https://next-snapshot.grails.org'
const command = new CreateCommand(configuration, baseUrl)

const url =
  'https://next-snapshot.grails.org/create/web/com.example.demo?gorm=MONGODB&servlet=TOMCAT&reloading=DEVTOOLS&javaVersion=JDK_25&features=grails-compile-static&features=grails-startup-progress'

const commandWith = (overrides, base = baseUrl) =>
  new CreateCommand({ ...configuration, ...overrides }, base)

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
      `curl.exe -fsSLo demo.zip '${url}'; if ($?) { tar -xf demo.zip; cd demo; .\\gradlew.bat bootRun }`
    )
    expect(windows).not.toContain('&&')
  })

  describe('a configuration seeded from a shared link', () => {
    const attacks = {
      'a name that ends the command': { name: "demo';touch pwned;'" },
      'a name that chains a command': { name: 'demo && touch pwned' },
      'a name with command substitution': { name: '$(touch pwned)' },
      'a name with a PowerShell subexpression': { name: 'demo;$(calc)' },
      'a package that ends the quote': {
        package: "com.example';touch pwned;'",
      },
      'a feature that ends the quote': {
        features: { "x';touch pwned;'": {} },
      },
      'an option that ends the quote': { gorm: "MONGODB';touch pwned;'" },
      'an empty name': { name: '' },
    }

    Object.entries(attacks).forEach(([label, overrides]) => {
      it(`gets no command for ${label}`, () => {
        expect(commandWith(overrides).toRunCommand(OS_NIX)).toBeNull()
        expect(commandWith(overrides).toRunCommand(OS_WINDOWS)).toBeNull()
      })
    })

    it('still gets a command for every value Forge accepts', () => {
      const accepted = commandWith({
        name: 'My_App-2',
        package: 'org.example_1.app',
        features: { 'spring-boot-starter-security': {}, 'views-json': {} },
      })

      expect(accepted.toRunCommand(OS_NIX)).toContain('cd My_App-2 &&')
    })
  })

  it('keeps a quote in the URL inside the quoted argument on each shell', () => {
    const quoted = commandWith({}, "https://forge.example/it's")

    expect(quoted.toRunCommand(OS_NIX)).toContain(
      `'https://forge.example/it'\\''s/create/`
    )
    expect(quoted.toRunCommand(OS_WINDOWS)).toContain(
      `'https://forge.example/it''s/create/`
    )
  })
})
