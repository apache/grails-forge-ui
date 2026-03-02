// DefaultIncludedFeatureList.js
import React, { useMemo } from 'react'
import {
    useDefaultIncludedFeaturesValue,
} from '../../state/store'

export function DefaultFeature({ feature }) {
    const style = { marginRight: 10 }
    return (
        <div style={style} className="chip">
            {feature.title}
        </div>
    )
}

export function DefaultIncludedFeatureList() {
    const defaultIncludedFeatures = useDefaultIncludedFeaturesValue()
    const defaultIncludedFeatureValues = useMemo(
        () =>
            Object.values(defaultIncludedFeatures).sort((a, b) => {
                return a.title > b.title ? 1 : -1
            }),
        [defaultIncludedFeatures]
    )
    const sRows = useMemo(() => {
        return defaultIncludedFeatureValues.map((f, idx) => (
            <DefaultFeature
                key={`${f.name}-${idx}`}
                feature={f}
            />
        ))
    }, [defaultIncludedFeatureValues])

    return (
        <div className="col s12">
            <h6>Default Included Features ({defaultIncludedFeatureValues.length})</h6>
            {sRows}
        </div>
    )
}
