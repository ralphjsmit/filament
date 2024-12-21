<x-dynamic-component
    :component="static::isSimple() ? 'filament-panels::page.simple' : 'filament-panels::page'"
>
    {{ $this->content }}
</x-dynamic-component>
