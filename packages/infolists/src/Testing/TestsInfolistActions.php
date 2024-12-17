<?php

namespace Filament\Infolists\Testing;

use Closure;
use Livewire\Features\SupportTesting\Testable;

/**
 * @method Component&HasSchemas instance()
 *
 * @mixin Testable
 */
class TestsInfolistActions
{
    public function mountInfolistAction(): Closure
    {
        return function (string $component, string | array $actions, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->mountAction($actions);

            return $this;
        };
    }

    public function unmountInfolistAction(): Closure
    {
        return function (): static {
            $this->unmountAction();

            return $this;
        };
    }

    public function setInfolistActionData(): Closure
    {
        return function (array $data): static {
            $this->setActionData($data);

            return $this;
        };
    }

    public function assertInfolistActionDataSet(): Closure
    {
        return function (array | Closure $data): static {
            $this->assertActionDataSet($data);

            return $this;
        };
    }

    public function callInfolistAction(): Closure
    {
        return function (string $component, string | array $actions, array $data = [], array $arguments = [], string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName, $arguments);

            $this->callAction($actions, $data);

            return $this;
        };
    }

    public function callMountedInfolistAction(): Closure
    {
        return function (array $arguments = []): static {
            $this->callMountedAction($arguments);

            return $this;
        };
    }

    public function assertInfolistActionExists(): Closure
    {
        return function (string $component, string | array $actions, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionExists($actions);

            return $this;
        };
    }

    public function assertInfolistActionDoesNotExist(): Closure
    {
        return function (string $component, string | array $actions, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionDoesNotExist($actions);

            return $this;
        };
    }

    public function assertInfolistActionVisible(): Closure
    {
        return function (string $component, string | array $actions, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionVisible($actions);

            return $this;
        };
    }

    public function assertInfolistActionHidden(): Closure
    {
        return function (string $component, string | array $actions, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionHidden($actions);

            return $this;
        };
    }

    public function assertInfolistActionEnabled(): Closure
    {
        return function (string $component, string | array $actions, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionEnabled($actions);

            return $this;
        };
    }

    public function assertInfolistActionDisabled(): Closure
    {
        return function (string $component, string | array $actions, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionDisabled($actions);

            return $this;
        };
    }

    public function assertInfolistActionHasIcon(): Closure
    {
        return function (string $component, string | array $actions, string $icon, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionHasIcon($actions, $icon);

            return $this;
        };
    }

    public function assertInfolistActionDoesNotHaveIcon(): Closure
    {
        return function (string $component, string | array $actions, string $icon, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionDoesNotHaveIcon($actions, $icon);

            return $this;
        };
    }

    public function assertInfolistActionHasLabel(): Closure
    {
        return function (string $component, string | array $actions, string $label, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionHasLabel($actions, $label);

            return $this;
        };
    }

    public function assertInfolistActionDoesNotHaveLabel(): Closure
    {
        return function (string $component, string | array $actions, string $label, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionDoesNotHaveLabel($actions, $label);

            return $this;
        };
    }

    public function assertInfolistActionHasColor(): Closure
    {
        return function (string $component, string | array $actions, string | array $color, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionHasColor($actions, $color);

            return $this;
        };
    }

    public function assertInfolistActionDoesNotHaveColor(): Closure
    {
        return function (string $component, string | array $actions, string | array $color, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionDoesNotHaveColor($actions, $color);

            return $this;
        };
    }

    public function assertInfolistActionHasUrl(): Closure
    {
        return function (string $component, string | array $actions, string $url, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionHasUrl($actions, $url);

            return $this;
        };
    }

    public function assertInfolistActionDoesNotHaveUrl(): Closure
    {
        return function (string $component, string | array $actions, string $url, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionDoesNotHaveUrl($actions, $url);

            return $this;
        };
    }

    public function assertInfolistActionShouldOpenUrlInNewTab(): Closure
    {
        return function (string $component, string | array $actions, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionShouldOpenUrlInNewTab($actions);

            return $this;
        };
    }

    public function assertInfolistActionShouldNotOpenUrlInNewTab(): Closure
    {
        return function (string $component, string | array $actions, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionShouldNotOpenUrlInNewTab($actions);

            return $this;
        };
    }

    public function assertInfolistActionMounted(): Closure
    {
        return function (string $component, string | array $actions, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionMounted($actions);

            return $this;
        };
    }

    public function assertInfolistActionNotMounted(): Closure
    {
        return function (string $component, string | array $actions, string $infolistName = 'infolist'): static {
            /** @var array<array<string, mixed>> $actions */
            /** @phpstan-ignore-next-line */
            $actions = $this->parseNestedInfolistActions($component, $actions, $infolistName);

            $this->assertActionNotMounted($actions);

            return $this;
        };
    }

    public function assertInfolistActionHalted(): Closure
    {
        return $this->assertInfolistActionMounted();
    }

    public function assertHasInfolistActionErrors(): Closure
    {
        return function (array $keys = []): static {
            $this->assertHasActionErrors($keys);

            return $this;
        };
    }

    public function assertHasNoInfolistActionErrors(): Closure
    {
        return function (array $keys = []): static {
            $this->assertHasNoActionErrors($keys);

            return $this;
        };
    }

    public function parseNestedInfolistActions(): Closure
    {
        return function (string $component, string | array $actions, string $infolist, array $arguments = []): array {
            /** @var array<array<string, mixed>> $actions */
            $actions = $this->parseNestedActions($actions, $arguments);

            $actions[array_key_first($actions)]['context']['schemaComponent'] = "{$infolist}.{$component}";

            return $actions;
        };
    }
}