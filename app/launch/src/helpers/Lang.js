import _ from 'lodash'
import messages from '../constants/messages.json'

const INTERPOLATE = /{{([\s\S]+?)}}/g

class LangApi {
  constructor() {
    this._cache_data = {}
  }

  /**
   * Look up a message by key and fill in any `{{name}}` placeholders from
   * `sub`. An unknown key falls back to the key itself.
   *
   * @param {String} message  key into messages.json
   * @param {Object} sub      substitutions, optional
   * @return {String}
   */
  trans(message, sub = {}) {
    const template = this._template(message)
    // If there are no opts passed in we can skip interpolation
    if (_.isEmpty(sub)) return template
    return _.template(template, { interpolate: INTERPOLATE })(sub)
  }

  /**
   * The raw message text for a key. The cache holds the template rather than
   * an interpolated result, so a key can be used with and without
   * substitutions in any order.
   *
   * @param {String} key
   * @return {String}
   */
  _template(key) {
    if (this._cache_data[key] === undefined) {
      this._cache_data[key] = _.get(messages, key, key)
    }
    return this._cache_data[key]
  }
}

const langApi = new LangApi()
export default langApi
