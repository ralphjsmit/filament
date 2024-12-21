<div class="fi-topbar-ctn sticky top-0 z-20 overflow-x-clip">
    @php
        $navigation = filament()->getNavigation();
    @endphp

    <x-filament-panels::topbar :navigation="$navigation" />

    <x-filament-actions::modals />
</div>
