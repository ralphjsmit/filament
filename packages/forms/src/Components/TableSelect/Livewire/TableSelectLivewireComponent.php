<?php

namespace Filament\Forms\Components\TableSelect\Livewire;

use Exception;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Support\Services\RelationshipJoiner;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Livewire\Attributes\Locked;
use Livewire\Attributes\Modelable;
use Livewire\Component;
use Livewire\WithoutUrlPagination;

class TableSelectLivewireComponent extends Component implements HasActions, HasForms, HasTable
{
    use InteractsWithActions;
    use InteractsWithForms;
    use InteractsWithTable;
    use WithoutUrlPagination;

    #[Locked]
    public ?string $model = null;

    #[Locked]
    public ?Model $record = null;

    #[Locked]
    public ?string $relationshipName = null;

    #[Locked]
    public string $tableConfiguration;

    /**
     * @var string | array<string> | null
     */
    #[Modelable]
    public string | array | null $state = null;

    public function table(Table $table): Table
    {
        $tableConfiguration = base64_decode($this->tableConfiguration);

        if (! class_exists($tableConfiguration)) {
            throw new Exception("Table configuration class [{$tableConfiguration}] does not exist.");
        }

        if (! method_exists($tableConfiguration, 'configure')) {
            throw new Exception("Table configuration class [{$tableConfiguration}] does not have a [configure(Table \$table): Table] method.");
        }

        if (filled($this->relationshipName)) {
            $record = $this->record ??= app($this->model);

            $table->query(function () use ($record): Builder {
                $relationship = Relation::noConstraints(fn () => $record->{$this->relationshipName}());

                return app(RelationshipJoiner::class)->prepareQueryForNoConstraints($relationship);
            });
        }

        return $tableConfiguration::configure($table)
            ->selectable()
            ->trackDeselectedRecords(false)
            ->currentSelectionLivewireProperty('state')
            ->multipleRecordsSelectable(is_array($this->state))
            ->deselectAllRecordsWhenFiltered(false);
    }

    public function render(): string
    {
        return '{{ $this->table }}';
    }
}
