<?php

namespace Filament\Widgets;

use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Support\RawJs;
use Illuminate\Contracts\Support\Htmlable;
use Livewire\Attributes\Locked;

abstract class ChartWidget extends Widget implements HasSchemas
{
    use Concerns\CanPoll;
    use InteractsWithSchemas;

    /**
     * @var array<string, mixed> | null
     */
    protected ?array $cachedData = null;

    #[Locked]
    public ?string $dataChecksum = null;

    public ?string $filter = null;

    protected static string $color = 'primary';

    protected static ?string $heading = null;

    protected static ?string $description = null;

    protected static ?string $maxHeight = null;

    /**
     * @var array<string, mixed> | null
     */
    protected static ?array $options = null;

    /**
     * @var view-string
     */
    protected static string $view = 'filament-widgets::chart-widget';

    public function mount(): void
    {
        if (method_exists($this, 'getFiltersSchema')) {
            $this->getFiltersSchema()->fill();
        }

        $this->dataChecksum = $this->generateDataChecksum();
    }

    abstract protected function getType(): string;

    protected function generateDataChecksum(): string
    {
        return md5(json_encode($this->getCachedData()));
    }

    /**
     * @return array<string, mixed>
     */
    protected function getCachedData(): array
    {
        return $this->cachedData ??= $this->getData();
    }

    /**
     * @return array<string, mixed>
     */
    protected function getData(): array
    {
        return [];
    }

    /**
     * @return array<scalar, scalar> | null
     */
    protected function getFilters(): ?array
    {
        return null;
    }

    public function getHeading(): string | Htmlable | null
    {
        return static::$heading;
    }

    public function getDescription(): string | Htmlable | null
    {
        return static::$description;
    }

    protected function getMaxHeight(): ?string
    {
        return static::$maxHeight;
    }

    /**
     * @return array<string, mixed> | RawJs | null
     */
    protected function getOptions(): array | RawJs | null
    {
        return static::$options;
    }

    public function updateChartData(): void
    {
        $newDataChecksum = $this->generateDataChecksum();

        if ($newDataChecksum !== $this->dataChecksum) {
            $this->dataChecksum = $newDataChecksum;

            $this->dispatch('updateChartData', data: $this->getCachedData());
        }
    }

    public function rendering(): void
    {
        $this->updateChartData();
    }

    public function getColor(): string
    {
        return static::$color;
    }
}
