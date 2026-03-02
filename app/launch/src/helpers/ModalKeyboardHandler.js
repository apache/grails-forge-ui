const DEFAULT_HEADER_HEIGHT = 100

const FN_NEXT_PAGE = (node, { headerHeight = DEFAULT_HEADER_HEIGHT }) => {
  node.scrollTop += node.clientHeight - headerHeight
}

const FN_PREV_PAGE = (node, { headerHeight = DEFAULT_HEADER_HEIGHT }) => {
  node.scrollTop -= node.clientHeight - headerHeight
}

const FN_JUMP_TO_NEXT_GROUP = (
  node,
  { sectionKey = 'modal-group', headerHeight = DEFAULT_HEADER_HEIGHT }
) => {
  const groups = [...node.getElementsByClassName(sectionKey)]
  if (!groups.length) {
    return (node.scrollTop += headerHeight)
  }
  const next = groups.filter((a) => a.offsetTop > node.scrollTop + headerHeight)
  if (!next.length) return
  const group = next[0]
  node.scrollTop = group.offsetTop - headerHeight
}

const FN_JUMP_TO_PREV_GROUP = (
  node,
  { sectionKey = 'modal-group', headerHeight = DEFAULT_HEADER_HEIGHT }
) => {
  const groups = [...node.getElementsByClassName(sectionKey)]
  if (!groups.length) {
    node.scrollTop -= headerHeight
    return
  }
  const next = groups.filter((a) => a.offsetTop < node.scrollTop + headerHeight)
  if (!next.length) {
    return
  }
  const group = next[next.length - 1]
  node.scrollTop = group.offsetTop - headerHeight
}

const KEY_ACTIONS = {
  ArrowUp: -50,
  ArrowDown: 50,
  ArrowRight: FN_JUMP_TO_NEXT_GROUP,
  ArrowLeft: FN_JUMP_TO_PREV_GROUP,
  PageUp: FN_PREV_PAGE,
  PageDown: FN_NEXT_PAGE,
}

export class ModalKeyboardHandler {
  constructor(
    config = {
      sectionKey: 'modal-group',
      headerHeight: DEFAULT_HEADER_HEIGHT,
    }
  ) {
    if (!(config instanceof Object)) {
      throw Error('ModalKeyboardHandler must be created with a config object')
    }
    this.config = config
  }

  /**
   * Returns an onKeyDown handler for use on a scrollable container or its parent.
   * @param {function} getScrollNode - function returning the scrollable DOM node
   * @returns {function} event handler
   */
  createKeyDownHandler(getScrollNode) {
    return (e) => {
      const action = KEY_ACTIONS[e.key]
      if (!action) return

      // Don't hijack keys when focus is inside an editable element
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const node = typeof getScrollNode === 'function' ? getScrollNode() : null
      if (!node) return

      e.preventDefault()

      if (typeof action === 'function') {
        action(node, this.config)
      } else {
        node.scrollTop += action
      }
    }
  }
}
