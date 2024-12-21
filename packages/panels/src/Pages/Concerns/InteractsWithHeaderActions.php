<?php

namespace Filament\Pages\Concerns;

use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use InvalidArgumentException;

trait InteractsWithHeaderActions
{
    /**
     * @var array<Action | ActionGroup>
     */
    protected array $cachedHeaderActions = [];

    public function cacheInteractsWithHeaderActions(): void
    {
        $actions = $this->getHeaderActions();

        foreach ($actions as $action) {
            if ($action instanceof ActionGroup) {
                $action->livewire($this);

                if (! $action->getDropdownPlacement()) {
                    $action->dropdownPlacement('bottom-end');
                }

                /** @var array<string, Action> $flatActions */
                $flatActions = $action->getFlatActions();

                $this->mergeCachedActions($flatActions);
                $this->cachedHeaderActions[] = $action;

                continue;
            }

            if (! $action instanceof Action) {
                throw new InvalidArgumentException('Header actions must be an instance of ' . Action::class . ', or ' . ActionGroup::class . '.');
            }

            $this->cacheAction($action);
            $this->cachedHeaderActions[] = $action;
        }
    }

    /**
     * @return array<Action | ActionGroup>
     */
    public function getCachedHeaderActions(): array
    {
        return $this->cachedHeaderActions;
    }

    /**
     * @return array<Action | ActionGroup>
     */
    protected function getHeaderActions(): array
    {
        return $this->getActions();
    }

    /**
     * @deprecated Register header actions within the `getHeaderActions()` method instead.
     *
     * @return array<Action | ActionGroup>
     */
    protected function getActions(): array
    {
        return [];
    }
}
