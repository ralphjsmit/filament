<?php

namespace Filament\Schemas\Components\StateCasts;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class BooleanStateCast
{
    public function get(mixed $state): bool
    {
        return boolval($state);
    }

    public function set(mixed $state): bool
    {
        return boolval($state);
    }
}
