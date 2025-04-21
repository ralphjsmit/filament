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
                "Failed asserting that a component with the key [{$component}] exists on the form with the name [{$schema}] on the [{$livewireClass}] component."
            );

            if ($checkComponentUsing) {
                Assert::assertTrue(
                    $checkComponentUsing($componentInstance),
                    "Failed asserting that a component with the key [{$component}] and provided configuration exists on the form with the name [{$schema}] on the [{$livewireClass}] component."
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
}
