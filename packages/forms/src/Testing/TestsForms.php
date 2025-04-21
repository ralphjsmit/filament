<?php

namespace Filament\Forms\Testing;

use Closure;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Forms\Components\Field;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Wizard;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Schemas\Schema;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Testing\Assert;
use Livewire\Features\SupportTesting\Testable;

/**
 * @method HasSchemas instance()
 *
 * @mixin Testable
 */
class TestsForms
{
    public function fillForm(): Closure
    {
        return function (array | Closure $state = [], string $schema = 'form'): static {
            /** @phpstan-ignore-next-line  */
            $this->assertFormExists($schema);

            $livewire = $this->instance();

            /** @var Schema $schemaInstance */
            $schemaInstance = $livewire->{$schema};

            $schemaStatePath = $schemaInstance->getStatePath();

            if ($state instanceof Closure) {
                $state = $state($schemaInstance->getRawState());
            }

            if (is_array($state)) {
                $state = Arr::undot($state);

                if (filled($schemaStatePath)) {
                    $state = Arr::undot([$schemaStatePath => $state]);
                }

                foreach (Arr::dot($state) as $key => $value) {
                    if ($value instanceof UploadedFile ||
                        (is_array($value) && isset($value[0]) && $value[0] instanceof UploadedFile)
                    ) {
                        $this->set($key, $value);
                        Arr::set($state, $key, $this->get($key));
                    }
                }

                $this->call('fillFormDataForTesting', $state);
            }

            $this->refresh();

            return $this;
        };
    }

    public function assertFormSet(): Closure
    {
        return function (array | Closure $state, string $schema = 'form'): static {
            $this->assertSchemaSet($state, $schema);

            return $this;
        };
    }

    public function assertHasFormErrors(): Closure
    {
        return function (array $keys = [], string $schema = 'form'): static {
            /** @phpstan-ignore-next-line  */
            $this->assertFormExists($schema);

            $livewire = $this->instance();

            /** @var Schema $schemaInstance */
            $schemaInstance = $livewire->{$schema};

            $schemaStatePath = $schemaInstance->getStatePath();

            $this->assertHasErrors(
                collect($keys)
                    ->mapWithKeys(function ($value, $key) use ($schemaStatePath): array {
                        if (is_int($key)) {
                            return [$key => (filled($schemaStatePath) ? "{$schemaStatePath}.{$value}" : $value)];
                        }

                        return [(filled($schemaStatePath) ? "{$schemaStatePath}.{$key}" : $key) => $value];
                    })
                    ->all(),
            );

            return $this;
        };
    }

    public function assertHasNoFormErrors(): Closure
    {
        return function (array $keys = [], string $schema = 'form'): static {
            /** @phpstan-ignore-next-line  */
            $this->assertFormExists($schema);

            $livewire = $this->instance();

            /** @var Schema $schemaInstance */
            $schemaInstance = $livewire->{$schema};

            $schemaStatePath = $schemaInstance->getStatePath();

            $this->assertHasNoErrors(
                collect($keys)
                    ->mapWithKeys(function ($value, $key) use ($schemaStatePath): array {
                        if (is_int($key)) {
                            return [$key => (filled($schemaStatePath) ? "{$schemaStatePath}.{$value}" : $value)];
                        }

                        return [(filled($schemaStatePath) ? "{$schemaStatePath}.{$key}" : $key) => $value];
                    })
                    ->all(),
            );

            return $this;
        };
    }

