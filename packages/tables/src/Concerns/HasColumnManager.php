<?php

namespace Filament\Tables\Concerns;

use Filament\Schemas\Schema;
use Filament\Support\Components\Component;
use Filament\Tables\Columns\Column;
use Filament\Tables\Columns\ColumnGroup;

/**
 * @property-read Schema $toggleTableColumnForm
 */
trait HasColumnManager
{
    public const GROUP = 'group';

    public const COLUMN = 'column';

    /**
     * @var array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}>
     */
    public array $columnManager = [];

    public function initializeColumnManager(): void
    {
        if ($this->getTable()->hasColumnsLayout()) {
            return;
        }

        if (blank($this->columnManager)) {
            $this->columnManager = $this->loadColumnManagerFromSession();
        }

        $this->applyColumnManager();
    }

    /**
     * @return array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}>
     */
    public function getDefaultColumnManagerState(): array
    {
        return collect($this->getTable()->getColumnsLayout())
            ->map(fn (Component $component): ?array => match (true) {
                $component instanceof ColumnGroup => $this->mapColumnGroup($component),
                $component instanceof Column => $this->mapColumn($component),
                default => null,
            })
            ->filter()
            ->values()
            ->toArray();
    }

    /**
     * @deprecated Use `applyColumnManager()` instead.
     */
    public function updatedToggledTableColumns(): void
    {
        $this->applyColumnManager();
    }

    /**
     * @param  array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}>|null  $columnManager
     */
    public function applyColumnManager(?array $columnManager = null): void
    {
        if (filled($columnManager)) {
            $this->columnManager = $columnManager;
        }

        $this->syncColumnManagerWithDefaultState();

        $reorderedColumns = collect($this->columnManager)
            ->map(function (array $item): Column | ColumnGroup | null {
                if ($item['type'] === self::COLUMN) {
                    return $this->getTable()->getColumn($item['name']);
                }

                if ($item['type'] !== self::GROUP || ! isset($item['columns'])) {
                    return null;
                }

                $columns = collect($item['columns'])
                    ->map(fn (array $column): ?Column => $this->getTable()->getColumn($column['name']))
                    ->filter()
                    ->toArray();

                if (empty($columns)) {
                    return null;
                }

                return $this->getTable()
                    ->getColumnGroup($item['name'])
                    ->columns($columns);
            })
            ->filter()
            ->toArray();

        $this->getTable()->columns($reorderedColumns);

        $this->persistColumnManager();
    }

    public function isTableColumnToggledHidden(string $name): bool
    {
        foreach ($this->columnManager as $item) {
            if ($item['type'] === self::COLUMN && $item['name'] === $name) {
                return ! $item['toggled'];
            }

            if ($item['type'] === self::GROUP && isset($item['columns'])) {
                foreach ($item['columns'] as $column) {
                    if ($column['name'] === $name) {
                        return ! $column['toggled'];
                    }
                }
            }
        }

        return true;
    }

    /**
     * @deprecated Use `getColumnManagerSessionKey()` instead.
     */
    protected function getToggledTableColumnsSessionKey(): string
    {
        return $this->getColumnManagerSessionKey();
    }

    public function getColumnManagerSessionKey(): string
    {
        $table = md5($this::class);

        return "tables.{$table}_column_manager";
    }

    /**
     * @return array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}>
     */
    protected function loadColumnManagerFromSession(): array
    {
        return session()->get(
            $this->getColumnManagerSessionKey(),
            $this->getDefaultColumnManagerState()
        );
    }

    protected function persistColumnManager(): void
    {
        session()->put(
            $this->getColumnManagerSessionKey(),
            $this->columnManager
        );
    }

    /**
     * @deprecated Override the `table()` method to configure the table.
     *
     * @return int | array<string, int | null>
     */
    protected function getTableColumnToggleFormColumns(): int | array
    {
        return 1;
    }

    /**
     * @deprecated Override the `table()` method to configure the table.
     */
    protected function getTableColumnToggleFormWidth(): ?string
    {
        return null;
    }

    /**
     * @deprecated Override the `table()` method to configure the table.
     */
    protected function getTableColumnToggleFormMaxHeight(): ?string
    {
        return null;
    }

