const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Today's date in the visitor's local calendar as ISO yyyy-MM-dd. This is the
 * same shape Forge uses for `endOfSupport`, so the two compare as plain
 * strings without any time zone arithmetic.
 *
 * @param {Date} now
 * @return {String}
 */
export function todayIsoDate(now = new Date()) {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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
 * @param {String} today    ISO yyyy-MM-dd, defaults to the current local date
 * @return {Boolean}
 */
export function isSupported(endOfSupport, today = todayIsoDate()) {
  const date = normalizeEndOfSupport(endOfSupport)
  return date === null || date >= today
}

/**
 * Order version options so the supported ones come first and the unsupported
 * ones follow, keeping each run in its existing order. Options without a
 * `supported` flag are treated as supported. Returns a new array.
 *
 * @param {Array<Object>} options  Objects carrying a `supported` boolean
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
  return [...supported, ...unsupported]
}
