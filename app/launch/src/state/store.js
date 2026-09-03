import { useCallback, useEffect, useMemo } from 'react'
import { create } from 'zustand'

import { sharableLink } from '../helpers/Routing'
import { setStorageValue } from '../hooks/useLocalStorage'
import { formResets } from './factories/formResets'
import { StarterSDK } from './factories/StarterSDK'
import { loadVersions } from './factories/versionLoader'

const INITIAL_FORM_DATA_STORAGE_KEY = 'INITIAL_FORM_DATA'

const versionLoader = loadVersions()

const optionsRequestKey = (state) => state.getBaseUrl()

const featuresRequestKey = (state) => JSON.stringify({
  baseUrl: state.getBaseUrl(),
  appType: state.appType,
  javaVersion: state.javaVersion,
  servlet: state.servlet,
  gorm: state.gorm,
  reloading: state.reloading,
})

// Main application store
export const useAppStore = create((set, get) => ({
  // Initial values
  initialValues: {},

  // Version state
  selectedVersion: null,
  availableVersions: [],

  // SDK
  sdkFactory: ({ baseUrl }) => new StarterSDK({ baseUrl }),

  // Form fields
  name: undefined,
  package: undefined,
  appType: undefined,
  reloading: undefined,
  lang: undefined,
  build: undefined,
  servlet: undefined,
  gorm: undefined,
  javaVersion: undefined,
  features: {},

  // Options (loaded from API)
  options: {},
  optionsLoading: false,
  optionsRequestId: 0,

  // Features
  availableFeatures: [],
  availableFeaturesLoading: false,
  availableFeaturesError: null,
  availableFeaturesRequestId: 0,
  defaultIncludedFeatures: [],
  defaultIncludedFeaturesLoading: false,
  defaultIncludedFeaturesRequestId: 0,

  // Actions
  setInitialValues: (values) => set({ initialValues: values }),
  setSelectedVersion: (version) => {
    setStorageValue('SELECTED_MN_VERSION', version)
    set({ selectedVersion: version })
  },
  setAvailableVersions: (versions) => set({ availableVersions: versions }),
  setSdkFactory: (factory) => set({ sdkFactory: factory }),
  setName: (nameOrFn) => {
    const s = get()
    const newVal = typeof nameOrFn === 'function' ? nameOrFn(s.name) : nameOrFn
    if (newVal !== s.name) set({ name: newVal })
  },
  setPackage: (pkgOrFn) => {
    const s = get()
    const newVal = typeof pkgOrFn === 'function' ? pkgOrFn(s.package) : pkgOrFn
    if (newVal !== s.package) set({ package: newVal })
  },
  setAppType: (valOrFn) => {
    const s = get()
    const newVal = typeof valOrFn === 'function' ? valOrFn(s.appType) : valOrFn
    if (newVal !== s.appType) set({ appType: newVal })
  },
  setReloading: (valOrFn) => {
    const s = get()
    const newVal = typeof valOrFn === 'function' ? valOrFn(s.reloading) : valOrFn
    if (newVal !== s.reloading) set({ reloading: newVal })
  },
  setLang: (valOrFn) => {
    const s = get()
    const newVal = typeof valOrFn === 'function' ? valOrFn(s.lang) : valOrFn
    if (newVal !== s.lang) set({ lang: newVal })
  },
  setBuild: (valOrFn) => {
    const s = get()
    const newVal = typeof valOrFn === 'function' ? valOrFn(s.build) : valOrFn
    if (newVal !== s.build) set({ build: newVal })
  },
  setServlet: (valOrFn) => {
    const s = get()
    const newVal = typeof valOrFn === 'function' ? valOrFn(s.servlet) : valOrFn
    if (newVal !== s.servlet) set({ servlet: newVal })
  },
  setGorm: (valOrFn) => {
    const s = get()
    const newVal = typeof valOrFn === 'function' ? valOrFn(s.gorm) : valOrFn
    if (newVal !== s.gorm) set({ gorm: newVal })
  },
  setJavaVersion: (valOrFn) => {
    const s = get()
    const newVal = typeof valOrFn === 'function' ? valOrFn(s.javaVersion) : valOrFn
    if (newVal !== s.javaVersion) set({ javaVersion: newVal })
  },
  setFeatures: (features) => set({ features: typeof features === 'function' ? features(get().features) : features }),
  setOptions: (options) => set({ options }),
  setOptionsLoading: (loading) => set({ optionsLoading: loading }),

  // Computed getters
  getBaseUrl: () => get().selectedVersion?.api,
  getSdk: () => {
    const baseUrl = get().selectedVersion?.api
    if (!baseUrl) return null
    return get().sdkFactory({ baseUrl })
  },
  getStarterForm: () => {
    const { appType, name, package: pkg, servlet, gorm, reloading, javaVersion, features } = get()
    return setStorageValue(INITIAL_FORM_DATA_STORAGE_KEY, {
      type: appType,
      name,
      package: pkg,
      javaVersion,
      gorm,
      servlet,
      reloading,
      features,
    })
  },
  getCreateCommand: () => {
    const form = get().getStarterForm()
    const baseUrl = get().getBaseUrl()
    return StarterSDK.createCommand(form, baseUrl)
  },
  getSharableLink: () => {
    const form = get().getStarterForm()
    const selectedVersion = get().selectedVersion
    return sharableLink(form, selectedVersion?.version)
  },

  // Async actions
  loadOptions: async () => {
    const sdk = get().getSdk()
    if (!sdk) return
    const requestId = get().optionsRequestId + 1
    const requestKey = optionsRequestKey(get())
    set({ optionsLoading: true, optionsRequestId: requestId })
    try {
      const options = await sdk.selectOptions()
      if (get().optionsRequestId === requestId && optionsRequestKey(get()) === requestKey) {
        set({ options, optionsLoading: false })
      }
    } catch {
      if (get().optionsRequestId === requestId && optionsRequestKey(get()) === requestKey) {
        set({ optionsLoading: false })
      }
    }
  },
  loadAvailableFeatures: async () => {
    const sdk = get().getSdk()
    const appType = get().appType
    const form = get().getStarterForm()
    if (!sdk || !appType) {
      set({ availableFeatures: [], availableFeaturesLoading: false })
      return
    }
    const requestId = get().availableFeaturesRequestId + 1
    const requestKey = featuresRequestKey(get())
    set({
      availableFeaturesLoading: true,
      availableFeaturesError: null,
      availableFeaturesRequestId: requestId,
    })
    try {
      const { features } = await sdk.features({ type: appType, form })
      if (get().availableFeaturesRequestId === requestId && featuresRequestKey(get()) === requestKey) {
        set({ availableFeatures: features, availableFeaturesLoading: false })
      }
    } catch (error) {
      if (get().availableFeaturesRequestId === requestId && featuresRequestKey(get()) === requestKey) {
        set({ availableFeatures: [], availableFeaturesLoading: false, availableFeaturesError: error })
      }
    }
  },
  loadDefaultIncludedFeatures: async () => {
    const sdk = get().getSdk()
    const appType = get().appType
    const form = get().getStarterForm()
    if (!sdk || !appType) {
      set({ defaultIncludedFeatures: [] })
      return
    }
    const requestId = get().defaultIncludedFeaturesRequestId + 1
    const requestKey = featuresRequestKey(get())
    set({
      defaultIncludedFeaturesLoading: true,
      defaultIncludedFeaturesRequestId: requestId,
    })
    try {
      const { features } = await sdk.defaultIncludedFeatures({ type: appType, form })
      if (get().defaultIncludedFeaturesRequestId === requestId && featuresRequestKey(get()) === requestKey) {
        set({ defaultIncludedFeatures: features, defaultIncludedFeaturesLoading: false })
      }
    } catch {
      if (get().defaultIncludedFeaturesRequestId === requestId && featuresRequestKey(get()) === requestKey) {
        set({ defaultIncludedFeatures: [], defaultIncludedFeaturesLoading: false })
      }
    }
  },
  resetForm: async () => {
    let options = get().options
    if (!options.type) {
      await get().loadOptions()
      options = get().options
    }
    const state = get()
    const appType = options.type?.defaultOption?.value ?? state.appType
    if (!appType) return
    const optionDefault = (key, fallback) =>
      options[key]?.defaultOption?.value ?? fallback

    const resets = formResets({})
    set({
      name: resets.name,
      package: resets.package,
      appType,
      servlet: optionDefault('servlet', state.servlet),
      gorm: optionDefault('gorm', state.gorm),
      reloading: optionDefault('reloading', state.reloading),
      javaVersion: optionDefault('jdkVersion', state.javaVersion),
      features: {},
    })
  },
}))

