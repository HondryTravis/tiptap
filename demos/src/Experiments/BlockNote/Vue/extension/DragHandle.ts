import { Extension } from '@tiptap/core'
import { NodeSelection, Plugin } from 'prosemirror-state'
// @ts-ignore
import { __serializeForClipboard as serializeForClipboard, EditorView } from 'prosemirror-view'

function removeNode(node: HTMLElement) {
  node.parentNode?.removeChild(node)
}

function absoluteRect(node: HTMLElement) {
  const data = node.getBoundingClientRect()

  return {
    top: data.top,
    left: data.left,
    width: data.width,
  }
}

export default Extension.create({
  addProseMirrorPlugins() {
    function blockPosAtCoords(coords: { left: number, top: number}, view: EditorView) {
      const pos = view.posAtCoords(coords)

      if (!pos) {
        return null
      }

      let { node } = view.domAtPos(pos.pos)

      while (node && node.parentNode) {
        const current = node.parentNode as HTMLElement

        if (current?.classList?.contains('ProseMirror')) { // todo
          break
        }

        node = current
      }

      if (node && node.nodeType === 1) {
        const docView = (view as any).docView
        const desc = docView.nearestDesc(node, true)

        if (!(!desc || desc === docView)) {
          return desc.posBefore
        }
      }
      return null
    }

    function dragStart(e: any, view: EditorView) {

      Reflect.set(view, 'composing', true)

      if (!e.dataTransfer) {
        return
      }

      const coords = { left: e.clientX + 50, top: e.clientY }
      const pos = blockPosAtCoords(coords, view)

      if (pos != null) {
        view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, pos)))

        const slice = view.state.selection.content()

        // console.log({
        //   from: view.nodeDOM(view.state.selection.from),
        //   to: view.nodeDOM(view.state.selection.to),
        // })
        const { dom, text } = serializeForClipboard(view, slice)

        e.dataTransfer.clearData()
        e.dataTransfer.setData('text/html', dom.innerHTML)
        e.dataTransfer.setData('text/plain', text)

        const el = document.querySelector('.ProseMirror-selectednode')

        e.dataTransfer?.setDragImage(el, 0, 0)
        view.dragging = { slice, move: true }
      }
    }

    let dropElement: HTMLElement | null
    const WIDTH = 20

    return [
      new Plugin({
        view(editorView) {
          const element = document.createElement('div')

          element.draggable = true
          element.classList.add('global-drag-handle')
          element.addEventListener('dragstart', e => dragStart(e, editorView))
          dropElement = element
          document.body.appendChild(dropElement)

          return {
            // update(view, prevState) {
            // },
            destroy() {
              if (dropElement) {
                removeNode(dropElement)
              }
              dropElement = null
            },
          }
        },
        props: {
          handleDrop(view, event, slice, moved) {
            console.warn(moved, slice, event)
            if (moved) {
              // setTimeout(() => {
              //   console.log('remove selection')
              //   view.dispatch(view.state.tr.deleteSelection())
              // }, 50)
            }
          },
          // handlePaste() {
          //   alert(2)
          // },
          handleDOMEvents: {
            // drop(view, event) {
            //   setTimeout(() => {
            //     const node = document.querySelector('.ProseMirror-hideselection')
            //     if (node) {
            //       node.classList.remove('ProseMirror-hideselection')
            //     }
            //   }, 50)
            // },
            mousemove(view, event) {
              const coords = {
                left: event.clientX + WIDTH + 50,
                top: event.clientY,
              }
              const pos = view.posAtCoords(coords)

              if (!pos) {
                return false
              }

              let node = view.domAtPos(pos?.pos).node

              if (node) {

                while (node && node.parentNode) {
                  const current = node.parentNode as HTMLElement

                  if (current.classList?.contains('ProseMirror')) { // todo
                    break
                  }

                  node = current
                }

                if (node instanceof HTMLElement) {
                  const cstyle = window.getComputedStyle(node)
                  const lineHeight = parseInt(cstyle.lineHeight, 10)
                  // const top = parseInt(cstyle.marginTop, 10) + parseInt(cstyle.paddingTop, 10)
                  const top = 0
                  const rect = absoluteRect(node)
                  const win = node.ownerDocument.defaultView || window

                  rect.top += win.pageYOffset + ((lineHeight - 24) / 2) + top
                  rect.left += win.pageXOffset
                  rect.width = WIDTH

                  if (dropElement) {
                    dropElement.style.left = `${-rect.width + rect.left}px`
                    dropElement.style.top = `${rect.top}px`
                  }
                }
              }
            },
          },
        },
      }),
    ]
  },
})
