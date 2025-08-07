<?php

namespace Filament\Tables\Columns;

use BackedEnum;
use Closure;
use Filament\Forms\Components\Concerns\CanDisableOptions;
use Filament\Forms\Components\Concerns\CanSelectPlaceholder;
use Filament\Forms\Components\Concerns\HasEnum;
use Filament\Forms\Components\Concerns\HasExtraInputAttributes;
use Filament\Forms\Components\Concerns\HasOptions;
use Filament\Support\Components\Attributes\ExposedLivewireMethod;
use Filament\Support\Components\Contracts\HasEmbeddedView;
use Filament\Support\Facades\FilamentAsset;
use Filament\Tables\Columns\Contracts\Editable;
use Filament\Tables\Table;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Js;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Livewire\Attributes\Renderless;

class SelectColumn extends Column implements Editable, HasEmbeddedView
{
    use CanDisableOptions;
    use CanSelectPlaceholder;
    use Concerns\CanBeValidated {
        getRules as getBaseRules;
    }
    use Concerns\CanUpdateState;
    use HasEnum;
    use HasExtraInputAttributes;
    use HasOptions;

    protected bool | Closure $isNative = true;

    protected bool | Closure $isSelectSearchable = false;

    protected string | Htmlable | Closure | null $noSearchResultsMessage = null;

    protected int | Closure $searchDebounce = 1000;

    protected string | Closure | null $searchingMessage = null;

    protected string | Htmlable | Closure | null $searchPrompt = null;

    protected ?Closure $getOptionLabelUsing = null;

    protected ?Closure $getOptionLabelsUsing = null;

    protected ?Closure $getSearchResultsUsing = null;

    protected bool | Closure $shouldSearchLabels = true;

    protected bool | Closure $shouldSearchValues = false;

    protected ?Closure $transformOptionsForJsUsing = null;

    protected string | Closure | null $loadingMessage = null;

    protected bool | Closure $canOptionLabelsWrap = true;

    protected bool | Closure $isHtmlAllowed = false;

    protected int | Closure $optionsLimit = 50;

    protected string | Closure | null $position = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->disabledClick();

        $this->placeholder(__('filament-tables::table.columns.select.placeholder'));