// Initialize the store with version data
versionLoader.then((versions) => {
  useAppStore.getState().setAvailableVersions(versions)
}).catch(() => {})

//----------------------
// State Hooks
//---------------------
const useDerivedDefultsEffect = (select, setter) => {
  useEffect(() => {
    if (!select) return
    const { defaultOption, options } = select
    setter((value) => {
      if (!value) return defaultOption.value
      const idx = options.findIndex((v) => v.value === value)
      if (idx < 0) return defaultOption.value
      return value
    })
  }, [select]) // eslint-disable-line react-hooks/exhaustive-deps
}

export function useCurrenSdk() {
  const baseUrl = useAppStore((s) => s.selectedVersion?.api)
  const sdkFactory = useAppStore((s) => s.sdkFactory)
  return useMemo(() => {
    if (!baseUrl) return null
    return sdkFactory({ baseUrl })
  }, [baseUrl, sdkFactory])
}

export function useInitialData() {
  return useAppStore((s) => s.initialValues)
}

export function useSharableLink() {
  const selectedVersion = useAppStore((s) => s.selectedVersion)
  const appType = useAppStore((s) => s.appType)
  const name = useAppStore((s) => s.name)
  const pkg = useAppStore((s) => s.package)
  const servlet = useAppStore((s) => s.servlet)
  const gorm = useAppStore((s) => s.gorm)
  const reloading = useAppStore((s) => s.reloading)
  const javaVersion = useAppStore((s) => s.javaVersion)
  const features = useAppStore((s) => s.features)
  return useMemo(() => {
    const form = setStorageValue(INITIAL_FORM_DATA_STORAGE_KEY, {
      type: appType, name, package: pkg, javaVersion, gorm, servlet, reloading, features,
    })
    return sharableLink(form, selectedVersion?.version)
  }, [selectedVersion, appType, name, pkg, servlet, gorm, reloading, javaVersion, features])
}

