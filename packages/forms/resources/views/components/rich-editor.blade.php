@php
    use Filament\Support\Facades\FilamentView;

    $customBlocks = $getCustomBlocks();
    $fieldWrapperView = $getFieldWrapperView();
    $id = $getId();
    $key = $getKey();
    $mergeTags = $getMergeTags();
    $statePath = $getStatePath();
    $tools = $getTools();
    $toolbarButtons = $getToolbarButtons();
@endphp

<x-dynamic-component :component="$fieldWrapperView" :field="$field">
    <div
        @if (FilamentView::hasSpaMode())
            {{-- format-ignore-start --}}x-load="visible || event (x-modal-opened)"{{-- format-ignore-end --}}
        @else
            x-load
        @endif
        x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('rich-editor', 'filament/forms') }}"
        x-data="richEditorFormComponent({
                    activePanel: @js($getActivePanel()),
                    extensions: @js($getTipTapJsExtensions()),
                    key: @js($key),
                    isLiveDebounced: @js($isLiveDebounced()),
                    isLiveOnBlur: @js($isLiveOnBlur()),
                    liveDebounce: @js($getNormalizedLiveDebounce()),
                    livewireId: @js($this->getId()),
                    mergeTags: @js($mergeTags),
                    noMergeTagSearchResultsMessage: @js($getNoMergeTagSearchResultsMessage()),
                    state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$statePath}')", isOptimisticallyLive: false) }},
                    statePath: @js($statePath),
                    uploadingFileMessage: @js($getUploadingFileMessage()),
                })"
        x-bind:class="{
            'fi-fo-rich-editor-uploading-file': isUploadingFile,
        }"
        {{ $getExtraAttributeBag()->class(['fi-fo-rich-editor']) }}
    >
        <x-filament::input.wrapper :valid="! $errors->has($statePath)" x-cloak>
            @if (filled($toolbarButtons))
                <div class="fi-fo-rich-editor-toolbar">
                    @foreach ($toolbarButtons as $buttonGroup)
                        <div class="fi-fo-rich-editor-toolbar-group">
                            @foreach ($buttonGroup as $button)
                                {{ $tools[$button] ?? throw new Exception("Toolbar button [{$button}] cannot be found.") }}
                            @endforeach
                        </div>
                    @endforeach
                </div>
            @endif

            <div class="fi-fo-rich-editor-main">
                <div
                    class="fi-fo-rich-editor-content fi-prose"
                    x-ref="editor"
                    wire:ignore
                ></div>

                <div
                    x-show="isPanelActive()"
                    class="fi-fo-rich-editor-side-panels"
                >
                    <div
                        x-show="isPanelActive('customBlocks')"
                        class="fi-fo-rich-editor-side-panel"
                    >
                        <div class="fi-fo-rich-editor-side-panel-header">
                            <p class="fi-fo-rich-editor-side-panel-heading">
                                {{ __('filament-forms::components.rich_editor.tools.custom_blocks') }}
                            </p>

                            <div
                                class="fi-fo-rich-editor-side-panel-close-btn-ctn"
                            >
                                <button
                                    type="button"
                                    x-on:click="togglePanel()"
                                    class="fi-icon-btn"
                                >
                                    {{ \Filament\Support\generate_icon_html(\Filament\Support\Icons\Heroicon::XMark, alias: 'forms:components.rich-editor.panels.custom-blocks.close-button') }}
                                </button>
                            </div>
                        </div>

                        <div class="fi-fo-rich-editor-custom-blocks-list">
                            @foreach ($customBlocks as $block)
                                @php
                                    $blockId = $block::getId();
                                @endphp

                                <div>
                                    <button
                                        draggable="true"
                                        type="button"
                                        x-on:click="insertCustomBlock(@js($blockId))"
                                        x-on:dragstart="$event.dataTransfer.setData('customBlock', @js($blockId))"
                                        class="fi-fo-rich-editor-custom-block-btn"
                                    >
                                        <div
                                            data-type="customBlock"
                                            data-id="{{ $blockId }}"
                                        >
                                            {{ $block::getLabel() }}
                                        </div>
                                    </button>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    <div
                        x-show="isPanelActive('mergeTags')"
                        class="fi-fo-rich-editor-side-panel"
                    >
                        <div class="fi-fo-rich-editor-side-panel-header">
                            <p class="fi-fo-rich-editor-side-panel-heading">
                                {{ __('filament-forms::components.rich_editor.tools.merge_tags') }}
                            </p>

                            <div
                                class="fi-fo-rich-editor-side-panel-close-btn-ctn"
                            >
                                <button
                                    type="button"
                                    x-on:click="togglePanel()"
                                    class="fi-icon-btn"
                                >
                                    {{ \Filament\Support\generate_icon_html(\Filament\Support\Icons\Heroicon::XMark, alias: 'forms:components.rich-editor.panels.merge-tags.close-button') }}
                                </button>
                            </div>
                        </div>

                        <div class="fi-fo-rich-editor-merge-tags-list">
                            @foreach ($mergeTags as $tag)
                                <div>
                                    <button
                                        draggable="true"
                                        type="button"
                                        x-on:click="insertMergeTag(@js($tag))"
                                        x-on:dragstart="$event.dataTransfer.setData('mergeTag', @js($tag))"
                                        class="fi-fo-rich-editor-merge-tag-btn"
                                    >
                                        <span
                                            data-type="mergeTag"
                                            data-id="{{ $tag }}"
                                        >
                                            {{ $tag }}
                                        </span>
                                    </button>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </x-filament::input.wrapper>
    </div>
</x-dynamic-component>
