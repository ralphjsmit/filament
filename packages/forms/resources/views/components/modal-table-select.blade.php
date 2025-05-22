@php
    use Filament\Forms\Components\TableSelect\Livewire\TableSelectLivewireComponent;

    $fieldWrapperView = $getFieldWrapperView();
    $extraAttributes = $getExtraAttributes();
    $id = $getId();
    $isMultiple = $isMultiple();
@endphp

<x-dynamic-component :component="$fieldWrapperView" :field="$field">
    <div {{
            $attributes
                ->merge([
                    'id' => $id,
                ], escape: false)
                ->merge($extraAttributes, escape: false)
                ->class([
                    'fi-fo-modal-table-select',
                    'fi-fo-modal-table-select-multiple' => $isMultiple,
                ])
        }}>
        @if ($isMultiple)
            @if (filled($optionLabels = $getOptionLabels()))
                <div class="fi-fo-modal-table-select-badges-ctn">
                    @foreach ($optionLabels as $optionLabel)
                        <x-filament::badge>
                            {{ $optionLabel }}
                        </x-filament::badge>
                    @endforeach
                </div>
            @endif

            <div>
                {{ $getAction('select') }}
            </div>
        @else
            {{ $getOptionLabel() }}

            {{ $getAction('select') }}
        @endif
    </div>
</x-dynamic-component>
