// Feature relationship metadata from the Forge API:
// - dependentFeatures: features a selection adds automatically server-side
// - oneOfGroup: features sharing a group are mutually exclusive
// These helpers expand a selection so the UI can show implied features and
// disable cards whose selection would be rejected at generation time.

const byName = (availableFeatures) =>
  availableFeatures.reduce((map, f) => {
    map[f.name] = f
    return map
  }, {})

const transitiveDependents = (names, lookup) => {
  const seen = new Set(names)
  const queue = [...names]
  while (queue.length) {
    const feature = lookup[queue.shift()]
    ;(feature?.dependentFeatures || []).forEach((dep) => {
      if (!seen.has(dep)) {
        seen.add(dep)
        queue.push(dep)
      }
    })
  }
  return seen
}

// Map of implied-feature name -> title of the selected feature that implies it
// (features implied by the selection but not explicitly selected themselves).
export const impliedFeatures = (selectedFeatures, availableFeatures) => {
  const lookup = byName(availableFeatures)
  const implied = {}
  Object.keys(selectedFeatures).forEach((name) => {
    transitiveDependents([name], lookup).forEach((dep) => {
      if (dep !== name && !(dep in selectedFeatures) && lookup[dep]) {
        implied[dep] = lookup[name]?.title || name
      }
    })
  })
  return implied
}

// Map of oneOfGroup -> {name, title} of the effective (selected or implied)
// feature occupying it.
export const occupiedGroups = (selectedFeatures, availableFeatures) => {
  const lookup = byName(availableFeatures)
  const effective = transitiveDependents(Object.keys(selectedFeatures), lookup)
  const groups = {}
  effective.forEach((name) => {
    const feature = lookup[name]
    if (feature?.oneOfGroup) {
      groups[feature.oneOfGroup] = { name, title: feature.title }
    }
  })
  return groups
}

// The title of the effective feature that makes this card unselectable, or
// null when the card can be selected. A card conflicts when it - or anything
// it would add automatically - lands in a group occupied by another feature.
export const conflictingWith = (feature, groups, availableFeatures) => {
  const lookup = byName(availableFeatures)
  for (const name of transitiveDependents([feature.name], lookup)) {
    const group = lookup[name]?.oneOfGroup
    if (group && groups[group] && groups[group].name !== name) {
      return groups[group].title
    }
  }
  return null
}
