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
            $columnManagerSessionKey = $this->getColumnManagerSessionKey();

            $this->columnManager = session()->get(
                $columnManagerSessionKey,
                $this->getDefaultColumnManagerState()
            );
        }

        $this->updatedColumnManager();
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
     * @deprecated Use the `updatedColumnManager()` method instead.
     */
    public function updatedToggledTableColumns(): void
    {
        $this->updatedColumnManager();
    }

    public function updatedColumnManager(): void
    {
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

        session()->put([
            $this->getColumnManagerSessionKey() => $this->columnManager,
        ]);
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
}
