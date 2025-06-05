import { EditorView, basicSetup } from 'codemirror-v6'
import { indentWithTab } from '@codemirror/commands'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { php } from '@codemirror/lang-php'
import { EditorState } from '@codemirror/state'
import { keymap } from '@codemirror/view'

export default function codeEditorFormComponent({
    isDisabled,
    language,
    state,
}) {
    return {
        editor: null,
        state,

        getLanguageExtension() {
            switch (language) {
                case 'css':
                    return css()
                case 'html':
                    return html()
                case 'javascript':
                    return javascript()
                case 'json':
                    return json()
                case 'php':
                    return php()
                default:
                    return []
            }
        },

        init: function () {
            this.editor = new EditorView({
                parent: this.$refs.editor,
                state: EditorState.create({
                    doc: this.state,
                    extensions: [
                        basicSetup,
                        keymap.of([indentWithTab]),
                        EditorState.readOnly.of(isDisabled),
                        EditorView.editable.of(!isDisabled),
                        EditorView.updateListener.of((viewUpdate) => {
                            if (!viewUpdate.docChanged) {
                                return
                            }

                            this.state = viewUpdate.state.doc.toString()
                        }),
                    ],
                }),
            })

            this.$watch('state', () => {
                if (this.editor.state.doc.toString() === this.state) {
                    return
                }

                this.editor.dispatch({
                    changes: {
                        from: 0,
                        to: this.editor.state.doc.length,
                        insert: this.state,
                    },
                })
            })
        },
    }
}
