// Link.react.test.js
import React from 'react'
import { create, act } from 'react-test-renderer'
import { useRecoilState } from 'recoil'
import ApplicationState from '../../../state/ApplicationState'
import { initialValueState } from '../../../state/store'

const TestView = () => {
  const [form] = useRecoilState(initialValueState)

  return (
    <>
      <div className="type">{`${form.type}`}</div>
      <div className="reloading">{`${form.reloading}`}</div>
      <div className="servlet">{`${form.servlet}`}</div>
      <div className="gorm">{`${form.gorm}`}</div>
      <div className="javaVersion">{`${form.javaVersion}`}</div>
      <div className="name">{`${form.name}`}</div>
      <div className="package">{`${form.package}`}</div>
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
    let testRenderer
    act(() => {
      testRenderer = create(
        <ApplicationState initialData={initialData}>
          <TestView />
        </ApplicationState>
      )
    })

    const testInstance = testRenderer.root
    expect(testRenderer.toJSON()).toMatchSnapshot()

    expect(testInstance.findByProps({ className: 'reloading' }).children).toEqual([
      `${initialData.reloading || ''}`,
    ])

    expect(testInstance.findByProps({ className: 'servlet' }).children).toEqual([
      `${initialData.servlet || ''}`,
    ])

    expect(testInstance.findByProps({ className: 'gorm' }).children).toEqual([
      `${initialData.gorm || ''}`,
    ])

    expect(
      testInstance.findByProps({ className: 'javaVersion' }).children
    ).toEqual([`${initialData.javaVersion || ''}`])

    expect(testInstance.findByProps({ className: 'name' }).children).toEqual([
      `${initialData.name || 'demo'}`,
    ])

    expect(testInstance.findByProps({ className: 'package' }).children).toEqual(
      [`${initialData.package || 'com.example'}`]
    )
  })
})
