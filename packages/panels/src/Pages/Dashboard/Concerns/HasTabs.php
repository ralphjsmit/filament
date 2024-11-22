<?php

namespace Filament\Pages\Dashboard\Concerns;

use Filament\Pages\Dashboard\Components\Tab;

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
        return [];
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

    public function generateTabLabel(string $key): string
    {
        return (string) str($key)
            ->replace(['_', '-'], ' ')
            ->ucfirst();
    }
}
