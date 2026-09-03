import { ACTIVITY_KEY, isDeepLinkReferral } from '../../helpers/Routing'
import { getStorageValue } from '../../hooks/useLocalStorage'
import { formResets } from './formResets'
import { initialValueGenerator, providedDefaults } from './providedDefaults'
import { StarterSDK } from './StarterSDK'

export const INITIAL_FORM_DATA_STORAGE_KEY = 'INITIAL_FORM_DATA'

const initialForm = (initialData) => {
  const { javaVersion, gorm, servlet, reloading, features } = initialData
  const parsed = {
    javaVersion: typeof javaVersion === 'string' ? javaVersion : '', // This is specifically "" to work with the SelectOption component
    servlet: typeof servlet === 'string' ? servlet : '',
    gorm: typeof gorm === 'string' ? gorm : '',
    reloading: typeof reloading === 'string' ? reloading : '',
    features: StarterSDK.reconstructFeatures(features),
    [ACTIVITY_KEY]: initialData[ACTIVITY_KEY],
  }
  return {
    ...parsed,
    ...formResets(initialData),
  }
}

function initialVersionResolver(query = {}) {
  const { version } = query
  return {
    // Non Form
    version: version ?? getStorageValue('SELECTED_MN_VERSION', null)?.version,
  }
}

function extractAccessoryData(query = {}) {
  const { debug, showing } = query
  return {
    // Code Preview Related Keys
    showing,

    // Dev Keys
    debug,
  }
}

export const initializeStateFactory =
  (initialData) =>
  (store) => {
    const query = providedDefaults()
    const isReferral = isDeepLinkReferral(query)
    const initialValueData = initialValueGenerator(
      INITIAL_FORM_DATA_STORAGE_KEY,
      initialForm(query),
      isReferral
    )
    const accessory = extractAccessoryData(query)
    const versionData = initialVersionResolver(query)
    const init = Object.assign(
      {},
      initialValueData,
      accessory,
      versionData,
      initialData
    )

    store.getState().setInitialValues(init)

    // Also set form fields from initial values
    const state = store.getState()
    if (init.name !== undefined) state.setName(init.name)
    if (init.package !== undefined) state.setPackage(init.package)
    if (init.type !== undefined) state.setAppType(init.type)
    if (init.javaVersion !== undefined) state.setJavaVersion(init.javaVersion)
    if (init.gorm !== undefined) state.setGorm(init.gorm)
    if (init.servlet !== undefined) state.setServlet(init.servlet)
    if (init.reloading !== undefined) state.setReloading(init.reloading)
    if (init.features !== undefined) state.setFeatures(init.features)
  }
