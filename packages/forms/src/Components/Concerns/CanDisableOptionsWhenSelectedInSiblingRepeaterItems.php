<?php

namespace Filament\Forms\Components\Concerns;

use Filament\Forms\Components\Component;
use Filament\Forms\Components\Contracts\CanDisableOptions;
use Illuminate\Support\Arr;

trait CanDisableOptionsWhenSelectedInSiblingRepeaterItems
{
    public function disableOptionsWhenSelectedInSiblingRepeaterItems(): static
    {
        $this->distinct();
        $this->live();

        $this->disableOptionWhen(static function (Component & CanDisableOptions $component, string $value, mixed $state) {
            $repeater = $component->getParentRepeater();

            if (! $repeater) {
                return false;
            }

            return collect($repeater->getState())
                ->pluck(
                    (string) str($component->getStatePath())
                        ->after("{$repeater->getStatePath()}.")
                        ->after('.'),
                )
                ->flatten()
                ->map(function ($siblingItemState) {
                    if ($siblingItemState instanceof \UnitEnum) {
                        return property_exists($siblingItemState, 'value') ? $siblingItemState->value : $siblingItemState->name;
                    }
                    return $siblingItemState;
                })
                ->diff(Arr::wrap($state instanceof \UnitEnum ? (property_exists($state, 'value') ? $state->value : $state->name) : $state))
                ->filter(fn (mixed $siblingItemState): bool => filled($siblingItemState))
                ->contains($value);
        });

        return $this;
    }
}
