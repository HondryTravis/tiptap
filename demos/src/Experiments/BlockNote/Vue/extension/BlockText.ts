import { Node } from '@tiptap/core'

export const BlockText = Node.create({
  name: 'block_text',
  content: 'inline*',
  group: 'block',
  blockRole: 'block_text',
})
