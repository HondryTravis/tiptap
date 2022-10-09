<template>
  <div class="blockNote">
    <h1> Block Note </h1>
    <div v-if="editor">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        bold
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        italic
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        strike
      </button>
    </div>
    <div class="demoEditor" v-if="editor">
      <div>
        <h2>
          编辑器 1
        </h2>
        <editor-content class="editor-1" :editor="editor" />
      </div>

      <div>
        <h2>
          编辑器 2
        </h2>
        <editor-content class="editor-2" :editor="anotherEditor" />
      </div>
    </div>
  </div>
</template>

<script>
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Gapcursor from '@tiptap/extension-gapcursor'
import HardBreak from '@tiptap/extension-hard-break'
import Italic from '@tiptap/extension-italic'
import ListItem from '@tiptap/extension-list-item'
import Strike from '@tiptap/extension-strike'
import Text from '@tiptap/extension-text'
import { Editor, EditorContent } from '@tiptap/vue-3'
import * as Y from 'yjs'

import {
  BlockLayout,
  BlockLayoutContainer,
  BlockLayoutContent,
} from './extension/BlockLayout'
import {
  BlockContainer,
  BlockContent,
  BlockDescription,
} from './extension/BlockNodes'
import { Collaboration } from './extension/Collaboration'
import { Document } from './extension/Document'
import DragHandle from './extension/DragHandle'
import { Dropcursor } from './extension/Dropcursor'
import { Paragraph } from './extension/Paragraph'

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
        HardBreak,
        Gapcursor,
        Dropcursor.configure({
          color: 'red',
          width: 2,
          class: undefined,
        }),
        Text,
        ListItem,
        BulletList,
        BlockContent,
        BlockContainer,
        BlockDescription,
        BlockLayout,
        BlockLayoutContainer,
        BlockLayoutContent,
        Bold,
        Italic,
        Strike,
        DragHandle,
        Collaboration.configure({
          document: ydoc,
        }),
      ],
      content: `
        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生1</p>
        <div data-description='block_description'>
          <div data-description='block_container'>
            <div data-description='block_content'>
              <p>[编辑器块文本]: 测试的文本块测试的文本块测试的文本块测试的文本块1111</p>
            </div>
          </div>
        </div>
        <div data-description='block_description'>
          <div data-description='block_container'>
            <div data-description='block_content'>
              <p>[编辑器块文本]: 测试的文本块测试的文本块测试的文本块测试的文本块22222</p>
            </div>
          </div>
        </div>
        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生2</p>
        <div data-description="block_layout">
          <div data-description="block_layout_container">
            <div data-description="block_layout_content">
              <p>我是布局文本块 1</p>
            </div>
            <div data-description="block_layout_content">
              <p>我是布局文本块 2</p>
            </div>
          </div>
        </div>
        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生3</p>
        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生4</p>
        <ul>
          <li>烦啥时刻久啊说法的1</li>
          <li>烦啥时刻久啊说法的2</li>
          <li>烦啥时刻久啊说法的3</li>
          <li>烦啥时刻久啊说法的4</li>
        </ul>
        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生1</p>
        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生2</p>

        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生3</p>
        <p>发的还是机卡师傅阿卡设计费阿萨德爱迪生4</p>
      `,
    })

    window.editor = this.editor

    this.anotherEditor = new Editor({
      extensions: [
        Document,
        Paragraph,
        HardBreak,
        Gapcursor,
        Dropcursor.configure({
          color: 'red',
          width: 2,
          class: undefined,
        }),
        Text,
        ListItem,
        BulletList,
        BlockContent,
        BlockContainer,
        BlockDescription,
        BlockLayout,
        BlockLayoutContainer,
        BlockLayoutContent,
        DragHandle,
        Bold,
        Italic,
        Strike,
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

div[data-description='block_layout_container'] {
  display: flex;

  & > div[data-description='block_layout_content'] {
    margin: 0 10px;
    padding: 10px;
    flex: 1;
  }

  &:hover div[data-description='block_layout_content']{
    background: #dddddd;
    border-radius: 5px;
  }
}

.demoEditor {
  display: flex;

  & > div {
    margin: 10px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid black;
    min-width: 50%;
  }
}

</style>
