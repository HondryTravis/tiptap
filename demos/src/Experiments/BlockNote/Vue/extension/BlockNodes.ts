import { Node } from '@tiptap/core'
import { TextSelection } from 'prosemirror-state'

function isBlockNode(sel: any) {
  const layout = ['block_description']
  let { depth } = sel.$from

  while (depth) {
    const node = sel.$from.node(depth)

    if (layout.includes(node.type.name)) {
      return node
    }

    depth -= 1
  }
  return false
}

export const BlockDescription = Node.create({
  name: 'block_description',
  isolating: true,
  group: 'block',

  content: 'block_container',
  blockRole: 'block_description',
  parseHTML() {
    return [
      {
        tag: 'div[data-description="block_description"]',
      },
    ]
  },
  renderHTML() {
    return ['div', { 'data-description': this.name }, 0]
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state, view } = this.editor
        const { selection } = state

        const hasBlock = isBlockNode(selection)

        const start = selection.$from.before(1)

        if (hasBlock) {
          const nextPos = start + hasBlock.nodeSize

          const node = this.editor.schema.nodes.block_description.createAndFill()

          if (node) {
            view.dispatch(state.tr.insert(nextPos, node))
            const textSel = TextSelection.create(state.tr.doc, nextPos)

            view.dispatch(state.tr.setSelection(textSel))
          }
          return true
        }

        return false
      },

      Backspace: () => {
        const { state, view } = this.editor
        const { selection } = state

        const hasBlock = isBlockNode(selection)
        const start = selection.$from.before(1)

        let upgrade = false

        if (hasBlock && !hasBlock.textContent.length) {
          view.dispatch(state.tr.deleteRange(start, start + hasBlock.nodeSize))

          upgrade = true

        }

        if (upgrade) {
          return upgrade
        }

        return false
      },

      'Mod-a': () => {
        const { state, view } = this.editor
        const { selection } = state

        const hasBlock = isBlockNode(selection)
        const start = selection.$from.before(1)

        let upgrade = false

        if (hasBlock) {
          upgrade = true
          const textSel = TextSelection.create(state.tr.doc, start, start + hasBlock.nodeSize)

          view.dispatch(state.tr.setSelection(textSel))
        }

        if (upgrade) {
          return upgrade
        }

        return false
      },
    }
  },

})

export const BlockContainer = Node.create({
  name: 'block_container',
  isolating: true,
  group: 'block',

  content: 'block_content',
  blockRole: 'block_container',
  parseHTML() {
    return [
      {
        tag: 'div[data-description="block_container"]',
      },
    ]
  },
  renderHTML() {
    return ['div', { 'data-description': this.name }, 0]
  },
})

export const BlockContent = Node.create({
  name: 'block_content',
  isolating: true,
  group: 'block',

  content: 'paragraph',
  blockRole: 'block_content',
  parseHTML() {
    return [
      {
        tag: 'div[data-description="block_content"]',
      },
    ]
  },
  renderHTML() {
    return ['div', { 'data-description': this.name }, 0]
  },
})
