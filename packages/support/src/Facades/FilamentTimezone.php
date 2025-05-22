<?php

namespace Filament\Support\Facades;

use Filament\Support\TimezoneManager;
use Filament\Support\View\ViewManager;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Facade;

/**
 * @method void string set(?string $timezone)
 * @method static string get()
 *
 * @see TimezoneManager
 */
class FilamentTimezone extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return TimezoneManager::class;
    }
}
