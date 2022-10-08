import { mergeAttributes, Node } from '@tiptap/core'
import { TextSelection } from 'prosemirror-state'

export interface ParagraphOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    paragraph: {
      /**
       * Toggle a paragraph
       */
      setParagraph: () => ReturnType,
    }
  }
}

function isParagraph(sel: any) {
  const layout = ['paragraph']
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

function hasBlockContent(sel: any) {
  const layout = ['block_content', 'block_layout_content']
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

export const Paragraph = Node.create<ParagraphOptions>({
  name: 'paragraph',

  priority: 1000,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      { tag: 'p' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setParagraph: () => ({ commands }) => {
        return commands.setNode(this.name)
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-0': () => this.editor.commands.setParagraph(),
      'Mod-a': () => {
        const { state, view } = this.editor
        const { selection } = state

        const hasBlock = isParagraph(selection)
        const inBlockContent = hasBlockContent(selection)
        const start = selection.$from.before(1)

        let upgrade = false

        if (hasBlock && !inBlockContent) {
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
