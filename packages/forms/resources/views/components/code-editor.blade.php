@php
    use Filament\Support\Facades\FilamentView;

    $fieldWrapperView = $getFieldWrapperView();
    $extraInputAttributeBag = $getExtraAttributeBag();
    $key = $getKey();
    $statePath = $getStatePath();
@endphp

<x-dynamic-component :component="$fieldWrapperView" :field="$field">
    <x-filament::input.wrapper
        :valid="! $errors->has($statePath)"
        :attributes="
            \Filament\Support\prepare_inherited_attributes($extraInputAttributeBag)
                ->class(['fi-fo-code-editor'])
        "
    >
        <div
            {{-- prettier-ignore-start --}}x-load="visible || event (x-modal-opened)"
            {{-- prettier-ignore-end --}}
            x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('code-editor', 'filament/forms') }}"
            x-data="codeEditorFormComponent({
                        state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$statePath}')", isOptimisticallyLive: false) }},
                    })"
            wire:ignore
            {{ $getExtraAlpineAttributeBag() }}
        >
            <div x-ref="editor" x-cloak></div>
        </div>
    </x-filament::input.wrapper>
</x-dynamic-component>
