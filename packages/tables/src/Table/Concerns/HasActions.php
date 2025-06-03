<?php

namespace Filament\Tables\Table\Concerns;

use Closure;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkAction;
use Filament\Support\Enums\Size;
use Filament\Tables\Enums\ActionsPosition;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Arr;
use InvalidArgumentException;

trait HasActions
{
    /**
     * @var array<Action | ActionGroup>
     */
    protected array $actions = [];

    /**
     * @var array<string, Action>
     */
    protected array $flatActions = [];

    /**
     * @var array<string, BulkAction>
     */
    protected array $flatBulkActions = [];

    protected string | Htmlable | Closure | null $actionsColumnLabel = null;

    protected string | Closure | null $actionsAlignment = null;

    protected ActionsPosition | Closure | null $actionsPosition = null;

    /**
     * @param  array<Action | ActionGroup> | ActionGroup  $actions
     */
    public function actions(array | ActionGroup $actions, ActionsPosition | string | Closure | null $position = null): static
    {
        $this->actions = [];
        $this->pushActions($actions);

        if ($position) {
            $this->actionsPosition($position);
        }

        return $this;
    }

    /**
     * @param  array<Action | ActionGroup> | ActionGroup  $actions
     */
    public function pushActions(array | ActionGroup $actions): static
    {
        foreach (Arr::wrap($actions) as $action) {
            $action->table($this);

            if ($action instanceof ActionGroup) {
                if (! $action->getDropdownPlacement()) {
                    $action->dropdownPlacement('bottom-end');
                }

                /** @var array<string, Action> $flatActions */
                $flatActions = $action->getFlatActions();

                $this->mergeCachedFlatActions($flatActions);
            } elseif ($action instanceof Action) {
                $action->defaultSize(Size::Small);
                $action->defaultView($action::LINK_VIEW);

                $this->cacheAction($action);
            } else {
                throw new InvalidArgumentException('Table actions must be an instance of [' . Action::class . '] or [' . ActionGroup::class . '].');
            }

            $this->actions[] = $action;
        }

        return $this;
    }

    public function actionsColumnLabel(string | Htmlable | Closure | null $label): static
    {
        $this->actionsColumnLabel = $label;

        return $this;
    }

    public function actionsAlignment(string | Closure | null $alignment = null): static
    {
        $this->actionsAlignment = $alignment;

        return $this;
    }

    public function actionsPosition(ActionsPosition | Closure | null $position = null): static
    {
        $this->actionsPosition = $position;

        return $this;
    }

    /**
     * @return array<Action | ActionGroup>
     */
    public function getActions(): array
    {
        return $this->actions;
    }

    public function getAction(string $name): ?Action
    {
        return $this->getFlatActions()[$name] ?? null;
    }

    public function getBulkAction(string $name): ?BulkAction
    {
        return $this->getFlatBulkActions()[$name] ?? null;
    }

    /**
     * @return array<string, Action>
     */
    public function getFlatActions(): array
    {
        return $this->flatActions;
    }

    /**
     * @return array<string, BulkAction>
     */
    public function getFlatBulkActions(): array
    {
        return $this->flatBulkActions;
    }

    public function hasAction(string $name): bool
    {
        return array_key_exists($name, $this->getFlatActions());
    }

    public function hasBulkAction(string $name): bool
    {
        return array_key_exists($name, $this->getFlatBulkActions());
    }

    protected function cacheAction(Action $action, bool $shouldOverwriteExistingAction = true): void
    {
        if (! $shouldOverwriteExistingAction) {
            if ($action instanceof BulkAction) {
                $this->flatBulkActions[$action->getName()] ??= $action;
            } else {
                $this->flatActions[$action->getName()] ??= $action;
            }

            return;
        }

        if ($action instanceof BulkAction) {
            $this->flatBulkActions[$action->getName()] = $action;

            return;
        }

        $this->flatActions[$action->getName()] = $action;
    }

    /**
     * @param  array<string, Action>  $actions
     */
    protected function mergeCachedFlatActions(array $actions, bool $shouldOverwriteExistingActions = true): void
    {
        foreach ($actions as $action) {
            $this->cacheAction($action, $shouldOverwriteExistingActions);
        }
    }

    public function getActionsPosition(): ActionsPosition
    {
        $position = $this->evaluate($this->actionsPosition);

        if ($position) {
            return $position;
        }

        if (! ($this->getContentGrid() || $this->hasColumnsLayout())) {
            return ActionsPosition::AfterColumns;
        }

        return ActionsPosition::AfterContent;
    }

    public function getActionsAlignment(): ?string
    {
        return $this->evaluate($this->actionsAlignment);
    }

    public function getActionsColumnLabel(): string | Htmlable | null
    {
        return $this->evaluate($this->actionsColumnLabel);
    }

    /**
     * @param  array<Action>  $actions
     */
    protected function removeCachedActions(array $actions): void
    {
        $this->flatActions = array_filter(
            $this->flatActions,
            fn (Action $existingAction): bool => ! in_array($existingAction, $actions, true),
        );

        $this->flatBulkActions = array_filter(
            $this->flatBulkActions,
            fn (Action $existingAction): bool => ! in_array($existingAction, $actions, true),
        );
    }
}
