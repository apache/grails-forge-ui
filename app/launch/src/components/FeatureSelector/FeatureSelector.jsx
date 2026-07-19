// FeatureSelector.js
import React, { useMemo, useRef, useState } from 'react'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Icon,
} from '@mui/material'
import messages from '../../constants/messages.json'
import {
  conflictingWith,
  impliedFeatures,
  occupiedGroups,
} from '../../helpers/featureRelations'
import { ModalKeyboardHandler } from '../../helpers/ModalKeyboardHandler'
import {
  useSelectedFeatures,
  useSelectedFeaturesHandlers,
} from '../../state/store'

import TextInput from '../TextInput'
import TooltipButton from '../TooltipButton'
import FeatureAvailable from './FeatureAvailable'

import './feature-selector.css'

const keyboardHandler = new ModalKeyboardHandler({
  sectionKey: 'modal-group',
  headerHeight: 24,
})

const featureSorter = (a, b) => {
  return a.category < b.category ? -1 : a.name < b.name ? -1 : 1
}

const featureCategoryReducer = (map, result) => {
  if (!map[result.category]) {
    map[result.category] = [result]
  } else {
    map[result.category].push(result)
  }
  return map
}

const FeatureAvailableGroup = ({ category, entities, toggleFeatures }) => {
  return (
    <Grid container spacing={2} className={`modal-group category ${category}`}>
      <Grid size={12}>
        <h6>{category}</h6>
      </Grid>
      {entities.map((feature, i) => (
        <Grid size={12} key={i}>
          <FeatureAvailable feature={feature} toggleFeatures={toggleFeatures} />
        </Grid>
      ))}
    </Grid>
  )
}

export const FeatureSelectorModal = ({ theme = 'light' }) => {
  const inputRef = useRef(null)
  const contentRef = useRef(null)
  const [open, setOpen] = useState(false)

  const [selectedFeatures, , features, loading] = useSelectedFeatures()
  const { onAddFeature, onRemoveFeature, onRemoveAllFeatures } =
    useSelectedFeaturesHandlers()

  const [search, setSearch] = useState('')

  const selectedFeatureKeys = Object.keys(selectedFeatures)
  const availableFeatures = useMemo(() => {
    const implied = impliedFeatures(selectedFeatures, features)
    const groups = occupiedGroups(selectedFeatures, features)
    return features.map((feature) => {
      const selected = selectedFeatureKeys.includes(feature.name)
      const impliedBy = !selected ? implied[feature.name] : undefined
      const conflict =
        !selected && !impliedBy
          ? conflictingWith(feature, groups, features)
          : null
      return {
        ...feature,
        selected,
        impliedBy,
        conflictsWith: conflict,
      }
    })
  }, [features, selectedFeatures, selectedFeatureKeys])

  const searchResults = useMemo(() => {
    if (!search.length) {
      return availableFeatures
    }
    const lcSearch = search.toLowerCase()
    return availableFeatures.filter((feature) => {
      const { name, description, category, tags } = feature
      return (
        name.toLowerCase().includes(lcSearch) ||
        description.toLowerCase().includes(lcSearch) ||
        category.toLowerCase().includes(lcSearch) ||
          (tags && tags.toLowerCase().includes(lcSearch))
      )
    })
  }, [search, availableFeatures])

  const groupedResults = useMemo(() => {
    return searchResults.sort(featureSorter).reduce(featureCategoryReducer, {})
  }, [searchResults])

  const toggleFeatures = (event, feature) => {
    if (event && event.preventDefault) {
      event.preventDefault()
    }
    if (feature.conflictsWith || feature.impliedBy) {
      return
    }
    feature.selected ? onRemoveFeature(feature) : onAddFeature(feature)
  }

  const removeAll = (event) => {
    event.preventDefault()
    onRemoveAllFeatures()
  }

  const handleOpen = () => {
    setOpen(true)
    setTimeout(() => {
      if (inputRef.current && typeof inputRef.current.focus === 'function') {
        inputRef.current.focus()
      }
    }, 300)
  }

  const handleKeyDown = useMemo(
    () => keyboardHandler.createKeyDownHandler(() => contentRef.current),
    []
  )

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div id="feature-selector-wrapper" style={{ marginBottom: 0 }}>
      <TooltipButton
        tooltip={messages.tooltips.features}
        className={theme}
        style={{ marginRight: '5px', width: '100%' }}
        tabIndex={1}
        onClick={handleOpen}
      >
        <Icon className="action-button-icon" style={{ marginRight: 8 }}>
          add
        </Icon>
        Features
      </TooltipButton>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        className={`mn-feature-modal ${theme}`}
        PaperProps={{
          className: `mn-feature-modal ${theme}`,
          style: { maxHeight: '90vh', height: '90vh' },
        }}
        onKeyDown={handleKeyDown}
      >
        <DialogContent ref={contentRef}>
          <h4>
            <div className="modal-header">
              <TextInput
                ref={inputRef}
                id="features-selector-search-input"
                className="mn-input"
                label="Search Features"
                placeholder="ex: cassandra"
                name="search"
                autoComplete="off"
                value={search}
                onChangeText={setSearch}
              />
            </div>
          </h4>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid size={12}>
              {searchResults.length === 0 && <p>No matching features</p>}
              {Object.keys(groupedResults).map((key) => {
                return (
                  <FeatureAvailableGroup
                    key={key}
                    category={key}
                    entities={groupedResults[key]}
                    toggleFeatures={toggleFeatures}
                  />
                )
              })}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={removeAll}>
            Remove All ({selectedFeatureKeys.length})
          </Button>
          <Button onClick={handleClose}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default FeatureSelectorModal
