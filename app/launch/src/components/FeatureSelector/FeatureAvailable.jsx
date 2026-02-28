// FeatureAvailable.js
import React from 'react'

import {
  Card,
  CardHeader,
  Fab,
} from '@material-ui/core'
import Icon from '@material-ui/core/Icon'

const FeatureAvailable = ({ feature, toggleFeatures }) => {
    return (
        <Card
            id={`mn-feature-${feature.name}`}
            className={`mn-feature-selection hoverable ${
                feature.selected && 'selected'
            }`}
            onClick={(e) => toggleFeatures(e, feature)}
            style={{ cursor: 'pointer', position: 'relative' }}
        >
            <CardHeader
              title={
                (feature.preview != null && feature.preview
                    ? feature.title + ' (preview)'
                    : feature.title) +
                (feature.community != null && feature.community
                    ? ' (community)'
                    : '')
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
