import { mergeAttributes, Node } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { PluginKey } from '@tiptap/pm/state'
import Suggestion from '@tiptap/suggestion'

const getSuggestionOptions = function ({
  editor: tiptapEditor,
  overrideSuggestionOptions,
  extensionName,
  char = '@',
}) {
    const pluginKey = new PluginKey()

    return {
        editor: tiptapEditor,
        char,
        pluginKey,
        command: ({ editor, range, props }) => {
            // increase range.to by one when the next node is of type "text"
            // and starts with a space character
            const nodeAfter = editor.view.state.selection.$to.nodeAfter
            const overrideSpace = nodeAfter?.text?.startsWith(' ')

            if (overrideSpace) {
                range.to += 1
            }

            editor
                .chain()
                .focus()
                .insertContentAt(range, [
                    {
                        type: extensionName,
                        attrs: { ...props, mentionSuggestionChar: char },
                    },
                    {
                        type: 'text',
                        text: ' ',
                    },
                ])
                .run()

            // get reference to `window` object from editor element, to support cross-frame JS usage
            editor.view.dom.ownerDocument.defaultView?.getSelection()?.collapseToEnd()
        },
        allow: ({ state, range }) => {
            const $from = state.doc.resolve(range.from)
            const type = state.schema.nodes[extensionName]
            const allow = !!$from.parent.type.contentMatch.matchType(type)

            return allow
        },
        ...overrideSuggestionOptions,
    }
}

export default Node.create({
    name: 'mergeTag',

    priority: 101,

    addStorage: function () {
        return {
            suggestions: [],
            getSuggestionFromChar: () => null,
        }
    },

    addOptions: function () {
        return {
            HTMLAttributes: {},
            renderText({ node, suggestion }) {
                return `${suggestion?.char}${node.attrs.label ?? node.attrs.id}`
            },
            deleteTriggerWithBackspace: false,
            renderHTML({ options, node, suggestion }) {
                return [
                    'span',
                    mergeAttributes(this.HTMLAttributes, options.HTMLAttributes),
                    `${suggestion?.char}${node.attrs.label ?? node.attrs.id}`,
                ]
            },
            suggestions: [],
            suggestion: {},
        }
    },

    group: 'inline',

    inline: true,

    selectable: false,

    atom: true,

    addAttributes: function () {
        return {
            id: {
                default: null,
                parseHTML: element => element.getAttribute('data-id'),
                renderHTML: attributes => {
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
                parseHTML: element => element.getAttribute('data-label'),
                renderHTML: attributes => {
                    if (!attributes.label) {
                        return {}
                    }

                    return {
                        'data-label': attributes.label,
                    }
                },
            },

            // When there are multiple types of merge tags, this attribute helps distinguish them
            mergeTagSuggestionChar: {
                default: '@',
                parseHTML: element => element.getAttribute('data-merge-tag-suggestion-char'),
                renderHTML: attributes => {
                    return {
                        'data-merge-tag-suggestion-char': attributes.mergeTagSuggestionChar,
                    }
                },
            },
        }
    },

    parseHTML: function () {
        return [
            {
                tag: `span[data-type="${this.name}"]`,
            },
        ]
    },

    renderHTML: function ({ node, HTMLAttributes }) {
        // We cannot use the `this.storage` property here because, when accessed this method,
        // it returns the initial value of the extension storage
        const suggestion = (this.editor?.extensionStorage)?.[
            this.name
        ]?.getSuggestionFromChar(node.attrs.mergeTagSuggestionChar)

        const mergedOptions = { ...this.options }

        mergedOptions.HTMLAttributes = mergeAttributes(
            { 'data-type': this.name },
            this.options.HTMLAttributes,
            HTMLAttributes,
        )

        const html = this.options.renderHTML({
            options: mergedOptions,
            node,
            suggestion,
        })

        if (typeof html === 'string') {
            return ['span', mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes), html]
        }
        return html
    },

    renderText: function ({ node }) {
        const args = {
            options: this.options,
            node,
            suggestion: (this.editor?.extensionStorage)?.[
            this.name
        ]?.getSuggestionFromChar(node.attrs.mergeTagSuggestionChar)}

        return this.options.renderText(args)
    },

    addKeyboardShortcuts: function () {
        return {
            Backspace: () =>
                this.editor.commands.command(({ tr, state }) => {
                    let isMergeTag = false
                    const { selection } = state
                    const { empty, anchor } = selection

                    if (!empty) {
                        return false
                    }

                    // Store node and position for later use
                    let mergeTagNode = new ProseMirrorNode()
                    let mergeTagPos = 0

                    state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
                        if (node.type.name === this.name) {
                            isMergeTag = true
                            mergeTagNode = node
                            mergeTagPos = pos
                            return false
                        }
                    })

                    if (isMergeTag) {
                        tr.insertText(
                            this.options.deleteTriggerWithBackspace ? '' : mergeTagNode.attrs.mergeTagSuggestionChar,
                            mergeTagPos,
                            mergeTagPos + mergeTagNode.nodeSize,
                        )
                    }

                    return isMergeTag
                }),
        }
    },

    addProseMirrorPlugins: function () {
        // Create a plugin for each suggestion configuration
        return this.storage.suggestions.map(Suggestion)
    },

    onBeforeCreate: function () {
        this.storage.suggestions = (
            this.options.suggestions.length ? this.options.suggestions : [this.options.suggestion]
        ).map(suggestion =>
            getSuggestionOptions({
                editor: this.editor,
                overrideSuggestionOptions: suggestion,
                extensionName: this.name,
                char: suggestion.char,
            }),
        )

        this.storage.getSuggestionFromChar = char => {
            const suggestion = this.storage.suggestions.find(s => s.char === char)
            if (suggestion) {
                return suggestion
            }
            if (this.storage.suggestions.length) {
                return this.storage.suggestions[0]
            }

            return null
        }
    },
})
