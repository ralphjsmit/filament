<?php

namespace Filament\Tables\Columns;

use BackedEnum;
use Closure;
use Filament\Forms\Components\Concerns\CanDisableOptions;
use Filament\Forms\Components\Concerns\CanSelectPlaceholder;
use Filament\Forms\Components\Concerns\HasEnum;
use Filament\Forms\Components\Concerns\HasExtraInputAttributes;
use Filament\Forms\Components\Concerns\HasOptions;
use Filament\Forms\Components\Select;
use Filament\Support\Components\Attributes\ExposedLivewireMethod;
use Filament\Support\Components\Contracts\HasEmbeddedView;
use Filament\Support\Facades\FilamentAsset;
use Filament\Tables\Columns\Contracts\Editable;
use Filament\Tables\Table;
use Illuminate\Contracts\Support\Arrayable;
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

    protected ?Closure $transformOptionsForJsUsing = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->disabledClick();

        $this->placeholder(__('filament-forms::components.select.placeholder'));

        $this->transformOptionsForJsUsing(static function (SelectColumn $column, array $options): array {
            return collect($options)
                ->map(fn ($label, $value): array => is_array($label)
                    ? ['label' => $value, 'options' => $column->transformOptionsForJs($label)]
                    : ['label' => $label, 'value' => strval($value), 'isDisabled' => $column->isOptionDisabled($value, $label)])
                ->values()
                ->all();
        });
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

    public function toEmbeddedHtml(): string
    {
        $isDisabled = $this->isDisabled();
        $isNative = ! $this->isSelectSearchable() && $this->isNative();
        $state = $this->getState();

        $attributes = $this->getExtraAttributeBag()
            ->merge([
                'x-load' => true,
                'x-load-src' => FilamentAsset::getAlpineComponentSrc('columns/select', 'filament/tables'),
                'x-data' => 'selectTableColumn({
                    canSelectPlaceholder: ' . Js::from($this->canSelectPlaceholder()) . ',
                    isNative: ' . Js::from($isNative) . ',
                    isSearchable: ' . Js::from($this->isSelectSearchable()) . ',
                    name: ' . Js::from($this->getName()) . ',
                    options: ' . Js::from($this->getOptionsForJs()) . ',
                    placeholder: ' . Js::from($this->getPlaceholder()) . ',
                    recordKey: ' . Js::from($this->getRecordKey()) . ',
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
                        <?php if ($this->canSelectPlaceholder()) { ?>
                            <option value=""><?= $this->getPlaceholder() ?></option>
                        <?php } ?>

                        <?php foreach ($this->getOptions() as $value => $label) { ?>
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
