const NUMERIC = /^\d+$/

/**
 * Split a version into its numeric release parts and its prerelease
 * identifiers. Build metadata is discarded because it never affects precedence.
 *
 * @param {String} version  e.g. "7.1.7-SNAPSHOT"
 * @return {Object|null}    {numbers, prerelease}, or null when unparseable
 */
function parseVersion(version) {
  const text = String(version ?? '').trim()
  if (!text) return null

  const core = text.split('+')[0]
  const separator = core.indexOf('-')
  const release = separator === -1 ? core : core.slice(0, separator)
  const prerelease = separator === -1 ? '' : core.slice(separator + 1)

  const numbers = release.split('.')
  if (!numbers.every((part) => NUMERIC.test(part))) {
    return null
  }

  return {
    numbers: numbers.map(Number),
    prerelease: prerelease ? prerelease.split('.') : [],
  }
}

/**
 * Break an identifier into its alternating letter and digit runs so that
 * embedded numbers compare numerically: "M10" sorts after "M6" rather than
 * before it, which a plain string comparison would get wrong.
 *
 * @param {String} identifier
 * @return {Array<String>}
 */
function chunk(identifier) {
  return identifier.match(/\d+|\D+/g) ?? [identifier]
}

function compareNumbers(left, right) {
  const length = Math.max(left.length, right.length)
  for (let i = 0; i < length; i++) {
    // A missing part is an implied zero, so 7.1 and 7.1.0 are equal
    const diff = (left[i] ?? 0) - (right[i] ?? 0)
    if (diff !== 0) return diff < 0 ? -1 : 1
  }
  return 0
}

function compareIdentifier(left, right) {
  const leftChunks = chunk(left)
  const rightChunks = chunk(right)
  const length = Math.max(leftChunks.length, rightChunks.length)

  for (let i = 0; i < length; i++) {
    const a = leftChunks[i]
    const b = rightChunks[i]
    if (a === undefined) return -1
    if (b === undefined) return 1
    if (a === b) continue

    if (NUMERIC.test(a) && NUMERIC.test(b)) {
      return Number(a) < Number(b) ? -1 : 1
    }
    // Compare case insensitively so "m6" and "M6" land next to each other
    const insensitive = a.toUpperCase().localeCompare(b.toUpperCase())
    if (insensitive !== 0) return insensitive < 0 ? -1 : 1
    return a < b ? -1 : 1
  }
  return 0
}

function comparePrerelease(left, right) {
  // A release outranks any of its own prereleases: 8.0.0 is newer than 8.0.0-M6
  if (!left.length && !right.length) return 0
  if (!left.length) return 1
  if (!right.length) return -1

  const length = Math.max(left.length, right.length)
  for (let i = 0; i < length; i++) {
    const a = left[i]
    const b = right[i]
    if (a === undefined) return -1
    if (b === undefined) return 1

    const diff = compareIdentifier(a, b)
    if (diff !== 0) return diff
  }
  return 0
}

/**
 * Compare two Grails version strings oldest first, so a sorted list reads
 * 7.0.6, 7.1.6, 7.1.7-SNAPSHOT, 7.2.3, 7.2.4-SNAPSHOT, 8.0.0-M6, 8.0.0-SNAPSHOT.
 *
 * Versions that cannot be parsed sort last, keeping their relative order,
 * rather than scattering through the list.
 *
 * @param {String} a
 * @param {String} b
 * @return {Number}  negative, zero or positive, per Array#sort
 */
export function compareVersions(a, b) {
  const left = parseVersion(a)
  const right = parseVersion(b)

  if (!left && !right) return 0
  if (!left) return 1
  if (!right) return -1

  const numbers = compareNumbers(left.numbers, right.numbers)
  if (numbers !== 0) return numbers

  return comparePrerelease(left.prerelease, right.prerelease)
}

/**
 * Sort loaded version options oldest first. Returns a new array.
 *
 * @param {Array<Object>} options  Objects carrying a `version` string
 * @return {Array<Object>}
 */
export function sortByVersion(options) {
  return [...options].sort((a, b) => compareVersions(a?.version, b?.version))
}
