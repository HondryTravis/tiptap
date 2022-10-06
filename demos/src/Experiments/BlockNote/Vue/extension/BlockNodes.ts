import { Node } from '@tiptap/core'

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
        // const { state, view } = this.editor
        // const { selection } = state

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
