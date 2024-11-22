<?php

namespace Filament\Pages;

use Filament\Facades\Filament;
use Filament\Support\Facades\FilamentIcon;
use Filament\Widgets\Widget;
use Filament\Widgets\WidgetConfiguration;
use Illuminate\Contracts\Support\Htmlable;

class Dashboard extends Page
{
    use Dashboard\Concerns\HasTabs;

    protected static string $routePath = '/';

    protected static ?int $navigationSort = -2;

    /**
     * @var view-string
     */
    protected static string $view = 'filament-panels::pages.dashboard';

    public static function getNavigationLabel(): string
    {
        return static::$navigationLabel ??
            static::$title ??
            __('filament-panels::pages/dashboard.title');
    }

    public static function getNavigationIcon(): string | Htmlable | null
    {
        return static::$navigationIcon
            ?? FilamentIcon::resolve('panels::pages.dashboard.navigation-item')
            ?? (Filament::hasTopNavigation() ? 'heroicon-m-home' : 'heroicon-o-home');
    }

    public static function getRoutePath(): string
    {
        return static::$routePath;
    }

    /**
     * @return array<class-string<Widget> | WidgetConfiguration>
     */
    public function getWidgets(): array
    {
        return Filament::getWidgets();
    }

    /**
     * @return array<class-string<Widget> | WidgetConfiguration>
     */
    public function getVisibleWidgets(?string $tab = null): array
    {
        $visibleWidgets = $this->filterVisibleWidgets($this->getWidgets());

        if (filled($tab)) {
            $defaultActiveTab = $this->getDefaultActiveTab();

            $defaultActiveTabLabel = $this->getCachedTabs()[$defaultActiveTab]->getLabel() ?? $this->generateTabLabel($defaultActiveTab);
	        
	        $visibleWidgets = array_filter($visibleWidgets, function (string | WidgetConfiguration $widget) use ($tab, $defaultActiveTabLabel): bool {
                $widgetTab = $this->normalizeWidgetClass($widget)::getTab();

                if (blank($widgetTab)) {
                    return $tab === $defaultActiveTabLabel;
                }

                return $widgetTab === $tab;
            });
        }

        return $visibleWidgets;
    }

    /**
     * @return int | string | array<string, int | string | null>
     */
    public function getColumns(): int | string | array
    {
        return 2;
    }

    public function getTitle(): string | Htmlable
    {
        return static::$title ?? __('filament-panels::pages/dashboard.title');
    }
}
