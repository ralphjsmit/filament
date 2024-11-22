<?php

namespace Filament\Pages\Dashboard\Concerns;

use Filament\Pages\Dashboard\Components\Tab;
use Illuminate\Support\Arr;

trait HasTabs
{
    /**
     * @var array<string | int, Tab>
     */
    protected array $cachedTabs;

    /**
     * @return array<string | int, Tab>
     */
    public function getTabs(): array
    {
        $tabs = [];

        foreach ($this->getVisibleWidgets() as $widget) {
            $tabs[] = $this->normalizeWidgetClass($widget)::getTab();
        }

        $tabs = array_unique($tabs);

        if (in_array(null, $tabs)) {
            if (count($tabs) === 1) {
                // If no widget has a tab specified other than `null`, return.
                return [];
            }

            $tabs = Arr::prepend($tabs, $this->getDefaultTabLabel());
        }

        return array_map(
            fn (string $tab): Tab => Tab::make($tab),
            array_unique(array_filter($tabs))
        );
    }

    /**
     * @return array<string | int, Tab>
     */
    public function getCachedTabs(): array
    {
        return $this->cachedTabs ??= $this->getTabs();
    }

    public function getDefaultActiveTab(): string | int | null
    {
        return array_key_first($this->getCachedTabs());
    }

    public function getDefaultTabLabel(): string
    {
        return __('filament-panels::pages/dashboard.tabs.default.label');
    }

    public function generateTabLabel(string $key): string
    {
        return (string) str($key)
            ->replace(['_', '-'], ' ')
            ->ucfirst();
    }
}
