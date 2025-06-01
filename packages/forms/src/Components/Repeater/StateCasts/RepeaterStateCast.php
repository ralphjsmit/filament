<?php

namespace Filament\Forms\Components\Repeater\StateCasts;

use Filament\Forms\Components\Repeater;
use Filament\Schemas\Components\StateCasts\Contracts\StateCast;

class RepeaterStateCast implements StateCast
{
    public function __construct(
        protected Repeater $repeater,
    ) {}

    /**
     * @return array<mixed>
     */
    public function get(mixed $state): array
    {
        if (! is_array($state)) {
            return [];
        }

        if (blank($state)) {
            return [];
        }

        if ($simpleField = $this->repeater->getSimpleField()) {
            return collect($state)
                ->values()
                ->pluck($simpleField->getName())
                ->all();
        }

        return array_values($state);
    }

    /**
     * @return array<mixed>
     */
    public function set(mixed $state): array
    {
        if (! is_array($state)) {
            return [];
        }

        if (blank($state)) {
            return [];
        }

        $items = [];

        foreach ($state as $itemData) {
            if ($key = $this->repeater->generateUuid()) {
                $items[$key] = $itemData;
            } else {
                $items[] = $itemData;
            }
        }

        return $items;
    }
}
