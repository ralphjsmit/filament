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
                ->class([
                    'fi-fo-slider',
                    'fi-fo-slider-orientation-vertical' => $orientation === Filament\Forms\Components\Enums\SliderOrientation::Vertical->value,
                    'fi-fo-slider-orientation-horizontal' => $orientation === Filament\Forms\Components\Enums\SliderOrientation::Horizontal->value,
                    'fi-fo-slider-pips' => $pips,
                ])
        }}
    ></div>
</x-dynamic-component>
