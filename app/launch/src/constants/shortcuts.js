import {
  KEY_CODE_A,
  KEY_CODE_D,
  KEY_CODE_ENTER,
  KEY_CODE_G,
  KEY_CODE_J,
  KEY_CODE_P,
  KEY_CODE_S,
  KEY_CODE_QUESTION,
  KEY_CODE_SHIFT,
  KEY_CODE_T,
  KEY_CODE_V,
} from '../constants/keyCodes'

const SHIFT_TEXT = 'SHIFT'

export const HELP_SHORTCUT = {
  label: 'Help',
  textValue: SHIFT_TEXT + '+ ?',
  keys: [KEY_CODE_SHIFT, KEY_CODE_QUESTION],
}

export const PREVIEW_SHORTCUT = {
  label: 'Preview',
  textValue: SHIFT_TEXT + ' + P',
  keys: [KEY_CODE_SHIFT, KEY_CODE_P],
}

export const DIFF_SHORTCUT = {
  label: 'Show Diff',
  textValue: SHIFT_TEXT + ' + D',
  keys: [KEY_CODE_SHIFT, KEY_CODE_D],
}

export const GENERATE_SHORTCUT = {
  label: 'Create a Zip',
  textValue: SHIFT_TEXT + ' + ⏎',
  keys: [KEY_CODE_SHIFT, KEY_CODE_ENTER],
}

export const NEXT_VERSION_SHORTCUT = {
  label: 'Toggle to the next Grails Version',
  textValue: SHIFT_TEXT + ' + V',
  keys: [KEY_CODE_SHIFT, KEY_CODE_V],
}

export const NEXT_APP_TYPE_SHORTCUT = {
  label: 'Toggle to the next Project Type',
  textValue: SHIFT_TEXT + ' + A',
  keys: [KEY_CODE_SHIFT, KEY_CODE_A],
}

export const NEXT_JDK_SHORTCUT = {
  label: 'Toggle to the next Java Version',
  textValue: SHIFT_TEXT + ' + J',
  keys: [KEY_CODE_SHIFT, KEY_CODE_J],
}

export const NEXT_GORM_SHORTCUT = {
  label: 'Toggle to the next GORM Implementation',
  textValue: SHIFT_TEXT + ' + G',
  keys: [KEY_CODE_SHIFT, KEY_CODE_G],
}

export const NEXT_SERVLET_SHORTCUT = {
  label: 'Toggle to the next Embedded Servlet Container',
  textValue: SHIFT_TEXT + ' + S',
  keys: [KEY_CODE_SHIFT, KEY_CODE_S],
}

export const NEXT_RELOADING_SHORTCUT = {
  label: 'Toggle to the next Development Reloading Option',
  textValue: SHIFT_TEXT + ' + T',
  keys: [KEY_CODE_SHIFT, KEY_CODE_T],
}

export const SHORTCUT_REGISTRY = [
  HELP_SHORTCUT,
  GENERATE_SHORTCUT,
  PREVIEW_SHORTCUT,
  DIFF_SHORTCUT,
  NEXT_VERSION_SHORTCUT,
  NEXT_GORM_SHORTCUT,
  NEXT_SERVLET_SHORTCUT,
  NEXT_APP_TYPE_SHORTCUT,
  NEXT_JDK_SHORTCUT,
  NEXT_RELOADING_SHORTCUT,
]