export function useAvailableVersions() {
  return useAppStore((s) => s.availableVersions)
}

export function useAvailableFeatures() {
  const features = useAppStore((s) => s.availableFeatures)
  const loading = useAppStore((s) => s.availableFeaturesLoading)
  const error = useAppStore((s) => s.availableFeaturesError)
  return { features, loading, error }
}

export function useDefaultIncludedFeatures() {
  const features = useAppStore((s) => s.defaultIncludedFeatures)
  const loading = useAppStore((s) => s.defaultIncludedFeaturesLoading)
  return { features, loading, error: null }
}

const DEFAULT_VERSION_KEY = 'RELEASE'

/**
 * Which option to preselect when the visitor did not ask for a version.
 *
 * Options are ordered oldest first, so position 0 is the oldest supported
 * release rather than the one to default to. Preselect the feed's RELEASE
 * channel — the current stable line — and only fall back to position 0 if the
 * feed has no such entry.
 *
 * @param {Array<Object>} options
 * @return {Number}
 */
function defaultVersionIndex(options) {
  const idx = options.findIndex((opt) => opt.key === DEFAULT_VERSION_KEY)
  return idx < 0 ? 0 : idx
}

export function useSelectedVersions() {
  const value = useAppStore((s) => s.selectedVersion)
  const setter = useAppStore((s) => s.setSelectedVersion)
  const defaultVersion = useAppStore((s) => s.initialValues.version)
  const options = useAvailableVersions()
  useEffect(() => {
    if (!value && options?.length) {
      const idx = options.findIndex((opt) => opt.version === defaultVersion)
      setter(options[idx < 0 ? defaultVersionIndex(options) : idx])
    }
  }, [value, setter, options, defaultVersion])
  return [value, setter, options]
}

export function useConfigureInitialVersionEffect(onError) {
  const value = useAppStore((s) => s.selectedVersion)
  const setter = useAppStore((s) => s.setSelectedVersion)
  const options = useAvailableVersions()
  const defaultVersion = useAppStore((s) => s.initialValues.version)

  return useEffect(() => {
    if (!value && options?.length) {
      const idx = options.findIndex((opt) => opt.version === defaultVersion)
      const fallback = defaultVersionIndex(options)
      if (defaultVersion && idx < 0) {
        onError({ requested: defaultVersion, using: options[fallback].version })
      }
      setter(options[idx < 0 ? fallback : idx])
    }
  }, [value, setter, options, onError, defaultVersion])
}

export function useSelectedFeatures() {
  const value = useAppStore((s) => s.features)
  const setter = useAppStore((s) => s.setFeatures)
  const { features, loading } = useAvailableFeatures()
  return [value, setter, features, loading]
}

export function useSelectedFeaturesValue() {
  return useAppStore((s) => s.features)
}

export function useDefaultIncludedFeaturesValue() {
  return useAppStore((s) => s.defaultIncludedFeatures)
}

export function useSelectedFeaturesHandlers() {
  const setFeatures = useAppStore((s) => s.setFeatures)
  return useMemo(() => {
    const onAddFeature = (feature) => {
      setFeatures((draft) => {
        return { ...draft, [feature.name]: feature }
      })
    }

    const onRemoveFeature = (feature) => {
      setFeatures((draft) => {
        const next = { ...draft }
        delete next[feature.name]
        return next
      })
    }

    const onRemoveAllFeatures = () => {
      setFeatures({})
    }
    return { onAddFeature, onRemoveFeature, onRemoveAllFeatures }
  }, [setFeatures])
}

