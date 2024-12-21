<?php

namespace Filament\Schemas\Components\Contracts;

use Filament\Actions\Action;
use Filament\Support\Enums\Alignment;

interface HasFooterActions
{
    /**
     * @return array<Action>
     */
    public function getFooterActions(): array;

    public function getFooterActionsAlignment(): ?Alignment;
}
