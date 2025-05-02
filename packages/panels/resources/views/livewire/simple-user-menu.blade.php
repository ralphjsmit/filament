<div>
    @if (filament()->hasUserMenu())
        <x-filament-panels::user-menu />
    @endif

    <x-filament-actions::modals />
</div>
