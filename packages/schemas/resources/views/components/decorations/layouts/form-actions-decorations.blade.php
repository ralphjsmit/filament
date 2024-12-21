@php
    use Filament\Support\Enums\Alignment;

    $alignment = $getAlignment();
    $decorations = $getDecorations();
    $isFullWidth = $isFullWidth();
@endphp

<div
    @if ($isSticky())
        x-data="{
            isSticky: false,

            evaluatePageScrollPosition: function () {
                this.isSticky =
                    document.body.scrollHeight >=
                    window.scrollY + window.innerHeight * 2
            },
        }"
        x-init="evaluatePageScrollPosition"
        x-on:scroll.window="evaluatePageScrollPosition"
        x-bind:class="{
            'fi-sticky sticky bottom-0 -mx-4 transform bg-white p-4 shadow-lg ring-1 ring-gray-950/5 transition dark:bg-gray-900 dark:ring-white/10 md:bottom-4 md:rounded-xl':
                isSticky,
        }"
    @endif
    class="fi-form-actions"
>
    <x-filament::actions
        :actions="$decorations"
        :alignment="$alignment"
        :full-width="$isFullWidth"
    />
</div>
