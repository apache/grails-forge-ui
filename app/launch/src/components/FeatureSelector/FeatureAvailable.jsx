// FeatureAvailable.js
import React from 'react'

import {
  Card,
  CardHeader,
  Fab,
  Icon,
} from '@mui/material'

const FeatureAvailable = ({ feature, toggleFeatures }) => {
    const implied = Boolean(feature.impliedBy)
    const disabled = Boolean(feature.conflictsWith)
    const stateSuffix = implied
        ? ` — included automatically by ${feature.impliedBy}`
        : disabled
        ? ` — unavailable with ${feature.conflictsWith}`
        : ''
    return (
        <Card
            id={`mn-feature-${feature.name}`}
            className={`mn-feature-selection hoverable ${
                feature.selected ? 'selected' : ''
            }${implied ? ' implied' : ''}${disabled ? ' disabled' : ''}`}
            onClick={(e) => toggleFeatures(e, feature)}
            style={{
                cursor: implied || disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                position: 'relative',
            }}
        >
            <CardHeader
              title={
                (feature.preview != null && feature.preview
                    ? feature.title + ' (preview)'
                    : feature.title) +
                (feature.community != null && feature.community
                    ? ' (community)'
                    : '') +
                stateSuffix
              }
              subheader={feature.description}
              titleTypographyProps={{
                variant: 'subtitle1',
                style: { fontSize: '24px', fontWeight: 300, lineHeight: '32px' },
              }}
              subheaderTypographyProps={{
                variant: 'body2',
                className: 'grey-text',
              }}
            />
            {feature.selected && (
                <Fab
                    size="small"
                    style={{ position: 'absolute', top: -12, right: -15 }}
                    className="black remove-button"
                >
                    <Icon>close</Icon>
                </Fab>
            )}
        </Card>
    )
}

export default FeatureAvailable
