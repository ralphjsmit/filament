<?php

namespace Filament\Resources\Pages;

use Closure;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\NestedSchema;
use Filament\Schemas\Schema;
use Filament\Support\Facades\FilamentIcon;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

/**
 * @property-read Schema $form
 */
class ViewRecord extends Page
{
    use Concerns\HasRelationManagers;
    use Concerns\InteractsWithRecord;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public static function getNavigationIcon(): string | Htmlable | null
    {
        return static::$navigationIcon
            ?? FilamentIcon::resolve('panels::resources.pages.view-record.navigation-item')
            ?? 'heroicon-o-eye';
    }

    public function getBreadcrumb(): string
    {
        return static::$breadcrumb ?? __('filament-panels::resources/pages/view-record.breadcrumb');
    }

    public function getContentTabLabel(): ?string
    {
        return __('filament-panels::resources/pages/view-record.content.tab.label');
    }

    public function mount(int | string $record): void
    {
        $this->record = $this->resolveRecord($record);

        $this->authorizeAccess();

        if (! $this->hasInfolist()) {
            $this->fillForm();
        }
    }

    protected function authorizeAccess(): void
    {
        abort_unless(static::getResource()::canView($this->getRecord()), 403);
    }

    protected function hasInfolist(): bool
    {
        return (bool) count($this->getSchema('infolist')->getComponents());
    }

    protected function fillForm(): void
    {
        /** @internal Read the DocBlock above the following method. */
        $this->fillFormWithDataAndCallHooks($this->getRecord());
    }

    /**
     * @internal Never override or call this method. If you completely override `fillForm()`, copy the contents of this method into your override.
     *
     * @param  array<string, mixed>  $extraData
     */
    protected function fillFormWithDataAndCallHooks(Model $record, array $extraData = []): void
    {
        $this->callHook('beforeFill');

        $data = $this->mutateFormDataBeforeFill([
            ...$record->attributesToArray(),
            ...$extraData,
        ]);

        $this->form->fill($data);

        $this->callHook('afterFill');
    }

    /**
     * @param  array<string>  $attributes
     */
    public function refreshFormData(array $attributes): void
    {
        $this->data = [
            ...$this->data,
            ...Arr::only($this->getRecord()->attributesToArray(), $attributes),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function mutateFormDataBeforeFill(array $data): array
    {
        return $data;
    }

    public function getDefaultActionSchemaResolver(Action $action): ?Closure
    {
        return match (true) {
            $action instanceof CreateAction, $action instanceof EditAction => fn (Schema $schema): Schema => static::getResource()::form($schema->columns(2)),
            $action instanceof ViewAction => fn (Schema $schema): Schema => $this->hasInfolist() ? $this->configureInfolist($schema) : $this->configureForm($schema),
            default => null,
        };
    }

    public function getTitle(): string | Htmlable
    {
        if (filled(static::$title)) {
            return static::$title;
        }

        return __('filament-panels::resources/pages/view-record.title', [
            'label' => $this->getRecordTitle(),
        ]);
    }

    public function form(Schema $form): Schema
    {
        return $form;
    }

    public function configureForm(Schema $form): Schema
    {
        $form->columns($this->hasInlineLabels() ? 1 : 2);
        $form->inlineLabel($this->hasInlineLabels());

        static::getResource()::form($form);

        $this->form($form);

        return $form;
    }

    public function configureInfolist(Schema $infolist): Schema
    {
        $infolist->columns($this->hasInlineLabels() ? 1 : 2);
        $infolist->inlineLabel($this->hasInlineLabels());

        static::getResource()::infolist($infolist);

        return $infolist;
    }

    /**
     * @return array<int | string, string | Schema>
     */
    protected function getForms(): array
    {
        return [
            'form' => $this->configureForm(
                $this->makeSchema()
                    ->operation('view')
                    ->disabled()
                    ->model($this->getRecord())
                    ->statePath($this->getFormStatePath()),
            ),
        ];
    }

    public function getFormStatePath(): ?string
    {
        return 'data';
    }

    public function infolist(): Schema
    {
        return $this->configureInfolist(
            $this->makeSchema()
                ->record($this->getRecord()),
        );
    }

    public static function shouldRegisterNavigation(array $parameters = []): bool
    {
        return parent::shouldRegisterNavigation($parameters) && static::getResource()::canView($parameters['record']);
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                ...($this->hasCombinedRelationManagerTabsWithContent() ? [] : $this->getContentComponents()),
                $this->getRelationManagersContentComponent(),
            ]);
    }

    /**
     * @return array<Component>
     */
    public function getContentComponents(): array
    {
        return [
            $this->hasInfolist()
                ? $this->getInfolistContentComponent()
                : $this->getFormContentComponent(),
        ];
    }

    public function getFormContentComponent(): Component
    {
        return NestedSchema::make('form');
    }

    public function getInfolistContentComponent(): Component
    {
        return NestedSchema::make('infolist');
    }

    /**
     * @return array<string>
     */
    public function getPageClasses(): array
    {
        return [
            'fi-resource-view-record-page',
            'fi-resource-' . str_replace('/', '-', $this->getResource()::getSlug()),
            "fi-resource-record-{$this->getRecord()->getKey()}",
        ];
    }
}
