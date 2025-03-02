<?php

namespace Filament\Schemas\Components\StateCasts;

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
