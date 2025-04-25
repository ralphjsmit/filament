<?php

namespace Filament\Forms\Components;

use Closure;
use Filament\Forms\Components\Concerns\HasNestedRecursiveValidationRules;
use Filament\Forms\Components\Concerns\HasStep;
use Filament\Forms\Components\Slider\Enums\Behavior;
use Filament\Forms\Components\Slider\Enums\PipsMode;
use Filament\Schemas\Components\StateCasts\Contracts\StateCast;
use Filament\Schemas\Components\StateCasts\SliderStateCast;
use Filament\Support\Concerns\HasExtraAlpineAttributes;
use Filament\Support\RawJs;
use Illuminate\Support\Arr;

class Slider extends Field implements Contracts\HasNestedRecursiveValidationRules
{
    use HasExtraAlpineAttributes;
    use HasNestedRecursiveValidationRules;
    use HasStep;

    /**
     * @var view-string
     */
    protected string $view = 'filament-forms::components.slider';

    protected int | float | Closure $minValue = 0;

    protected int | float | Closure $maxValue = 100;

    protected int | Closure | null $margin = null;

    protected int | Closure | null $limit = null;

    /**
     * @var int | array<int> | Closure | null
     */
    protected int | array | Closure | null $padding = null;

    /**
     * @var array<bool> | Closure | null
     */
    protected array | Closure | null $fill = null;

    protected bool | Closure $isVertical = false;

    protected bool | Closure | null $isRtl = null;

    /**
     * @var Behavior | array<Behavior> | Closure | null
     */
    protected Behavior | array | Closure | null $behavior = null;

    /**
     * @var bool | RawJs | array<bool | RawJs> | Closure
     */
    protected bool | RawJs | array | Closure $tooltips = false;

    protected PipsMode | Closure | null $pipsMode = null;

    protected int | Closure | null $pipsDensity = null;

    protected RawJs | Closure | null $pipsFormatter = null;

    /**
     * @var int | float | array<int | float> | Closure | null
     */
    protected int | float | array | Closure | null $pipsValues = null;

    protected bool | Closure $arePipsStepped = false;

    protected RawJs | Closure | null $pipsFilter = null;

    /**
     * @var array<string, int | float> | Closure | null
     */
    protected array | Closure | null $nonLinearPoints = null;

    protected int | Closure | null $decimalPlaces = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->default(fn (Slider $component): float | int => $component->getMinValue());

        $this->rule('numeric', static fn (Slider $component): bool => ! $component->isMultiple());

        $this->rule(static function (Slider $component): string {
            $value = $component->getMinValue();

            return "min:{$value}";
        }, static fn (Slider $component): bool => ! $component->isMultiple());

        $this->rule(static function (Slider $component): string {
            $value = $component->getMaxValue();

            return "max:{$value}";
        }, static fn (Slider $component): bool => ! $component->isMultiple());

        $this->rule(static function (Slider $component): string {
            $step = $component->getStep();

            if ($step === 1) {
                return 'integer';
            }

            return "multiple_of:{$step}";
        }, static fn (Slider $component): bool => (! $component->isMultiple()) && filled($component->getStep()));

        $this->rule('array', static fn (Slider $component): bool => $component->isMultiple());

        $this->nestedRecursiveRule('numeric', static fn (Slider $component): bool => $component->isMultiple());

        $this->nestedRecursiveRule(static function (Slider $component): string {
            $value = $component->getMinValue();

            return "min:{$value}";
        }, static fn (Slider $component): bool => $component->isMultiple());

        $this->nestedRecursiveRule(static function (Slider $component): string {
            $value = $component->getMaxValue();

            return "max:{$value}";
        }, static fn (Slider $component): bool => $component->isMultiple());

