import { compareVersions } from './versionCompare'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Today's date as ISO yyyy-MM-dd in UTC. Forge reports `endOfSupport` as a
 * plain ISO date with no time zone, so it is read as a UTC date: every
 * visitor then sees a line end at the same moment rather than up to a day
 * apart depending on their local calendar, and the two compare as plain
 * strings without any time zone arithmetic.
 *
 * @param {Date} now
 * @return {String}
 */
export function todayIsoDate(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

/**
 * Normalise the `endOfSupport` value a Forge instance reports from /versions.
 * Forge omits the field when no date is configured, and instances built before
 * the field existed never send it, so absent, null and malformed values all
 * mean "unknown".
 *
 * @param {*} endOfSupport
 * @return {String|null}  ISO yyyy-MM-dd, or null when unknown
 */
export function normalizeEndOfSupport(endOfSupport) {
  if (typeof endOfSupport !== 'string') return null
  const trimmed = endOfSupport.trim()
  return ISO_DATE.test(trimmed) ? trimmed : null
}

/**
 * Whether a release line is still supported. `endOfSupport` is the last
 * supported day, so a line stays supported through that day inclusive.
 *
 * An unknown date counts as supported: we would rather miss flagging a line
 * than wrongly bury one below the divider.
 *
 * @param {*} endOfSupport  As reported by Forge
 * @param {String} today    ISO yyyy-MM-dd, defaults to the current UTC date
 * @return {Boolean}
 */
export function isSupported(endOfSupport, today = todayIsoDate()) {
  const date = normalizeEndOfSupport(endOfSupport)
  return date === null || date >= today
}

/**
 * Order unsupported options most recently ended first, so the line people
 * are most likely still on sits at the top of the group. Lines that ended on
 * the same day go newest version first.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Number}
 */
export function compareEndOfSupport(a, b) {
  const left = normalizeEndOfSupport(a?.endOfSupport) ?? ''
  const right = normalizeEndOfSupport(b?.endOfSupport) ?? ''
  if (left !== right) return left > right ? -1 : 1
  return compareVersions(b?.version, a?.version)
}

/**
 * Order version options so the supported ones come first, keeping their
 * existing order, and the unsupported ones follow, most recently ended first.
 * Options without a `supported` flag are treated as supported. Returns a new
 * array.
 *
 * @param {Array<Object>} options  Objects carrying `supported` and `endOfSupport`
 * @return {Array<Object>}
 */
export function orderBySupport(options) {
  const supported = []
  const unsupported = []
  for (const option of options) {
    if (option?.supported === false) {
      unsupported.push(option)
    } else {
      supported.push(option)
    }
  }
  return [...supported, ...unsupported.sort(compareEndOfSupport)]
}
