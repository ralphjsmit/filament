<x-filament-panels::page
    class="fi-dashboard-page"
    :x-data="'{ activeTab: ' . \Illuminate\Support\JS::from(strval($this->getDefaultActiveTab())) . ' }'"
>
    @if (method_exists($this, 'filtersForm'))
        {{ $this->filtersForm }}
    @endif
    
    @php
        $tabs = $this->getCachedTabs();
    @endphp
    
    @if (count($tabs))
        @php
            $renderHookScopes = $this->getRenderHookScopes();
        @endphp
        
        <x-filament::tabs>
            {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGES_DASHBOARD_TABS_START, scopes: $renderHookScopes) }}
            
            @foreach ($tabs as $tabKey => $tab)
                @php
                    $tabKey = strval($tabKey);
                @endphp
                
                <x-filament::tabs.item
                    :alpine-active="'activeTab === ' . \Illuminate\Support\JS::from($tabKey)"
                    :badge="$tab->getBadge()"
                    :badge-color="$tab->getBadgeColor()"
                    :badge-icon="$tab->getBadgeIcon()"
                    :badge-icon-position="$tab->getBadgeIconPosition()"
                    :icon="$tab->getIcon()"
                    :icon-position="$tab->getIconPosition()"
                    :x-on:click="'activeTab = ' . \Illuminate\Support\JS::from($tabKey)"
                    :attributes="$tab->getExtraAttributeBag()"
                >
                    {{ $tab->getLabel() ?? $this->generateTabLabel($tabKey) }}
                </x-filament::tabs.item>
            @endforeach
            
            {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGES_DASHBOARD_TABS_END, scopes: $renderHookScopes) }}
        </x-filament::tabs>
    @endif
    
    @forelse ($tabs as $tabKey => $tab)
        @php
            $tabKey = strval($tabKey);
        @endphp
        
        <x-filament-widgets::widgets
                :columns="$this->getColumns()"
                :data="
                [
                    ...(property_exists($this, 'filters') ? ['filters' => $this->filters] : []),
                    ...$this->getWidgetData(),
                ]
            "
                :x-show="'activeTab === ' . \Illuminate\Support\JS::from($tabKey)"
                :x-cloak="! $loop->first"
                :widgets="$this->getVisibleWidgets($tab->getLabel() ?? $this->generateTabLabel($tabKey))"
                :wire:key="$tabKey"
        />
    @empty
        <x-filament-widgets::widgets
            :columns="$this->getColumns()"
            :data="
                [
                    ...(property_exists($this, 'filters') ? ['filters' => $this->filters] : []),
                    ...$this->getWidgetData(),
                ]
            "
            :widgets="$this->getVisibleWidgets()"
        />
    @endforelse
</x-filament-panels::page>