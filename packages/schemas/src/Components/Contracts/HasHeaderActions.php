<?php

namespace Filament\Schemas\Components\Contracts;

use Filament\Actions\Action;

interface HasHeaderActions
{
    /**
     * @return array<Action>
     */
    public function getHeaderActions(): array;
}
