// FeatureSelected.js
import React, { useMemo } from 'react'
import { impliedFeatures } from '../../helpers/featureRelations'
import {
  useAvailableFeatures,
  useSelectedFeaturesHandlers,
  useSelectedFeaturesValue,
} from '../../state/store'

const closeButtonStyle = {
  cursor: 'pointer',
  float: 'right',
  fontSize: '16px',
  lineHeight: '32px',
  paddingLeft: '8px',
}

export function FeatureSelected({ feature, onRemoveFeature, hasError }) {
  const style = { marginRight: 10 }
  if (hasError) {
    style.background = 'var(--theme-danger)'
    style.color = 'white'
  }
  return (
    <div style={style} className="chip">
      {feature.title}
      <i
        onClick={(e) => {
          e.preventDefault()
          onRemoveFeature(feature)
        }}
        className="material-icons"
        style={closeButtonStyle}
      >
        close
      </i>
    </div>
  )
}

export function FeatureSelectedList() {
  const selectedFeatures = useSelectedFeaturesValue()
  const { features: availableFeatures } = useAvailableFeatures()
  const { onRemoveFeature } = useSelectedFeaturesHandlers()

  const selectedFeatureValues = useMemo(
    () =>
      Object.values(selectedFeatures).sort((a, b) => {
        return a.title > b.title ? 1 : -1
      }),
    [selectedFeatures]
  )

  const sRows = useMemo(() => {
    const keys = availableFeatures.map((i) => i.name)

    return selectedFeatureValues.map((f, idx) => (
      <FeatureSelected
        key={`${f.name}-${idx}`}
        feature={f}
        hasError={keys.length && !keys.includes(f.name)}
        onRemoveFeature={() => onRemoveFeature(f)}
      />
    ))
  }, [selectedFeatureValues, onRemoveFeature, availableFeatures])

  const impliedRows = useMemo(() => {
    const implied = impliedFeatures(selectedFeatures, availableFeatures)
    return Object.entries(implied).map(([name, byTitle]) => {
      const feature = availableFeatures.find((f) => f.name === name)
      return (
        <div
          key={`implied-${name}`}
          className="chip implied"
          style={{ marginRight: 10, opacity: 0.7 }}
          title={`Included automatically by ${byTitle}`}
        >
          {feature ? feature.title : name} (included)
        </div>
      )
    })
  }, [selectedFeatures, availableFeatures])

  return (
    <div className="col s12">
      <h6>Additional Selected Features ({selectedFeatureValues.length})</h6>
      {sRows}
      {impliedRows}
    </div>
  )
}
