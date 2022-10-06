<template>
  <div class="blockNote">
    <h1> Block Note </h1>
    <div v-if="editor">
      <h2>
        编辑器 1
      </h2>
      <editor-content class="editor-1" :editor="editor" />

      <h2>
        编辑器 2
      </h2>
      <editor-content class="editor-2" :editor="anotherEditor" />
    </div>
  </div>
</template>

<script>
import Collaboration from '@tiptap/extension-collaboration'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Editor, EditorContent } from '@tiptap/vue-3'
import * as Y from 'yjs'

import {
  BlockContainer,
  BlockContent,
  BlockDescription,
} from './extension/BlockNodes'
import { Document } from './extension/Document'
import DragHandle from './extension/DragHandle.js'
import { Dropcursor } from './extension/Dropcursor'

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
      anotherEditor: null,
    }
  },

  mounted() {
    const ydoc = new Y.Doc()

    this.editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Dropcursor.configure({
          color: 'red',
          width: 2,
          class: undefined,
        }),
        Text,
        BlockContent,
        BlockContainer,
        BlockDescription,
        DragHandle,
        Collaboration.configure({
          document: ydoc,
        }),
      ],
      content: `
        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生</p>
        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生</p>
        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生</p>
        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生</p>
        <div data-description='block_description'>
          <div data-description='block_container'>
            <div data-description='block_content'>
              <p>测试的文本块测试的文本块测试的文本块测试的文本块1111</p>
            </div>
          </div>
        </div>
        <div data-description='block_description'>
          <div data-description='block_container'>
            <div data-description='block_content'>
              <p>测试的文本块测试的文本块测试的文本块测试的文本块22222</p>
            </div>
          </div>
        </div>
      `,
    })

    window.editor = this.editor

    this.anotherEditor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Dropcursor.configure({
          color: 'red',
          width: 2,
          class: undefined,
        }),
        Text,
        BlockContent,
        BlockContainer,
        BlockDescription,
        DragHandle,
        Collaboration.configure({
          document: ydoc,
        }),
      ],
    })
  },

  methods: { },

  beforeUnmount() {
    this.editor.destroy()
    this.anotherEditor.destroy()
  },
}
</script>

<style lang="scss">
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
}

.global-drag-handle {
  position: absolute;

  &::after {
    display: flex;
    align-items: center;
    justify-content: center;
    width: max-content;
    height: max-content;
    font-weight: bold;
    padding: 0 2px;
    content: '⠿';
  }

  &:hover {
    cursor: grab;
    background: #dddddd;
    border-radius: 4px;
  }
}

.blockNote {
  margin: 20px;
}

.ProseMirror-selectednode {
  background-color: #dddddd;
}
</style>
