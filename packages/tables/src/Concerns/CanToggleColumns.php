<?php

namespace Filament\Tables\Concerns;

use Filament\Schemas\Schema;
use Filament\Support\Components\Component;
use Filament\Tables\Columns\Column;
use Filament\Tables\Columns\ColumnGroup;

/**
 * @property-read Schema $toggleTableColumnForm
 */
trait CanToggleColumns
{
    public const GROUP = 'group';

    public const COLUMN = 'column';

    /**
     * @var array<array<string, mixed>>
     */
    public array $toggledTableColumns = [];

    public function initializeToggledTableColumns(): void
    {
        if ($this->getTable()->hasColumnsLayout()) {
            return;
        }

        if (filled($this->toggledTableColumns)) {
            return;
        }

        $toggledTableColumnsSessionKey = $this->getToggledTableColumnsSessionKey();

        $this->toggledTableColumns = session()->get(
            $toggledTableColumnsSessionKey,
            $this->getDefaultTableColumnToggleState()
        );

        $this->updatedToggledTableColumns();
    }

    /**
     * @return array<array<string, mixed>>
     */
    public function getDefaultTableColumnToggleState(): array
    {
        return collect($this->getTable()->getColumnsLayout())
            ->map(
                fn (Component $component) => $component instanceof ColumnGroup
                ? $this->mapColumnGroup($component)
                : $this->mapColumn($component)
            )
            ->toArray();
    }

    public function updatedToggledTableColumns(): void
    {
        $reorderedColumns = collect($this->toggledTableColumns)
            ->map(function (array $item) {
                if ($item['type'] === self::COLUMN) {
                    return $this->getTable()->getColumn($item['name']);
                }

                if ($item['type'] !== self::GROUP || ! isset($item['columns'])) {
                    return null;
                }

                $columns = collect($item['columns'])
                    ->map(fn (array $column) => $this->getTable()->getColumn($column['name']))
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
            $this->getToggledTableColumnsSessionKey() => $this->toggledTableColumns,
        ]);
    }

    public function isTableColumnToggledHidden(string $name): bool
    {
        foreach ($this->toggledTableColumns as $item) {
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

    public function getToggledTableColumnsSessionKey(): string
    {
        $table = md5($this::class);

        return "tables.{$table}_toggled_columns";
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
     * @return array{
     *     type: string,
     *     name: string,
     *     label: string,
     *     toggled: bool,
     *     toggleable: bool,
     *     columns: array<int, mixed>
     * }
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
                ->map(fn (Column $column) => $this->mapColumn($column))
                ->values()
                ->toArray(),
        ];
    }

    /**
     * @return array{
     *     type: string,
     *     name: string,
     *     label: string,
     *     toggled: bool,
     *     toggleable: bool
     * }
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
