@php
    $id = $getId();
    $key = $getKey(isAbsolute: false);
    $tabs = $getContainer()->getParentComponent();
    $isContained = $tabs->isContained();
    $livewireProperty = $tabs->getLivewireProperty();

    $activeTabClasses = \Illuminate\Support\Arr::toCssClasses([
        'fi-active',
        'p-6' => $isContained,
        'mt-6' => ! $isContained,
    ]);

    $inactiveTabClasses = 'invisible absolute h-0 overflow-hidden p-0';

    $childComponentContainer = $getChildComponentContainer();
@endphp

@if (! empty($childComponentContainer->getCachedVisibleComponents()))
    @if (blank($livewireProperty))
        <div
            x-bind:class="{
                @js($activeTabClasses): tab === @js($key),
                @js($inactiveTabClasses): tab !== @js($key),
            }"
            x-on:expand="tab = @js($key)"
            {{
                $attributes
                    ->merge([
                        'aria-labelledby' => $id,
                        'id' => $id,
                        'role' => 'tabpanel',
                        'tabindex' => '0',
                        'wire:key' => $getLivewireKey() . '.container',
                    ], escape: false)
                    ->merge($getExtraAttributes(), escape: false)
                    ->class(['fi-fo-tabs-tab outline-none'])
            }}
        >
            {{ $getChildComponentContainer() }}
        </div>
    @elseif (strval($this->{$livewireProperty}) === strval($key))
        <div
            {{
                $attributes
                    ->merge([
                        'aria-labelledby' => $id,
                        'id' => $id,
                        'role' => 'tabpanel',
                        'tabindex' => '0',
                        'wire:key' => $getLivewireKey() . '.container',
                    ], escape: false)
                    ->merge($getExtraAttributes(), escape: false)
                    ->class([
                        'fi-fo-tabs-tab outline-none',
                        $activeTabClasses,
                    ])
            }}
        >
            {{ $getChildComponentContainer() }}
        </div>
    @endif
@endif
