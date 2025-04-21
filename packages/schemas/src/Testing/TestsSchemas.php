<?php

namespace Filament\Schemas\Testing;

use Closure;
use Filament\Actions\Contracts\HasActions;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Schemas\Schema;
use Illuminate\Testing\Assert;
use Livewire\Features\SupportTesting\Testable;

/**
 * @method HasSchemas instance()
 *
 * @mixin Testable
 */
class TestsSchemas
{
    public function assertSchemaComponentExists(): Closure
    {
        return function (string $component, ?string $schema = null, ?Closure $checkComponentUsing = null): static {
            if ($this->instance() instanceof HasActions) {
                $schema ??= $this->instance()->getMountedActionSchemaName();
            }

            $schema ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line  */
            $this->assertSchemaExists($schema);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            $componentInstance = $schemaInstance->getFlatComponents(withHidden: true)[$component] ?? null;

            $livewireClass = $this->instance()::class;

            Assert::assertInstanceOf(
                Component::class,
                $componentInstance,
                "Failed asserting that a component [{$component}] exists on the schema with the name [{$schema}] on the [{$livewireClass}] component."
            );

            if ($checkComponentUsing) {
                Assert::assertTrue(
                    $checkComponentUsing($componentInstance),
                    "Failed asserting that a component [{$component}] and provided configuration exists on the schema with the name [{$schema}] on the [{$livewireClass}] component."
                );
            }

            return $this;
        };
    }

    public function assertSchemaExists(): Closure
    {
        return function (string $name): static {
            /** @var Schema $schema */
            $schema = $this->instance()->{$name};

            $livewireClass = $this->instance()::class;

            Assert::assertInstanceOf(
                Schema::class,
                $schema,
                "Failed asserting that a schema with the name [{$name}] exists on the [{$livewireClass}] component."
            );

            return $this;
        };
    }

    public function assertSchemaSet(): Closure
    {
        return function (array | Closure $state, ?string $schema = null): static {
            if ($this->instance() instanceof HasActions) {
                $schema ??= $this->instance()->getMountedActionSchemaName();
            }

            $schema ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line  */
            $this->assertSchemaExists($schema);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            $schemaStatePath = $schemaInstance->getStatePath();

            if ($state instanceof Closure) {
                $state = $state($schemaInstance->getRawState());
            }

            if (is_array($state)) {
                $livewireClass = $this->instance()::class;

                $components = $schemaInstance->getFlatComponents(withActions: false, withHidden: true);

                foreach ($state as $key => $value) {
                    if (array_key_exists($key, $components)) {
                        Assert::assertEquals(
                            $value,
                            $components[$key]->getState(),
                            "Failed asserting that a component [{$key}] has the expected state in the [{$schema}] schema on the [{$livewireClass}] component."
                        );
                    } else {
                        $this->assertSet((filled($schemaStatePath) ? "{$schemaStatePath}." : '') . $key, $value);
                    }
                }
            }

            return $this;
        };
    }

    public function assertSchemaComponentStateSet(): Closure
    {
        return function (string $component, mixed $state, ?string $schema = null): static {
            if ($this->instance() instanceof HasActions) {
                $schema ??= $this->instance()->getMountedActionSchemaName();
            }

            $schema ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line  */
            $this->assertSchemaComponentExists($component, $schema);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            $componentInstance = $schemaInstance->getFlatComponents(withHidden: true)[$component] ?? null;

            $livewireClass = $this->instance()::class;

            Assert::assertEquals(
                $state,
                $componentInstance->getState(),
                "Failed asserting that a component [{$component}] has the expected state in the [{$livewireClass}] component."
            );

            return $this;
        };
    }

    public function assertSchemaComponentStateNotSet(): Closure
    {
        return function (string $component, mixed $state, ?string $schema = null): static {
            if ($this->instance() instanceof HasActions) {
                $schema ??= $this->instance()->getMountedActionSchemaName();
            }

            $schema ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line  */
            $this->assertSchemaComponentExists($component, $schema);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            $componentInstance = $schemaInstance->getFlatComponents(withHidden: true)[$component] ?? null;

            $livewireClass = $this->instance()::class;

            Assert::assertNotEquals(
                $state,
                $componentInstance->getState(),
                "Failed asserting that a component [{$component}] does not have the expected state in the [{$livewireClass}] component."
            );

            return $this;
        };
    }
}
