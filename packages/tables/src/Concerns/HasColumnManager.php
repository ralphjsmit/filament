<?php

namespace Filament\Tables\Concerns;

use Filament\Schemas\Schema;
use Filament\Support\Components\Component;
use Filament\Tables\Columns\Column;
use Filament\Tables\Columns\ColumnGroup;
use Illuminate\Support\Collection;

/**
 * @property-read Schema $toggleTableColumnForm
 */
trait HasColumnManager
{
    public const GROUP = 'group';

    public const COLUMN = 'column';

    protected ?string $tableConfigurationHashCache = null;

    protected ?string $columnManagerConfigurationHashCache = null;

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
            $this->columnManager = $this->resolveColumnManagerState();
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
     * @deprecated Use the `applyColumnManager()` method instead.
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

        $storedHash = session()->get($this->getTableConfigurationHashSessionKey());

        if (
            $storedHash &&
            $storedHash !== $this->generateColumnManagerConfigurationHash()
        ) {
            $this->columnManager = $this->getDefaultColumnManagerState();
        }

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
     * @deprecated Use the `getColumnManagerSessionKey()` method instead.
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

    public function getTableConfigurationHashSessionKey(): string
    {
        $table = md5($this::class);

        return "tables.{$table}_table_configuration_hash";
    }

    protected function resolveColumnManagerState(): array
    {
        $currentHash = $this->generateTableConfigurationHash();
        $storedHash = session()->get($this->getTableConfigurationHashSessionKey());

        $this->persistTableConfigurationHash($currentHash);

        if (
            $storedHash &&
            ($storedHash !== $currentHash)
        ) {
            return $this->getDefaultColumnManagerState();
        }

        return $this->loadColumnManagerFromSession();
    }

    protected function persistColumnManager(): void
    {
        session()->put(
            $this->getColumnManagerSessionKey(),
            $this->columnManager
        );
    }

    protected function persistTableConfigurationHash(string $hash): void
    {
        session()->put(
            $this->getTableConfigurationHashSessionKey(),
            $hash,
        );
    }

    protected function loadColumnManagerFromSession(): array
    {
        return session()->get(
            $this->getColumnManagerSessionKey(),
            $this->getDefaultColumnManagerState()
        );
    }

    protected function generateTableConfigurationHash(): string
    {
        return $this->tableConfigurationHashCache ??= $this->generateHash(
            collect($this->getTable()->getColumnsLayout())
                ->map(fn (Component $component): ?array => match (true) {
                    $component instanceof ColumnGroup => $this->mapColumnGroupForHash($component),
                    $component instanceof Column => $this->mapColumnForHash($component),
                    default => null,
                })
        );
    }

    protected function generateColumnManagerConfigurationHash(): string
    {
        return $this->columnManagerConfigurationHashCache ??= $this->generateHash(
            collect($this->columnManager)
                ->map(fn (array $item): ?array => match (true) {
                    $item['type'] === self::GROUP => $this->mapColumnGroupArrayForHash($item),
                    $item['type'] === self::COLUMN => $this->mapColumnArrayForHash($item),
                    default => null,
                })
        );
    }

    protected function generateHash(Collection $configuration): string
    {
        return md5($configuration->filter()->sort()->values()->toJson());
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
     * @return array{type: string, name: string, label: string, toggleable: bool, columns: array<int, array{type: string, name: string, label: string, toggleable: bool}>}
     */
    protected function mapColumnGroupForHash(ColumnGroup $group): array
    {
        return [
            'type' => self::GROUP,
            'name' => $group->getLabel(),
            'label' => $group->getLabel(),
            'toggleable' => true,
            'columns' => collect($group->getColumns())
                ->map(fn (Column $column): array => $this->mapColumnForHash($column))
                ->sort()
                ->values()
                ->toArray(),
        ];
    }

    /**
     * @param  array{name: string, label: string, columns?: array<int, array{name: string, label: string, toggleable: bool}>}  $group
     * @return array{type: string, name: string, label: string, toggleable: bool, columns: array<int, array{type: string, name: string, label: string, toggleable: bool}>}
     */
    protected function mapColumnGroupArrayForHash(array $group): array
    {
        return [
            'type' => self::GROUP,
            'name' => $group['name'],
            'label' => $group['label'],
            'toggleable' => true,
            'columns' => collect($group['columns'] ?? [])
                ->map(fn (array $column): array => $this->mapColumnArrayForHash($column))
                ->sort()
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

    /**
     * @return array{type: string, name: string, label: string, toggleable: bool}
     */
    protected function mapColumnForHash(Column $column): array
    {
        return [
            'type' => self::COLUMN,
            'name' => $column->getName(),
            'label' => $column->getLabel(),
            'toggleable' => $column->isToggleable(),
        ];
    }

    /**
     * @param  array{name: string, label: string, toggleable: bool}  $column
     * @return array{type: string, name: string, label: string, toggleable: bool}
     */
    protected function mapColumnArrayForHash(array $column): array
    {
        return [
            'type' => self::COLUMN,
            'name' => $column['name'],
            'label' => $column['label'],
            'toggleable' => $column['toggleable'],
        ];
    }
}