    /**
     * @return array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}
     */
    protected function mapColumnGroup(ColumnGroup $group): array
    {
        return [
            'type' => self::GROUP,
            'name' => $group->getLabel(),
            'label' => $group->getLabel(),
            'toggled' => true,
            'toggleable' => true,
            'columns' => collect($group->getColumns())
                ->map(fn (Column $column): array => $this->mapColumn($column))
                ->values()
                ->toArray(),
        ];
    }

    /**
     * @return array{type: string, name: string, label: string, toggled: bool, toggleable: bool}
     */
    protected function mapColumn(Column $column): array
    {
        return [
            'type' => self::COLUMN,
            'name' => $column->getName(),
            'label' => $column->getLabel(),
            'toggled' => ! $column->isToggleable() || ! $column->isToggledHiddenByDefault(),
            'toggleable' => $column->isToggleable(),
        ];
    }

    protected function syncColumnManagerWithDefaultState(): void
    {
        $defaultState = $this->getDefaultColumnManagerState();

        $this->columnManager = collect($this->columnManager)
            ->map(fn (array $item) => $this->syncExistingItem($item, $defaultState))
            ->filter()
            ->values()
            ->merge($this->getNewItems($defaultState))
            ->toArray();
    }

    /**
     * @param  array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}  $item
     * @param  array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}>  $defaultState
     * @return array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}|null
     */
    protected function syncExistingItem(array $item, array $defaultState): ?array
    {
        $matchingDefault = $this->findMatchingItem($item, $defaultState);

        if ($matchingDefault === null) {
            return null;
        }

        $item = $this->applyDefaultState($item, $matchingDefault);

        if ($item['type'] !== self::GROUP || ! isset($item['columns'])) {
            return $item;
        }

        $item['columns'] = $this->syncGroupColumns(
            $item['columns'],
            $matchingDefault['columns'] ?? []
        );

        if (empty($item['columns'])) {
            return null;
        }

        return $item;
    }

    /**
     * @param  array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>  $existingColumns
     * @param  array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>  $defaultColumns
     * @return array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>
     */
    protected function syncGroupColumns(array $existingColumns, array $defaultColumns): array
    {
        $updatedColumns = collect($existingColumns)
            ->map(function (array $column) use ($defaultColumns): ?array {
                $matchingDefault = $this->findMatchingItem($column, $defaultColumns);

                if ($matchingDefault === null) {
                    return null;
                }

                return $this->applyDefaultState($column, $matchingDefault);
            })
            ->filter()
            ->values();

        $existingNames = $updatedColumns
            ->pluck('name')
            ->toArray();

        $newColumnsToAdd = collect($defaultColumns)
            ->reject(fn (array $column) => in_array($column['name'], $existingNames))
            ->values();

        return $updatedColumns
            ->merge($newColumnsToAdd)
            ->toArray();
    }

    /**
     * @param  array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}  $item
     * @param  array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}  $default
     * @return array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}
     */
    protected function applyDefaultState(array $item, array $default): array
    {
        $item['label'] = $default['label'];
        $item['toggleable'] = $default['toggleable'];

        if (! $item['toggleable']) {
            $item['toggled'] = true;
        }

        return $item;
    }

    /**
     * @param  array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}>  $defaultState
     * @return array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}>
     */
    protected function getNewItems(array $defaultState): array
    {
        $existingKeys = collect($this->columnManager)
            ->map(fn (array $item) => $item['type'] . ':' . $item['name'])
            ->toArray();

        return collect($defaultState)
            ->reject(fn (array $item) => in_array($item['type'] . ':' . $item['name'], $existingKeys))
            ->values()
            ->toArray();
    }

    /**
     * @param  array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}  $item
     * @param  array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}>  $items
     * @return array{type: string, name: string, label: string, toggled: bool, toggleable: bool, columns?: array<int, array{type: string, name: string, label: string, toggled: bool, toggleable: bool}>}|null
     */
    protected function findMatchingItem(array $item, array $items): ?array
    {
        return collect($items)
            ->first(
                fn (array $candidate) => $candidate['type'] === $item['type'] &&
                $candidate['name'] === $item['name']
            );
    }
}
