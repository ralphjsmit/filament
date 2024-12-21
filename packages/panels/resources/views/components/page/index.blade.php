@props([
    'fullHeight' => false,
])

@php
    use Filament\Pages\Enums\SubNavigationPosition;

    $subNavigation = $this->getCachedSubNavigation();
    $subNavigationPosition = $this->getSubNavigationPosition();
    $widgetData = $this->getWidgetData();
@endphp

<div
    {{
        $attributes->class([
            'fi-page',
            'h-full' => $fullHeight,
            ...$this->getPageClasses(),
        ])
    }}
>
    {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_START, scopes: $this->getRenderHookScopes()) }}

    <section
        @class([
            'flex flex-col gap-y-8 py-8',
            'h-full' => $fullHeight,
        ])
    >
        @if ($header = $this->getHeader())
            {{ $header }}
        @elseif ($heading = $this->getHeading())
            @php
                $subheading = $this->getSubheading();
            @endphp

            <x-filament-panels::header
                :actions="$this->getCachedHeaderActions()"
                :breadcrumbs="filament()->hasBreadcrumbs() ? $this->getBreadcrumbs() : []"
                :heading="$heading"
                :subheading="$subheading"
            >
                @if ($heading instanceof \Illuminate\Contracts\Support\Htmlable)
                    <x-slot name="heading">
                        {{ $heading }}
                    </x-slot>
                @endif

                @if ($subheading instanceof \Illuminate\Contracts\Support\Htmlable)
                    <x-slot name="subheading">
                        {{ $subheading }}
                    </x-slot>
                @endif
            </x-filament-panels::header>
        @endif

        <div
            @class([
                'flex flex-col gap-8' => $subNavigation,
                match ($subNavigationPosition) {
                    SubNavigationPosition::Start, SubNavigationPosition::End => 'md:flex-row md:items-start',
                    default => null,
                } => $subNavigation,
                'h-full' => $fullHeight,
            ])
        >
            @if ($subNavigation)
                <div class="contents md:hidden">
                    {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_SUB_NAVIGATION_SELECT_BEFORE, scopes: $this->getRenderHookScopes()) }}
                </div>

                <x-filament-panels::page.sub-navigation.select
                    :navigation="$subNavigation"
                />

                <div class="contents md:hidden">
                    {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_SUB_NAVIGATION_SELECT_AFTER, scopes: $this->getRenderHookScopes()) }}
                </div>

                @if ($subNavigationPosition === SubNavigationPosition::Start)
                    {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_SUB_NAVIGATION_START_BEFORE, scopes: $this->getRenderHookScopes()) }}

                    <x-filament-panels::page.sub-navigation.sidebar
                        :navigation="$subNavigation"
                    />

                    {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_SUB_NAVIGATION_START_AFTER, scopes: $this->getRenderHookScopes()) }}
                @endif

                @if ($subNavigationPosition === SubNavigationPosition::Top)
                    {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_SUB_NAVIGATION_TOP_BEFORE, scopes: $this->getRenderHookScopes()) }}

                    <x-filament-panels::page.sub-navigation.tabs
                        :navigation="$subNavigation"
                    />

                    {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_SUB_NAVIGATION_TOP_AFTER, scopes: $this->getRenderHookScopes()) }}
                @endif
            @endif

            <div
                @class([
                    'grid flex-1 auto-cols-fr gap-y-8',
                    'h-full' => $fullHeight,
                ])
            >
                {{ $this->headerWidgets }}

                {{ $slot }}

                {{ $this->footerWidgets }}
            </div>

            @if ($subNavigation && $subNavigationPosition === SubNavigationPosition::End)
                {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_SUB_NAVIGATION_END_BEFORE, scopes: $this->getRenderHookScopes()) }}

                <x-filament-panels::page.sub-navigation.sidebar
                    :navigation="$subNavigation"
                />

                {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_SUB_NAVIGATION_END_AFTER, scopes: $this->getRenderHookScopes()) }}
            @endif
        </div>

        @if ($footer = $this->getFooter())
            {{ $footer }}
        @endif
    </section>

    @if (! ($this instanceof \Filament\Tables\Contracts\HasTable))
        <x-filament-actions::modals />
    @endif

    @if (filled($this->defaultAction))
        <div
            wire:init="mountAction(@js($this->defaultAction) @if (filled($this->defaultActionArguments) || filled($this->defaultActionContext)) , @if (filled($this->defaultActionArguments)) @js($this->defaultActionArguments) @else {} @endif @endif @if (filled($this->defaultActionContext)) @js($this->defaultActionContext) @endif)"
        ></div>
    @endif

    {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_END, scopes: $this->getRenderHookScopes()) }}

    @if (method_exists($this, 'hasUnsavedDataChangesAlert') && $this->hasUnsavedDataChangesAlert())
        @if (\Filament\Support\Facades\FilamentView::hasSpaMode())
            @script
                <script>
                    let formSubmitted = false

                    document.addEventListener(
                        'submit',
                        () => (formSubmitted = true),
                    )

                    shouldPreventNavigation = () => {
                        if (formSubmitted) {
                            return
                        }

                        return (
                            window.jsMd5(
                                JSON.stringify($wire.data).replace(/\\/g, ''),
                            ) !== $wire.savedDataHash ||
                            $wire?.__instance?.effects?.redirect
                        )
                    }

                    const showUnsavedChangesAlert = () => {
                        return confirm(@js(__('filament-panels::unsaved-changes-alert.body')))
                    }

                    document.addEventListener('livewire:navigate', (event) => {
                        if (typeof @this !== 'undefined') {
                            if (!shouldPreventNavigation()) {
                                return
                            }

                            if (showUnsavedChangesAlert()) {
                                return
                            }

                            event.preventDefault()
                        }
                    })

                    window.addEventListener('beforeunload', (event) => {
                        if (!shouldPreventNavigation()) {
                            return
                        }

                        event.preventDefault()
                        event.returnValue = true
                    })
                </script>
            @endscript
        @else
            @script
                <script>
                    window.addEventListener('beforeunload', (event) => {
                        if (
                            window.jsMd5(
                                JSON.stringify($wire.data).replace(/\\/g, ''),
                            ) === $wire.savedDataHash ||
                            $wire?.__instance?.effects?.redirect
                        ) {
                            return
                        }

                        event.preventDefault()
                        event.returnValue = true
                    })
                </script>
            @endscript
        @endif
    @endif

    <x-filament-panels::unsaved-action-changes-alert />
</div>