        $this->transformOptionsForJsUsing(static function (SelectColumn $column, array $options): array {
            return collect($options)
                ->map(fn ($label, $value): array => is_array($label)
                    ? ['label' => $value, 'options' => $column->transformOptionsForJs($label)]
                    : ['label' => $label, 'value' => strval($value), 'isDisabled' => $column->isOptionDisabled($value, $label)])
                ->values()
                ->all();
        });
    }

    public function loadingMessage(string | Closure | null $message): static
    {
        $this->loadingMessage = $message;

        return $this;
    }

    public function getLoadingMessage(): string
    {
        return $this->evaluate($this->loadingMessage) ?? __('filament-forms::components.select.loading_message');
    }

    /**
     * @return array<array-key>
     */
    public function getRules(): array
    {
        return [
            ...$this->getBaseRules(),
            (filled($enum = $this->getEnum()) ?
                new Enum($enum) :
                Rule::in(array_keys($this->getEnabledOptions()))),
        ];
    }

    public function getOptionLabelUsing(?Closure $callback): static
    {
        $this->getOptionLabelUsing = $callback;

        return $this;
    }

    public function getSearchResultsUsing(?Closure $callback): static
    {
        $this->getSearchResultsUsing = $callback;

        return $this;
    }

    public function native(bool | Closure $condition = true): static
    {
        $this->isNative = $condition;

        return $this;
    }

    public function isNative(): bool
    {
        return (bool) $this->evaluate($this->isNative);
    }

    public function searchableSelect(bool | Closure $condition = true): static
    {
        $this->isSelectSearchable = $condition;

        return $this;
    }

    public function isSelectSearchable(): bool
    {
        return (bool) $this->evaluate($this->isSelectSearchable);
    }

    public function noSearchResultsMessage(string | Htmlable | Closure | null $message): static
    {
        $this->noSearchResultsMessage = $message;

        return $this;
    }

    public function searchDebounce(int | Closure $debounce): static
    {
        $this->searchDebounce = $debounce;

        return $this;
    }

    public function searchingMessage(string | Closure | null $message): static
    {
        $this->searchingMessage = $message;

        return $this;
    }

    public function searchPrompt(string | Htmlable | Closure | null $message): static
    {
        $this->searchPrompt = $message;

        return $this;
    }

    public function searchLabels(bool | Closure | null $condition = true): static
    {
        $this->shouldSearchLabels = $condition;

        return $this;
    }

    public function searchValues(bool | Closure | null $condition = true): static
    {
        $this->shouldSearchValues = $condition;

        return $this;
    }

    public function getNoSearchResultsMessage(): string | Htmlable
    {
        return $this->evaluate($this->noSearchResultsMessage) ?? __('filament-tables::table.columns.select.no_search_results_message');
    }

    public function getSearchPrompt(): string | Htmlable
    {
        return $this->evaluate($this->searchPrompt) ?? __('filament-tables::table.columns.select.search_prompt');
    }

    public function shouldSearchLabels(): bool
    {
        return (bool) $this->evaluate($this->shouldSearchLabels);
    }

    public function shouldSearchValues(): bool
    {
        return (bool) $this->evaluate($this->shouldSearchValues);
    }

    /**
     * @return array<string>
     */
    public function getSearchableOptionFields(): array
    {
        return [
            ...($this->shouldSearchLabels() ? ['label'] : []),
            ...($this->shouldSearchValues() ? ['value'] : []),
        ];
    }

    public function getSearchDebounce(): int
    {
        return $this->evaluate($this->searchDebounce);
    }

    public function wrapOptionLabels(bool | Closure $condition = true): static
    {
        $this->canOptionLabelsWrap = $condition;

        return $this;
    }

    public function canOptionLabelsWrap(): bool
    {
        return (bool) $this->evaluate($this->canOptionLabelsWrap);
    }

    public function getSearchingMessage(): string
    {
        return $this->evaluate($this->searchingMessage) ?? __('filament-tables::table.columns.select.searching_message');
    }

    public function allowHtml(bool | Closure $condition = true): static
    {
        $this->isHtmlAllowed = $condition;

        return $this;
    }

    public function isHtmlAllowed(): bool
    {
        return (bool) $this->evaluate($this->isHtmlAllowed);
    }

    public function optionsLimit(int | Closure $limit): static
    {
        $this->optionsLimit = $limit;

        return $this;
    }

    public function getOptionsLimit(): int
    {
        return $this->evaluate($this->optionsLimit);
    }

    public function position(string | Closure | null $position): static
    {
        $this->position = $position;

        return $this;
    }

    public function getPosition(): ?string
    {
        return $this->evaluate($this->position);
    }

    /**
     * @return array<array{'label': string, 'value': string}>
     */
    #[ExposedLivewireMethod]
    #[Renderless]
    public function getOptionsForJs(): array
    {
        return $this->transformOptionsForJs($this->getOptions());
    }

    public function transformOptionsForJsUsing(?Closure $callback): static
    {
        $this->transformOptionsForJsUsing = $callback;

        return $this;
    }

    #[ExposedLivewireMethod]
    #[Renderless]
    public function getOptionLabel(bool $withDefault = true): ?string
    {
        if (! $this->getOptionLabelUsing) {
            $state = $this->getState();
            $options = $this->getOptions();

            if ($state instanceof BackedEnum) {
                $state = $state->value;
            }

            foreach ($options as $groupedOptions) {
                if (! is_array($groupedOptions)) {
                    continue;
                }

                if (blank($groupedOptions[$state] ?? null)) {
                    continue;
                }

                return $groupedOptions[$state];
            }

            if (filled($options[$state] ?? null) && (! is_array($options[$state]))) {
                return $options[$state];
            }

            if ($withDefault) {
                return $state;
            }

            return null;
        }

        $state = null;

        $label = $this->evaluate($this->getOptionLabelUsing, [
            'value' => function () use (&$state): mixed {
                return $state = $this->getState();
            },
        ]);

        if ($withDefault) {
            $label ??= ($state ?? $this->getState());
        }

        return $label;
    }

    /**
     * @return array<string>
     */
    public function getSearchResults(string $search): array
    {
        if (! $this->getSearchResultsUsing) {
            return [];
        }

        $results = $this->evaluate($this->getSearchResultsUsing, [
            'query' => $search,
            'search' => $search,
            'searchQuery' => $search,
        ]);

        if ($results instanceof Arrayable) {
            $results = $results->toArray();
        }

        return $results;
    }

    /**
     * @return array<array{'label': string, 'value': string}>
     */
    #[ExposedLivewireMethod]
    #[Renderless]
    public function getSearchResultsForJs(string $search): array
    {
        return $this->transformOptionsForJs($this->getSearchResults($search));
    }

    /**
     * @param  array<string | array<string>>  $options
     * @return array<array<string, mixed>>
     */
    protected function transformOptionsForJs(array $options): array
    {
        if (empty($options)) {
            return [];
        }

        $transformedOptions = $this->evaluate($this->transformOptionsForJsUsing, [
            'options' => $options,
        ]);

        if ($transformedOptions instanceof Arrayable) {
            return $transformedOptions->toArray();
        }

        return $transformedOptions;
    }

    public function hasDynamicOptions(): bool
    {
        if ($this->hasDynamicDisabledOptions()) {
            return true;
        }

        return $this->options instanceof Closure;
    }

    public function hasDynamicSearchResults(): bool
    {
        return $this->getSearchResultsUsing instanceof Closure;
    }

    public function toEmbeddedHtml(): string
    {
        $canSelectPlaceholder = $this->canSelectPlaceholder();
        $isDisabled = $this->isDisabled();
        $isNative = ! $this->isSelectSearchable() && $this->isNative();
        $name = $this->getName();
        $options = $this->getOptions();
        $placeholder = $this->getPlaceholder();
        $recordKey = $this->getRecordKey();
        $state = $this->getState();

        $attributes = $this->getExtraAttributeBag()
            ->merge([
                'x-load' => true,
                'x-load-src' => FilamentAsset::getAlpineComponentSrc('columns/select', 'filament/tables'),
                'x-data' => 'selectTableColumn({
                    canOptionLabelsWrap: ' . Js::from($this->canOptionLabelsWrap()) . ',
                    canSelectPlaceholder: ' . Js::from($canSelectPlaceholder) . ',
                    getOptionLabelUsing: async () => {
                        return await $wire.callTableColumnMethod(' . Js::from($name) . ', ' . Js::from($recordKey) . ', \'getOptionLabel\')
                    },
                    getOptionsUsing: async () => {
                        return await $wire.callTableColumnMethod(
                            ' . Js::from($name) . ',
                            ' . Js::from($recordKey) . ',
                            \'getOptionsForJs\',
                        )
                    },
                    getSearchResultsUsing: async (search) => {
                        return await $wire.callTableColumnMethod(
                            ' . Js::from($name) . ',
                            ' . Js::from($recordKey) . ',
                            \'getSearchResultsForJs\',
                            { search },
                        )
                    },
                    hasDynamicOptions: ' . Js::from($this->hasDynamicOptions()) . ',
                    hasDynamicSearchResults: ' . Js::from($this->hasDynamicSearchResults()) . ',
                    initialOptionLabel: ' . Js::from($this->getOptionLabel()) . ',
                    isDisabled: ' . Js::from($isDisabled) . ',
                    isHtmlAllowed: ' . Js::from($this->isHtmlAllowed()) . ',
                    isNative: ' . Js::from($isNative) . ',
                    isSearchable: ' . Js::from($this->isSelectSearchable()) . ',
                    loadingMessage: ' . Js::from($this->getLoadingMessage()) . ',
                    name: ' . Js::from($name) . ',
                    noSearchResultsMessage: ' . Js::from($this->getNoSearchResultsMessage()) . ',
                    options: ' . Js::from($isNative ? [] : $this->getOptionsForJs()) . ',
                    optionsLimit: ' . Js::from($this->getOptionsLimit()) . ',
                    placeholder: ' . Js::from($placeholder) . ',
                    position: ' . Js::from($this->getPosition()) . ',
                    recordKey: ' . Js::from($recordKey) . ',
                    searchableOptionFields: ' . Js::from($this->getSearchableOptionFields()) . ',
                    searchDebounce: ' . Js::from($this->getSearchDebounce()) . ',
                    searchingMessage: ' . Js::from($this->getSearchingMessage()) . ',
                    searchPrompt: ' . Js::from($this->getSearchPrompt()) . ',
                    state: ' . Js::from($state) . ',
                })',
            ], escape: false)
            ->class([
                'fi-ta-select',
                'fi-inline' => $this->isInline(),
            ]);

        $inputAttributes = $this->getExtraInputAttributeBag()
            ->merge([
                'disabled' => $isDisabled,
                'wire:loading.attr' => 'disabled',
                'wire:target' => implode(',', Table::LOADING_TARGETS),
                'x-bind:disabled' => $isDisabled ? null : 'isLoading',
                'x-tooltip' => filled($tooltip = $this->getTooltip($state))
                    ? '{
                        content: ' . Js::from($tooltip) . ',
                        theme: $store.theme,
                    }'
                    : null,
            ], escape: false)
            ->class([
                'fi-select-input',
            ]);

        ob_start(); ?>

        <div
            wire:ignore.self
            <?= $attributes->toHtml() ?>
        >
            <input type="hidden" value="<?= str(($state instanceof BackedEnum) ? $state->value : $state)->replace('"', '\\"') ?>" x-ref="serverState" />

            <div
                x-bind:class="{
                    'fi-disabled': isLoading || <?= Js::from($isDisabled) ?>,
                    'fi-invalid': error !== undefined,
                }"
                x-tooltip="
                    error === undefined
                        ? false
                        : {
                            content: error,
                            theme: $store.theme,
                        }
                "
                x-on:click.prevent.stop=""
                <?php if (! $isNative) { ?>
                    wire:ignore
                    x-on:keydown.esc="select.dropdown.isActive && $event.stopPropagation()"
                <?php } ?>
                class="fi-input-wrp"
            >
                <?php if ($isNative) { ?>
                    <select
                        x-model="state"
                        <?= $inputAttributes->toHtml() ?>
                    >
                        <?php if ($canSelectPlaceholder) { ?>
                            <option value=""><?= $placeholder ?></option>
                        <?php } ?>

                        <?php foreach ($options as $value => $label) { ?>
                            <option
                                <?= $this->isOptionDisabled($value, $label) ? 'disabled' : null ?>
                                value="<?= $value ?>"
                            >
                                <?= $label ?>
                            </option>
                        <?php } ?>
                    </select>
                <?php } else { ?>
                    <div class="fi-select-input">
                        <div x-ref="select"></div>
                    </div>
                <?php } ?>
            </div>
        </div>

        <?php return ob_get_clean();
    }
}
