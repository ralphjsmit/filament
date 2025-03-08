<?php

namespace Filament\Schemas\Components\StateCasts;

use Filament\Schemas\Components\StateCasts\Contracts\StateCast;

class BooleanStateCast implements StateCast
{
    public function get(mixed $state): ?bool
    {
        if (blank($state)) {
            return null;
        }

        return boolval($state);
    }

    public function set(mixed $state): ?bool
    {
        if (blank($state)) {
            return null;
        }

        return boolval($state);
    }
}
