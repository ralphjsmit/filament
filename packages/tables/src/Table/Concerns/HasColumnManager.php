<?php

namespace Filament\Tables\Table\Concerns;

use Closure;
use Filament\Actions\Action;
use Filament\Support\Enums\Size;
use Filament\Support\Enums\Width;
use Filament\Support\Facades\FilamentIcon;
use Filament\Support\Icons\Heroicon;

trait HasColumnManager
{
    /**
     * @var int | array<string, int | null> | Closure
     */
    protected int | array | Closure $columnManagerFormColumns = 1;

    protected string | Closure | null $columnManagerFormMaxHeight = null;

    protected Width | string | Closure | null $columnManagerFormWidth = null;

    protected ?Closure $modifyColumnManagerTriggerActionUsing = null;

    protected bool | Closure $hasDeferredColumnManager = true;

    protected ?Closure $modifyColumnManagerApplyActionUsing = null;

    public function deferColumnManager(bool | Closure $condition = true): static
    {
        $this->hasDeferredColumnManager = $condition;

        return $this;
    }

    public function hasDeferredColumnManager(): bool
    {
        return (bool) $this->evaluate($this->hasDeferredColumnManager);
    }

    public function columnManagerApplyAction(?Closure $callback): static
    {
        $this->modifyColumnManagerApplyActionUsing = $callback;

        return $this;
    }

    /**
     * @deprecated Use `columnManagerTriggerAction()` instead.
     */
    public function toggleColumnsTriggerAction(?Closure $callback): static
    {
        return $this->columnManagerTriggerAction($callback);
    }

    public function columnManagerTriggerAction(?Closure $callback): static
    {
        $this->modifyColumnManagerTriggerActionUsing = $callback;

        return $this;
    }

    /**
     * @deprecated Use `columnManagerFormColumns()` instead.
     *
     * @param  int | array<string, int | null> | Closure  $columns
     */
    public function columnToggleFormColumns(int | array | Closure $columns): static
    {
        return $this->columnManagerFormColumns($columns);
    }

    /**
     * @param  int | array<string, int | null> | Closure  $columns
     */
    public function columnManagerFormColumns(int | array | Closure $columns): static
    {
        $this->columnManagerFormColumns = $columns;

        return $this;
    }

    /**
     * @deprecated Use `columnManagerFormMaxHeight()` instead.
     */
    public function columnToggleFormMaxHeight(string | Closure | null $height): static
    {
        return $this->columnManagerFormMaxHeight($height);
    }

    public function columnManagerFormMaxHeight(string | Closure | null $height): static
    {
        $this->columnManagerFormMaxHeight = $height;

        return $this;
    }

    /**
     * @deprecated Use `columnManagerFormWidth()` instead.
     */
    public function columnToggleFormWidth(Width | string | Closure | null $width): static
    {
        return $this->columnManagerFormWidth($width);
    }

    public function columnManagerFormWidth(Width | string | Closure | null $width): static
    {
        $this->columnManagerFormWidth = $width;

        return $this;
    }

    /**
     * @deprecated Use `getColumnManagerFormColumns()` instead.
     *
     * @return int | array<string, int | null>
     */
    public function getColumnToggleFormColumns(): int | array
    {
        return $this->getColumnManagerFormColumns();
    }

    /**
     * @return int | array<string, int | null>
     */
    public function getColumnManagerFormColumns(): int | array
    {
        return $this->evaluate($this->columnManagerFormColumns) ?? 1;
    }

    /**
     * @deprecated Use `getColumnManagerFormMaxHeight()` instead.
     */
    public function getColumnToggleFormMaxHeight(): ?string
    {
        return $this->getColumnManagerFormMaxHeight();
    }

    public function getColumnManagerFormMaxHeight(): ?string
    {
        return $this->evaluate($this->columnManagerFormMaxHeight);
    }

    /**
     * @deprecated Use `getColumnManagerFormWidth()` instead.
     */
    public function getColumnToggleFormWidth(): ?string
    {
        return $this->getColumnManagerFormWidth();
    }

    public function getColumnManagerFormWidth(): Width | string | null
    {
        return $this->evaluate($this->columnManagerFormWidth) ?? match ($this->getColumnManagerFormColumns()) {
            2 => Width::TwoExtraLarge,
            3 => Width::FourExtraLarge,
            4 => Width::SixExtraLarge,
            default => null,
        };
    }

    /**
     * @deprecated Use `getColumnManagerTriggerAction()` instead.
     */
    public function getToggleColumnsTriggerAction(): Action
    {
        return $this->getColumnManagerTriggerAction();
    }

    public function getColumnManagerTriggerAction(): Action
    {
        $action = Action::make('openColumnManager')
            ->label(__('filament-tables::table.actions.column_manager.label'))
            ->iconButton()
            ->icon(FilamentIcon::resolve('tables::actions.column-manager') ?? Heroicon::ViewColumns)
            ->color('gray')
            ->livewireClickHandlerEnabled(false)
            ->table($this);

        if ($this->modifyColumnManagerTriggerActionUsing) {
            $action = $this->evaluate($this->modifyColumnManagerTriggerActionUsing, [
                'action' => $action,
            ]) ?? $action;
        }

        if ($action->getView() === Action::BUTTON_VIEW) {
            $action->defaultSize(Size::Small);
        }

        return $action;
    }

    public function getColumnManagerApplyAction(): Action
    {
        $action = Action::make('applyColumnManager')
            ->label(__('filament-tables::table.column_manager.actions.apply.label'))
            ->button()
            ->visible($this->hasDeferredColumnManager())
            ->alpineClickHandler('applyColumnManager')
            ->table($this);

        if ($this->modifyColumnManagerApplyActionUsing) {
            $action = $this->evaluate($this->modifyColumnManagerApplyActionUsing, [
                'action' => $action,
            ]) ?? $action;
        }

        return $action;
    }

    public function hasToggleableColumns(): bool
    {
        foreach ($this->getColumns() as $column) {
            if (! $column->isToggleable()) {
                continue;
            }

            return true;
        }

        return false;
    }
}
