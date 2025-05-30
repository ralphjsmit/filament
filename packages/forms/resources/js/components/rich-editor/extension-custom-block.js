import { mergeAttributes, Node } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export default Node.create({
    name: 'customBlock',

    priority: 101,

    group: 'block',

    atom: true,

    defining: true,

    draggable: true,

    selectable: true,

    isolating: true,

    allowGapCursor: true,

    inline: false,

    addNodeView() {
        return ({ editor, node, getPos, HTMLAttributes, decorations, extension }) => {
            const dom = document.createElement('custom-block')
            dom.setAttribute('data-config', node.attrs.config)
            dom.setAttribute('data-id', node.attrs.id)

            const header = document.createElement('div')
            header.className = 'fi-fo-rich-editor-custom-block-header fi-not-prose'
            dom.appendChild(header)

            const buttonContainer = document.createElement('div')
            buttonContainer.className = 'fi-fo-rich-editor-custom-block-edit-btn-ctn'
            header.appendChild(buttonContainer)

            const button = document.createElement('button')
            button.className = 'fi-icon-btn'
            button.type = 'button'
            button.innerHTML = extension.options.editCustomBlockButtonIconHtml
            button.addEventListener('click', () => extension.options.editCustomBlockUsing(node.attrs.id, node.attrs.config))
            buttonContainer.appendChild(button)

            const heading = document.createElement('p')
            heading.className = 'fi-fo-rich-editor-custom-block-heading'
            heading.textContent = node.attrs.label
            header.appendChild(heading)

            const preview = document.createElement('div')
            preview.className = 'fi-fo-rich-editor-custom-block-preview fi-not-prose'
            preview.innerHTML = atob(node.attrs.preview)
            dom.appendChild(preview)

            return {
                dom,
            }
        }
    },

    addOptions: function () {
        return {
            editCustomBlockButtonIconHtml: null,
            editCustomBlockUsing: () => {},
            insertCustomBlockUsing: () => {},
        }
    },

    addAttributes: function () {
        return {
            config: {
                default: null,
                parseHTML: (element) => JSON.parse(element.getAttribute('data-config')),
            },

            id: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-id'),
            },

            label: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-label'),
            },

            preview: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-preview'),
            },
        }
    },

    parseHTML: function () {
        return [
            {
                tag: 'custom-block',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['custom-block', mergeAttributes(HTMLAttributes)]
    },

    addKeyboardShortcuts: function () {
        return {
            Backspace: () =>
                this.editor.commands.command(({ tr, state }) => {
                    let isCustomBlock = false
                    const { selection } = state
                    const { empty, anchor } = selection

                    if (!empty) {
                        return false
                    }

                    // Store node and position for later use
                    let customBlockNode = new ProseMirrorNode()
                    let customBlockPos = 0

                    state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
                        if (node.type.name === this.name) {
                            isCustomBlock = true
                            customBlockNode = node
                            customBlockPos = pos
                            return false
                        }
                    })

                    return isCustomBlock
                }),
        }
    },

    addProseMirrorPlugins: function () {
        const { insertCustomBlockUsing } = this.options

        return [
            new Plugin({
                props: {
                    handleDrop(view, event) {
                        if (!event) {
                            return false
                        }

                        event.preventDefault()

                        if (!event.dataTransfer.getData('customBlock')) {
                            return false
                        }

                        const customBlockId =
                            event.dataTransfer.getData('customBlock')

                        insertCustomBlockUsing(customBlockId, view.posAtCoords({
                            left: event.clientX,
                            top: event.clientY,
                        }).pos)

                        return false
                    },
                },
            }),
        ]
    },
})
