@php
    $fieldWrapperView = $getFieldWrapperView();
    $isVertical = $isVertical();
    $pips = $getPips();
@endphp

<x-dynamic-component :component="$fieldWrapperView" :field="$field">
    <div
        x-load
        x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('slider', 'filament/forms') }}"
        x-data="sliderFormComponent({
                    state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$getStatePath()}')") }},
                    maxValue: @js($getMaxValue()),
                    minValue: @js($getMinValue()),
                    step: @js($getStep()),
                    margin: @js($getMargin()),
                    limit: @js($getLimit()),
                    padding: @js($getPadding()),
                    connect: @js($getConnect()),
                    isRtl: @js($isRtl()),
                    isVertical: @js($isVertical),
                    behavior: @js($getBehavior()),
                    tooltips: @js($getTooltips()),
                    format: @js($getFormat()),
                    pips: @js($pips),
                    ariaFormat: @js($getAriaFormat()),
                })"
        {{
            $attributes
                ->merge([
                    'disabled' => $isDisabled(),
                    'id' => $getId(),
                ], escape: false)
                ->merge($getExtraAttributes(), escape: false)
                ->merge($getExtraAlpineAttributes(), escape: false)
                ->class([
                    'fi-fo-slider',
                    'fi-fo-slider-vertical' => $isVertical,
                    'fi-fo-slider-pips' => $pips,
                ])
        }}
    ></div>
</x-dynamic-component>