        $this->nestedRecursiveRule(static function (Slider $component): string {
            $step = $component->getStep();

            if ($step === 1) {
                return 'integer';
            }

            return "multiple_of:{$step}";
        }, static fn (Slider $component): bool => $component->isMultiple() && filled($component->getStep()));
    }

    public function range(int | float | Closure $minValue, int | float | Closure $maxValue): static
    {
        $this->minValue($minValue);
        $this->maxValue($maxValue);

        return $this;
    }

    /**
     * @param  array<string, int | float> | Closure | null  $points
     */
    public function nonLinearPoints(array | Closure | null $points): static
    {
        $this->nonLinearPoints = $points;

        return $this;
    }

    public function minValue(int | float | Closure $minValue): static
    {
        $this->minValue = $minValue;

        return $this;
    }

    public function maxValue(int | float | Closure $maxValue): static
    {
        $this->maxValue = $maxValue;

        return $this;
    }

    public function margin(int | Closure | null $margin = null): static
    {
        $this->margin = $margin;

        return $this;
    }

    public function limit(int | Closure | null $limit = null): static
    {
        $this->limit = $limit;

        return $this;
    }

    /**
     * @param  int | array<int> | Closure | null  $padding
     */
    public function padding(int | array | Closure | null $padding = null): static
    {
        $this->padding = $padding;

        return $this;
    }

    /**
     * @param  array<bool> | Closure | null  $fill
     */
    public function fill(array | Closure | null $fill = [true, false]): static
    {
        $this->fill = $fill;

        return $this;
    }

    public function vertical(bool | Closure $condition = true): static
    {
        $this->isVertical = $condition;

        return $this;
    }

    public function rtl(bool | Closure | null $condition = true): static
    {
        $this->isRtl = $condition;

        return $this;
    }

    /**
     * @param  Behavior | array<Behavior> | Closure | null  $behavior
     */
    public function behavior(Behavior | array | Closure | null $behavior = null): static
    {
        $this->behavior = $behavior;

        return $this;
    }

    /**
     * @param  bool | RawJs | array<bool | RawJs> | Closure  $tooltips
     */
    public function tooltips(bool | RawJs | array | Closure $tooltips = true): static
    {
        $this->tooltips = $tooltips;

        return $this;
    }

    public function pips(PipsMode | Closure | null $mode = PipsMode::Range, int | Closure | null $density = null): static
    {
        $this->pipsMode($mode);
        $this->pipsDensity($density);

        return $this;
    }

    public function pipsMode(PipsMode | Closure | null $mode): static
    {
        $this->pipsMode = $mode;

        return $this;
    }

    public function pipsDensity(int | Closure | null $density): static
    {
        $this->pipsDensity = $density;

        return $this;
    }

    public function pipsFormatter(RawJs | Closure | null $formatter): static
    {
        $this->pipsFormatter = $formatter;

        return $this;
    }

    /**
     * @param  int | float | array<int | float> | Closure | null  $values
     */
    public function pipsValues(int | float | array | Closure | null $values): static
    {
        $this->pipsValues = $values;

        return $this;
    }

    public function steppedPips(bool | Closure $condition = true): static
    {
        $this->arePipsStepped = $condition;

        return $this;
    }

    public function pipsFilter(RawJs | Closure | null $filter): static
    {
        $this->pipsFilter = $filter;

        return $this;
    }

    public function getMinValue(): int | float
    {
        return $this->evaluate($this->minValue) ?? 0;
    }

    public function getMaxValue(): int | float
    {
        return $this->evaluate($this->maxValue) ?? 100;
    }

    public function getMargin(): ?int
    {
        return $this->evaluate($this->margin);
    }

    public function getLimit(): ?int
    {
        return $this->evaluate($this->limit);
    }

    /**
     * @return int | array<int> | null
     */
    public function getPadding(): int | array | null
    {
        return $this->evaluate($this->padding);
    }

    /**
     * @return ?array<bool>
     */
    public function getFill(): ?array
    {
        return $this->evaluate($this->fill);
    }

    public function isVertical(): bool
    {
        return (bool) $this->evaluate($this->isVertical);
    }

    public function isRtl(): bool
    {
        return (bool) ($this->evaluate($this->isRtl) ?? ($this->isVertical() || (__('filament-panels::layout.direction') === 'rtl')));
    }

    public function getBehavior(): ?string
    {
        $behaviour = Arr::wrap($this->evaluate($this->behavior));

        if (blank($behaviour)) {
            return null;
        }

        return implode('-', $behaviour);
    }

    /**
     * @return bool | RawJs | array<bool | RawJs>
     */
    public function getTooltips(): bool | RawJs | array
    {
        return $this->evaluate($this->tooltips);
    }

    /**
     * @return bool | RawJs | array<bool | RawJs>
     */
    public function getTooltipsForJs(): bool | RawJs | array
    {
        return $this->convertRawJsExpressionsToFormatterObjects($this->getTooltips());
    }

    protected function convertRawJsExpressionsToFormatterObjects(mixed $value): mixed
    {
        if ($value instanceof RawJs) {
            return RawJs::make("{ to: (\$value) => {$value} }");
        }

        if (is_array($value)) {
            return array_map(
                fn (mixed $value): mixed => $this->convertRawJsExpressionsToFormatterObjects($value),
                $value,
            );
        }

        return $value;
    }

    public function hasTooltips(): bool
    {
        $tooltips = $this->getTooltips();

        if (is_array($tooltips)) {
            foreach ($tooltips as $tooltip) {
                if ($tooltip !== false) {
                    return true;
                }
            }

            return false;
        }

        return $tooltips !== false;
    }

    public function getPipsMode(): ?PipsMode
    {
        return $this->evaluate($this->pipsMode);
    }

    public function getPipsDensity(): ?int
    {
        return $this->evaluate($this->pipsDensity);
    }

    public function getPipsFormatter(): ?RawJs
    {
        return $this->evaluate($this->pipsFormatter);
    }

    public function getPipsFormatterForJs(): ?RawJs
    {
        return $this->convertRawJsExpressionsToFormatterObjects($this->getPipsFormatter());
    }

    /**
     * @return int | float | array<int | float> | null
     */
    public function getPipsValues(): int | float | array | null
    {
        return $this->evaluate($this->pipsValues);
    }

    public function arePipsStepped(): bool
    {
        return (bool) $this->evaluate($this->arePipsStepped);
    }

    public function getPipsFilter(): ?RawJs
    {
        return $this->evaluate($this->pipsFilter);
    }

    public function getPipsFilterForJs(): ?RawJs
    {
        $filter = $this->getPipsFilter();

        if ($filter instanceof RawJs) {
            return RawJs::make("(\$value) => {$filter}");
        }

        return $filter;
    }

    /**
     * @return ?array<string, int | float>
     */
    public function getNonLinearPoints(): ?array
    {
        return $this->evaluate($this->nonLinearPoints);
    }

    public function decimalPlaces(int | Closure | null $decimalPlaces): static
    {
        $this->decimalPlaces = $decimalPlaces;

        return $this;
    }

    public function getDecimalPlaces(): ?int
    {
        return $this->evaluate($this->decimalPlaces);
    }

    /**
     * @return array<StateCast>
     */
    public function getDefaultStateCasts(): array
    {
        return [
            app(SliderStateCast::class, ['decimalPlaces' => $this->getDecimalPlaces()]),
        ];
    }

    public function isMultiple(): bool
    {
        return is_array($this->getRawState());
    }
}