export const useAppName = () => {
  const value = useAppStore((s) => s.name)
  const setter = useAppStore((s) => s.setName)
  return [value, setter]
}

export const useAppPackage = () => {
  const value = useAppStore((s) => s.package)
  const setter = useAppStore((s) => s.setPackage)
  return [value, setter]
}

const useSelectOptionsForType = (key) => {
  const options = useAppStore((s) => s.options)
  return options[key] || null
}

export const useApplicationType = () => {
  const value = useAppStore((s) => s.appType)
  const setter = useAppStore((s) => s.setAppType)
  const select = useSelectOptionsForType('type')
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useReloadingFramework = () => {
  const value = useAppStore((s) => s.reloading)
  const setter = useAppStore((s) => s.setReloading)
  const defaultSelect = {
    "options": [
      {
        "name": "devtools",
        "description": "Spring Dev Tools",
        "value": "DEVTOOLS",
        "label": "Spring Boot Dev Tools"
      }
    ],
    "defaultOption": {
      "name": "devtools",
      "description": "Spring Dev Tools",
      "value": "DEVTOOLS",
      "label": "Spring Boot Dev Tools"
    }
  }
  const select = useSelectOptionsForType('reloading') ?? defaultSelect
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useLanguage = () => {
  const value = useAppStore((s) => s.lang)
  const setter = useAppStore((s) => s.setLang)
  const select = useSelectOptionsForType('lang')
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useBuild = () => {
  const value = useAppStore((s) => s.build)
  const setter = useAppStore((s) => s.setBuild)
  const select = useSelectOptionsForType('build')
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useServlet = () => {
  const value = useAppStore((s) => s.servlet)
  const setter = useAppStore((s) => s.setServlet)
  const select = useSelectOptionsForType('servlet')
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useGorm = () => {
  const value = useAppStore((s) => s.gorm)
  const setter = useAppStore((s) => s.setGorm)
  const select = useSelectOptionsForType('gorm')
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useJavaVersion = () => {
  const value = useAppStore((s) => s.javaVersion)
  const setter = useAppStore((s) => s.setJavaVersion)
  const select = useSelectOptionsForType('jdkVersion')
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useStarterForm = () => {
  const appType = useAppStore((s) => s.appType)
  const name = useAppStore((s) => s.name)
  const pkg = useAppStore((s) => s.package)
  const servlet = useAppStore((s) => s.servlet)
  const gorm = useAppStore((s) => s.gorm)
  const reloading = useAppStore((s) => s.reloading)
  const javaVersion = useAppStore((s) => s.javaVersion)
  const features = useAppStore((s) => s.features)
  return useMemo(() => {
    return setStorageValue(INITIAL_FORM_DATA_STORAGE_KEY, {
      type: appType, name, package: pkg, javaVersion, gorm, servlet, reloading, features,
    })
  }, [appType, name, pkg, javaVersion, gorm, servlet, reloading, features])
}

export const useCreateCommand = () => {
  const form = useStarterForm()
  const baseUrl = useAppStore((s) => s.selectedVersion?.api)
  return useMemo(() => StarterSDK.createCommand(form, baseUrl), [form, baseUrl])
}

export const useGetStarterForm = () => {
  return async () => {
    const state = useAppStore.getState()
    const createPayload = state.getStarterForm()
    const sdk = state.getSdk()
    return { createPayload, sdk }
  }
}

export const useResetStarterForm = () => {
  return useCallback(() => useAppStore.getState().resetForm(), [])
}

// Load options when version changes
export function useLoadOptionsEffect() {
  const selectedVersion = useAppStore((s) => s.selectedVersion)
  const loadOptions = useAppStore((s) => s.loadOptions)
  useEffect(() => {
    if (selectedVersion?.api) {
      loadOptions()
    }
  }, [selectedVersion, loadOptions])
}

// Load features when app type or form changes
export function useLoadFeaturesEffect() {
  const appType = useAppStore((s) => s.appType)
  const selectedVersion = useAppStore((s) => s.selectedVersion)
  const javaVersion = useAppStore((s) => s.javaVersion)
  const servlet = useAppStore((s) => s.servlet)
  const gorm = useAppStore((s) => s.gorm)
  const reloading = useAppStore((s) => s.reloading)
  const loadAvailableFeatures = useAppStore((s) => s.loadAvailableFeatures)
  const loadDefaultIncludedFeatures = useAppStore((s) => s.loadDefaultIncludedFeatures)
  useEffect(() => {
    if (appType && selectedVersion) {
      loadAvailableFeatures()
      loadDefaultIncludedFeatures()
    }
  }, [
    appType,
    selectedVersion,
    javaVersion,
    servlet,
    gorm,
    reloading,
    loadAvailableFeatures,
    loadDefaultIncludedFeatures,
  ])
}
