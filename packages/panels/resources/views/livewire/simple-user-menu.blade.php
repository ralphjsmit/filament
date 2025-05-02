<div>
    @if (filament()->hasUserMenu())
        <x-filament-panels::user-menu />
    @else

    <x-filament-actions::modals />
</div>