    public function assertFormExists(): Closure
    {
        return function (string $name = 'form'): static {
            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$name};

            $livewireClass = $this->instance()::class;

            Assert::assertInstanceOf(
                Schema::class,
                $schemaInstance,
                "Failed asserting that a form with the name [{$name}] exists on the [{$livewireClass}] component."
            );

            return $this;
        };
    }

    public function assertFormComponentExists(): Closure
    {
        return function (string $componentKey, string | Closure $schema = 'form', ?Closure $checkComponentUsing = null): static {
            if ($schema instanceof Closure) {
                $checkComponentUsing = $schema;
                $schema = 'form';
            }

            /** @phpstan-ignore-next-line  */
            $this->assertFormExists($schema);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            /** @var Component | Action | null $component */
            $component = $schemaInstance->getFlatComponents(withHidden: true)[$componentKey] ?? null;

            $livewireClass = $this->instance()::class;

            Assert::assertInstanceOf(
                Component::class,
                $component,
                "Failed asserting that a component [{$componentKey}] exists on the form with the name [{$schema}] on the [{$livewireClass}] component."
            );

            if ($checkComponentUsing) {
                Assert::assertTrue(
                    $checkComponentUsing($component),
                    "Failed asserting that a component [{$componentKey}] and provided configuration exists on the form with the name [{$schema}] on the [{$livewireClass}] component."
                );
            }

            return $this;
        };
    }

    public function assertFormComponentDoesNotExist(): Closure
    {
        return function (string $componentKey, string $schema = 'form'): static {
            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            $components = $schemaInstance->getFlatComponents(withHidden: true);

            $livewireClass = $this->instance()::class;

            Assert::assertArrayNotHasKey(
                $componentKey,
                $components,
                "Failed asserting that a component [{$componentKey}] does not exist on the form named [{$schema}] on the [{$livewireClass}] component."
            );

            return $this;
        };
    }

    public function assertFormFieldExists(): Closure
    {
        return function (string $fieldName, string | Closure $schema = 'form', ?Closure $checkFieldUsing = null): static {
            if ($schema instanceof Closure) {
                $checkFieldUsing = $schema;
                $schema = 'form';
            }

            /** @phpstan-ignore-next-line  */
            $this->assertFormExists($schema);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            /** @var ?Field $field */
            $field = $schemaInstance->getFlatFields(withHidden: true)[$fieldName] ?? null;

            $livewireClass = $this->instance()::class;

            Assert::assertInstanceOf(
                Field::class,
                $field,
                "Failed asserting that a field with the name [{$fieldName}] exists on the form with the name [{$schema}] on the [{$livewireClass}] component."
            );

            if ($checkFieldUsing) {
                Assert::assertTrue(
                    $checkFieldUsing($field),
                    "Failed asserting that a field with the name [{$fieldName}] and provided configuration exists on the form with the name [{$schema}] on the [{$livewireClass}] component."
                );
            }

            return $this;
        };
    }

    public function assertFormFieldDoesNotExist(): Closure
    {
        return function (string $fieldName, string $schema = 'form'): static {
            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            $fields = $schemaInstance->getFlatFields(withHidden: false);

            $livewireClass = $this->instance()::class;

            Assert::assertArrayNotHasKey(
                $fieldName,
                $fields,
                "Failed asserting that a field with the name [{$fieldName}] does not exist on the form named [{$schema}] on the [{$livewireClass}] component."
            );

            return $this;
        };
    }

    public function assertFormFieldDisabled(): Closure
    {
        return function (string $fieldName, string $schema = 'form'): static {
            /** @phpstan-ignore-next-line  */
            $this->assertFormFieldExists($fieldName, $schema);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            /** @var Field $field */
            $field = $schemaInstance->getFlatFields(withHidden: true)[$fieldName];

            $livewireClass = $this->instance()::class;

            /** @phpstan-ignore-next-line  */
            $this->assertFormFieldExists($fieldName, $schema, function (Field $field) use ($fieldName, $schema, $livewireClass): bool {
                Assert::assertTrue(
                    $field->isDisabled(),
                    "Failed asserting that a field with the name [{$fieldName}] is disabled on the form named [{$schema}] on the [{$livewireClass}] component."
                );

                return true;
            });

            return $this;
        };
    }

    /**
     * @deprecated Use `assertFormFieldDisabled()` instead.
     */
    public function assertFormFieldIsDisabled(): Closure
    {
        return $this->assertFormFieldDisabled();
    }

    public function assertFormFieldEnabled(): Closure
    {
        return function (string $fieldName, string $schema = 'form'): static {
            /** @phpstan-ignore-next-line  */
            $this->assertFormFieldExists($fieldName, $schema);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            /** @var Field $field */
            $field = $schemaInstance->getFlatFields(withHidden: true)[$fieldName];

            $livewireClass = $this->instance()::class;

            /** @phpstan-ignore-next-line  */
            $this->assertFormFieldExists($fieldName, $schema, function (Field $field) use ($fieldName, $schema, $livewireClass): bool {
                Assert::assertFalse(
                    $field->isDisabled(),
                    "Failed asserting that a field with the name [{$fieldName}] is enabled on the form named [{$schema}] on the [{$livewireClass}] component."
                );

                return true;
            });

            return $this;
        };
    }

    /**
     * @deprecated Use `assertFormFieldEnabled()` instead.
     */
    public function assertFormFieldIsEnabled(): Closure
    {
        return $this->assertFormFieldEnabled();
    }

    public function assertFormFieldReadOnly(): Closure
    {
        return function (string $fieldName, string $schema = 'form'): static {
            /** @phpstan-ignore-next-line  */
            $this->assertFormFieldExists($fieldName, $schema);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            /** @var TextInput $field */
            $field = $schemaInstance->getFlatFields(withHidden: true)[$fieldName];

            $livewireClass = $this->instance()::class;

            Assert::assertTrue(
                $field->isReadOnly(),
                "Failed asserting that a field with the name [{$fieldName}] is read-only on the form named [{$schema}] on the [{$livewireClass}] component."
            );

            return $this;
        };
    }

    /**
     * @deprecated Use `assertFormFieldReadOnly()` instead.
     */
    public function assertFormFieldIsReadOnly(): Closure
    {
        return $this->assertFormFieldReadOnly();
    }

    public function assertFormFieldHidden(): Closure
    {
        return function (string $fieldName, string $schema = 'form'): static {
            /** @phpstan-ignore-next-line  */
            $this->assertFormFieldExists($fieldName, $schema);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            $fields = $schemaInstance->getFlatFields(withHidden: false);

            $livewireClass = $this->instance()::class;

            Assert::assertArrayNotHasKey(
                $fieldName,
                $fields,
                "Failed asserting that a field with the name [{$fieldName}] is hidden on the form named [{$schema}] on the [{$livewireClass}] component."
            );

            return $this;
        };
    }

    /**
     * @deprecated Use `assertFormFieldHidden()` instead.
     */
    public function assertFormFieldIsHidden(): Closure
    {
        return $this->assertFormFieldHidden();
    }

    public function assertFormFieldVisible(): Closure
    {
        return function (string $fieldName, string $schema = 'form'): static {
            /** @phpstan-ignore-next-line  */
            $this->assertFormFieldExists($fieldName, $schema);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$schema};

            $fields = $schemaInstance->getFlatFields(withHidden: false);

            $livewireClass = $this->instance()::class;

            Assert::assertArrayHasKey(
                $fieldName,
                $fields,
                "Failed asserting that a field with the name [{$fieldName}] is visible on the form named [{$schema}] on the [{$livewireClass}] component."
            );

            return $this;
        };
    }

    /**
     * @deprecated Use `assertFormFieldVisible()` instead.
     */
    public function assertFormFieldIsVisible(): Closure
    {
        return $this->assertFormFieldVisible();
    }
}
