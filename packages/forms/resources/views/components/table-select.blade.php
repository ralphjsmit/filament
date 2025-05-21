@php
    use Filament\Forms\Components\TableSelect\Livewire\TableSelectLivewireComponent;

    $fieldWrapperView = $getFieldWrapperView();
    $extraAttributes = $getExtraAttributes();
    $id = $getId();
@endphp

<x-dynamic-component :component="$fieldWrapperView" :field="$field">
    @if (filled($id) || filled($extraAttributes))
        {!! '<div' !!}
        {{-- Avoid formatting issues with unclosed elements --}}
        {{
            $attributes
                ->merge([
                    'id' => $id,
                ], escape: false)
                ->merge($extraAttributes, escape: false)
        }}
        >
    @endif

    @livewire(TableSelectLivewireComponent::class, [
        'model' => $getModel(),
        'record' => $getRecord(),
        'relationshipName' => $getRelationshipName(),
        'tableConfiguration' => base64_encode($getTableConfiguration()),
        'wire:model' => $getStatePath(),
    ], key($getLivewireKey()))

    @if (filled($id) || filled($extraAttributes))
        {!! '</div>' !!}
        {{-- Avoid formatting issues with unclosed elements --}}
    @endif
</x-dynamic-component>
