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

    addOptions: function () {
        return {
            HTMLAttributes: {},
            renderText({ node }) {
                return `<<${node.attrs.label ?? node.attrs.id}>>`
            },
            renderHTML({ options, node }) {
                return [
                    'div',
                    mergeAttributes(
                        this.HTMLAttributes,
                        options.HTMLAttributes,
                    ),
                    `${node.attrs.label ?? node.attrs.id}`,
                ]
            },
        }
    },

    addAttributes: function () {
        return {
            id: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-id'),
                renderHTML: (attributes) => {
                    if (!attributes.id) {
                        return {}
                    }

                    return {
                        'data-id': attributes.id,
                    }
                },
            },

            label: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-label'),
                renderHTML: (attributes) => {
                    if (!attributes.label) {
                        return {}
                    }

                    return {
                        'data-label': attributes.label,
                    }
                },
            },
        }
    },

    parseHTML: function () {
        return [
            {
                tag: `div[data-type="${this.name}"]`,
            },
        ]
    },

    renderHTML: function ({ node, HTMLAttributes }) {
        const mergedOptions = { ...this.options }

        mergedOptions.HTMLAttributes = mergeAttributes(
            { 'data-type': this.name },
            this.options.HTMLAttributes,
            HTMLAttributes,
        )

        const html = this.options.renderHTML({
            options: mergedOptions,
            node,
        })

        if (typeof html === 'string') {
            return [
                'div',
                mergeAttributes(
                    { 'data-type': this.name },
                    this.options.HTMLAttributes,
                    HTMLAttributes,
                ),
                html,
            ]
        }
        return html
    },

    renderText: function ({ node }) {
        const args = {
            options: this.options,
            node,
        }

        return this.options.renderText(args)
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

                        view.dispatch(
                            view.state.tr.insert(
                                view.posAtCoords({
                                    left: event.clientX,
                                    top: event.clientY,
                                }).pos,
                                view.state.schema.nodes.customBlock.create({
                                    id: customBlockId,
                                }),
                            ),
                        )

                        return false
                    },
                },
            }),
        ]
    },
})
