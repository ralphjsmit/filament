<?php

namespace Filament\Forms\Components;

use Closure;
use Filament\Forms\Components\Concerns\HasStep;
use Filament\Forms\Components\Enums\SliderBehavior;
use Filament\Support\Concerns\HasExtraAlpineAttributes;
use Filament\Support\RawJs;
use Illuminate\Support\Arr;

class Slider extends Field
{
    use HasExtraAlpineAttributes;
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
     * @var bool | string | array<bool> | Closure
     */
    protected bool | string | array | Closure $connect = false;

    protected bool | Closure $isVertical = false;

    protected bool | Closure | null $isRtl = null;

    /**
     * @var SliderBehavior | array<SliderBehavior> | Closure | null
     */
    protected SliderBehavior | array | Closure | null $behavior = null;

    /**
     * @var bool | RawJs | array<bool | RawJs> | Closure
     */
    protected bool | RawJs | array | Closure $tooltips = false;

    protected RawJs | Closure | null $format = null;

    protected RawJs | Closure | null $ariaFormat = null;

    protected RawJs | Closure | null $pips = null;

    public function range(int | float | Closure $minValue, int | float | Closure $maxValue): static
    {
        $this->minValue($minValue);
        $this->maxValue($maxValue);

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
     * @param  bool | string | array<bool> | Closure  $connect
     */
    public function connect(bool | string | array | Closure $connect = true): static
    {
        $this->connect = $connect;

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
     * @param  SliderBehavior | array<SliderBehavior> | Closure | null  $behavior
     */
    public function behavior(SliderBehavior | array | Closure | null $behavior = null): static
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

    public function format(RawJs | Closure | null $format = null): static
    {
        $this->format = $format;

        return $this;
    }

    public function pips(RawJs | Closure | null $pips = null): static
    {
        $this->pips = $pips;

        return $this;
    }

    public function ariaFormat(RawJs | Closure | null $ariaFormat = null): static
    {
        $this->ariaFormat = $ariaFormat;

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
     * @return bool | string | array<bool>
     */
    public function getConnect(): bool | string | array
    {
        return $this->evaluate($this->connect);
    }

    public function isVertical(): bool
    {
        return (bool) $this->evaluate($this->isVertical);
    }

    public function isRtl(): bool
    {
        return (bool) ($this->evaluate($this->isRtl) ?? (__('filament-panels::layout.direction') === 'rtl'));
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

    public function getFormat(): ?RawJs
    {
        return $this->evaluate($this->format);
    }

    public function getPips(): ?RawJs
    {
        return $this->evaluate($this->pips);
    }

    public function getAriaFormat(): ?RawJs
    {
        return $this->evaluate($this->ariaFormat);
    }
}
