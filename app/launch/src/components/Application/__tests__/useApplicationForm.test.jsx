import React from 'react'
import { render } from '@testing-library/react'
import ApplicationState from '../../../state/ApplicationState'
import { useAppStore } from '../../../state/store'

beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState())
})

const TestView = () => {
  const form = useAppStore((s) => s.initialValues)

  return (
    <>
      <div className="type">{`${form.type || ''}`}</div>
      <div className="reloading">{`${form.reloading || ''}`}</div>
      <div className="servlet">{`${form.servlet || ''}`}</div>
      <div className="gorm">{`${form.gorm || ''}`}</div>
      <div className="javaVersion">{`${form.javaVersion || ''}`}</div>
      <div className="name">{`${form.name || 'demo'}`}</div>
      <div className="package">{`${form.package || 'com.example'}`}</div>
    </>
  )
}

const TEST_DATA = [
  { initialData: {}, hasError: false },
  { initialData: { javaVersion: 'JDK_11' }, hasError: false },
  { initialData: { reloading: 'JREBEL' }, hasError: false },
  { initialData: { reloading: 'DEVTOOLS' }, hasError: false },
  { initialData: { gorm: 'gorm-hibernate5' }, hasError: false },
  { initialData: { servlet: 'spring-boot-starter-tomcat' }, hasError: false },
  { initialData: { servlet: 'NONE' }, hasError: false },
  { initialData: { package: 'com.pretend' }, hasError: false },
  { initialData: { name: 'pretendo' }, hasError: false },
]

TEST_DATA.forEach(({ initialData }) => {
  it(`Initial Form Data with "${Object.keys(initialData).join(',')}"`, () => {
    const { container } = render(
      <ApplicationState initialData={initialData}>
        <TestView />
      </ApplicationState>
    )

    expect(container.querySelector('.reloading').textContent).toEqual(
      `${initialData.reloading || ''}`
    )
    expect(container.querySelector('.servlet').textContent).toEqual(
      `${initialData.servlet || ''}`
    )
    expect(container.querySelector('.gorm').textContent).toEqual(
      `${initialData.gorm || ''}`
    )
    expect(container.querySelector('.javaVersion').textContent).toEqual(
      `${initialData.javaVersion || ''}`
    )
    expect(container.querySelector('.name').textContent).toEqual(
      `${initialData.name || 'demo'}`
    )
    expect(container.querySelector('.package').textContent).toEqual(
      `${initialData.package || 'com.example'}`
    )
  })
})
