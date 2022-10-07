import { Node } from '@tiptap/core'

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
  group: 'block',

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
  group: 'block',

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
})
