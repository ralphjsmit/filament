@php
    $fieldWrapperView = $getFieldWrapperView();
    $id = $getId();
    $isDisabled = $isDisabled();
    $statePath = $getStatePath();
    $range = $getRange();
    $step = $getStep();
    $start = $getStart();
    $margin = $getMargin();
    $limit = $getLimit();
    $padding = $getPadding();
    $connect = $getConnect();
    $direction = $getDirection();
    $orientation = $getOrientation();
    $behaviour = $getBehaviour();
    $tooltips = $getTooltips();
    $format = $getFormat();
    $pips = $getPips();
    $ariaFormat = $getAriaFormat();
@endphp

<x-dynamic-component :component="$fieldWrapperView" :field="$field">
    <div
        {{-- Set dimensions! Vertical sliders don't assume a default height, so a height needs to be set. --}}
        {{-- Set margin bottom when orientation is horizontal due to nouislider bug --}}
        @class([
            'h-40' => $orientation === Filament\Forms\Components\Enums\SliderOrientation::Vertical->value,
            'mb-8' => $orientation === Filament\Forms\Components\Enums\SliderOrientation::Horizontal->value,
        ])
        x-load
        x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('slider', 'filament/forms') }}"
        x-data="sliderFormComponent({
                    state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$statePath}')") }},
                    range: @js($range),
                    step: @js($step),
                    start: @js($start),
                    margin: @js($margin),
                    limit: @js($limit),
                    padding: @js($padding),
                    connect: @js($connect),
                    direction: @js($direction),
                    orientation: @js($orientation),
                    behaviour: @js($behaviour),
                    tooltips: @js($tooltips),
                    format: @js($format),
                    pips: @js($pips),
                    ariaFormat: @js($ariaFormat),
                })"
        {{
            $attributes
                ->merge([
                    'disabled' => $isDisabled,
                    'id' => $id,
                    'wire:target' => $statePath,
                ], escape: false)
                ->merge($getExtraAttributes(), escape: false)
                ->merge($getExtraAlpineAttributes(), escape: false)
        }}
    ></div>
</x-dynamic-component>
