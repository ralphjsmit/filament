@props([
    'applyAction',
    'headingTag' => 'h3',
    'reorderAnimationDuration' => 300,
])

<div class="fi-ta-col-manager">
    <div
        @if (\Filament\Support\Facades\FilamentView::hasSpaMode())
            {{-- format-ignore-start --}}x-load="visible || event (x-modal-opened)"{{-- format-ignore-end --}}
        @else
            x-load
        @endif
        x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('column-manager', 'filament/tables') }}"
        x-data="columnManagerComponent({
                    columns: $wire.entangle('toggledTableColumns'),
                    isLive: {{ $applyAction->isVisible() ? 'false' : 'true' }},
                })"
        class="fi-ta-col-manager-ctn"
    >
        <div class="fi-ta-col-manager-header">
            <{{ $headingTag }} class="fi-ta-col-manager-heading">
                {{ __('filament-tables::table.column_toggle.heading') }}
            </{{ $headingTag }}>
        </div>

        <div
            x-show="hasToggleable"
            x-sortable
            x-on:end.stop="reorderColumns($event.target.sortable.toArray())"
            data-sortable-animation-duration="{{ $reorderAnimationDuration }}"
            class="fi-ta-col-manager-items"
        >
            <template
                x-for="(column, index) in columns"
                x-bind:key="(column.type === 'group' ? 'group::' : 'column::') + column.name + '_' + index"
            >
                <div
                    x-bind:x-sortable-item="column.type === 'group' ? 'group::' + column.name : 'column::' + column.name"
                >
                    <template x-if="column.type === 'group'">
                        <div class="fi-ta-col-manager-group">
                            <div class="fi-ta-col-manager-item">
                                <label class="fi-ta-col-manager-label">
                                    <input
                                        type="checkbox"
                                        class="fi-checkbox-input fi-valid"
                                        x-bind:id="'group-' + column.name"
                                        x-bind:checked="(groupedColumns[column.name] || {}).checked || false"
                                        x-bind:disabled="(groupedColumns[column.name] || {}).disabled || false"
                                        x-effect="$el.indeterminate = (groupedColumns[column.name] || {}).indeterminate || false"
                                        x-on:change="toggleGroup(column.name)"
                                    />
                                    <span x-text="column.label"></span>
                                </label>
                                <button
                                    x-sortable-handle
                                    x-on:click.stop
                                    class="fi-ta-col-manager-reorder-handle fi-icon-btn"
                                    type="button"
                                >
                                    {{ \Filament\Support\generate_icon_html(\Filament\Support\Icons\Heroicon::Bars2, alias: 'tables::columns.reorder.handle') }}
                                </button>
                            </div>
                            <div
                                x-sortable
                                x-on:end.stop="reorderGroupColumns($event.target.sortable.toArray(), column.name)"
                                data-sortable-animation-duration="{{ $reorderAnimationDuration }}"
                                class="fi-ta-col-manager-group-items"
                            >
                                <template
                                    x-for="(groupColumn, index) in column.columns"
                                    x-bind:key="'column::' + groupColumn.name + '_' + index"
                                >
                                    <div
                                        x-bind:x-sortable-item="'column::' + groupColumn.name"
                                    >
                                        <div class="fi-ta-col-manager-item">
                                            <label
                                                class="fi-ta-col-manager-label"
                                            >
                                                <input
                                                    type="checkbox"
                                                    class="fi-checkbox-input fi-valid"
                                                    x-bind:id="'column-' + groupColumn.name.replace('.', '-')"
                                                    x-bind:checked="(getColumn(groupColumn.name, column.name) || {}).toggled || false"
                                                    x-bind:disabled="(getColumn(groupColumn.name, column.name) || {}).toggleable === false"
                                                    x-on:change="toggleColumn(groupColumn.name, column.name)"
                                                />
                                                <span
                                                    x-text="groupColumn.label"
                                                ></span>
                                            </label>
                                            <button
                                                x-sortable-handle
                                                x-on:click.stop
                                                class="fi-ta-col-manager-reorder-handle fi-icon-btn"
                                                type="button"
                                            >
                                                {{ \Filament\Support\generate_icon_html(\Filament\Support\Icons\Heroicon::Bars2, alias: 'tables::columns.reorder.handle') }}
                                            </button>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                    <template x-if="column.type !== 'group'">
                        <div class="fi-ta-col-manager-item">
                            <label class="fi-ta-col-manager-label">
                                <input
                                    type="checkbox"
                                    class="fi-checkbox-input fi-valid"
                                    x-bind:id="'column-' + column.name.replace('.', '-')"
                                    x-bind:checked="(getColumn(column.name, null) || {}).toggled || false"
                                    x-bind:disabled="(getColumn(column.name, null) || {}).toggleable === false"
                                    x-on:change="toggleColumn(column.name)"
                                />
                                <span x-text="column.label"></span>
                            </label>
                            <button
                                x-sortable-handle
                                x-on:click.stop
                                class="fi-ta-col-manager-reorder-handle fi-icon-btn"
                                type="button"
                            >
                                {{ \Filament\Support\generate_icon_html(\Filament\Support\Icons\Heroicon::Bars2, alias: 'tables::columns.reorder.handle') }}
                            </button>
                        </div>
                    </template>
                </div>
            </template>
        </div>

        @if ($applyAction->isVisible())
            <div class="fi-ta-col-manager-apply-action-ctn">
                {{ $applyAction }}
            </div>
        @endif
    </div>
</div>
