<div>
    @php
        $navigation = filament()->getNavigation();
    @endphp

    <x-filament-panels::sidebar
        :navigation="$navigation"
        class="fi-main-sidebar"
    />

    <x-filament-actions::modals />
</div>
