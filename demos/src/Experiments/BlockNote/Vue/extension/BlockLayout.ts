import { Node } from '@tiptap/core'

function isBlockLayout(sel: any) {
  const layout = ['block_layout_content', 'block_layout_container', 'block_layout']
  let { depth } = sel.$from

  while (depth) {
    const node = sel.$from.node(depth)

    if (layout.includes(node.type.name)) {
      return true
    }

    depth -= 1
  }
  return false
}

function getBlockLayoutRoot(sel: any) {
  const layout = ['block_layout']
  let { depth } = sel.$from

  while (depth) {
    const node = sel.$from.node(depth)

    if (layout.includes(node.type.name)) {
      return node
    }

    depth -= 1
  }
  return null
}

export const BlockLayout = Node.create({
  name: 'block_layout',
  isolating: true,
  group: 'block',

  content: 'block_layout_container',
  blockRole: 'block_layout',
  parseHTML() {
    return [
      {
        tag: 'div[data-description="block_layout"]',
      },
    ]
  },
  renderHTML() {
    const presets = {
      'data-description': this.name,
    }

    return ['div', { ...presets }, 0]
  },
})

export const BlockLayoutContainer = Node.create({
  name: 'block_layout_container',
  isolating: true,
  group: 'block_layout',

  content: 'block_layout_content+',
  blockRole: 'block_layout_container',
  parseHTML() {
    return [
      {
        tag: 'div[data-description="block_layout_container"]',
      },
    ]
  },
  renderHTML() {
    const presets = {
      'data-description': this.name,
    }

    return ['div', { ...presets }, 0]
  },
})

export const BlockLayoutContent = Node.create({
  name: 'block_layout_content',
  isolating: true,
  group: 'block_layout_container',

  content: 'block+',
  blockRole: 'block_content',
  parseHTML() {
    return [
      {
        tag: 'div[data-description="block_layout_content"]',
      },
    ]
  },
  renderHTML() {
    const presets = {
      'data-description': this.name,
    }

    return ['div', { ...presets }, 0]
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { state, view } = this.editor
        const { selection } = state

        if (isBlockLayout(selection)) {

          const root = getBlockLayoutRoot(selection)

          if (root && !root.textContent.length) {
            const start = selection.$from.before(1)

            view.dispatch(state.tr.deleteRange(start, start + root.nodeSize))
            return true
          }

        }

        return false
      },
    }
  },
})
