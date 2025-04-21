<?php

namespace Filament\Forms\Testing;

use Closure;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Components\Field;
use Filament\Forms\Components\TextInput;
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
        return function (array | Closure $state = [], ?string $form = null): static {
            if ($this->instance() instanceof HasActions) {
                $form ??= $this->instance()->getMountedActionSchemaName();
            }

            $form ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line */
            $this->assertSchemaExists($form);

            $livewire = $this->instance();

            /** @var Schema $schemaInstance */
            $schemaInstance = $livewire->{$form};

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
        return function (array | Closure $state, ?string $form = null): static {
            $this->assertSchemaSet($state, $form);

            return $this;
        };
    }

    public function assertHasFormErrors(): Closure
    {
        return function (array $keys = [], ?string $form = null): static {
            if ($this->instance() instanceof HasActions) {
                $form ??= $this->instance()->getMountedActionSchemaName();
            }

            $form ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line */
            $this->assertSchemaExists($form);

            $livewire = $this->instance();

            /** @var Schema $schemaInstance */
            $schemaInstance = $livewire->{$form};

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
        return function (array $keys = [], ?string $form = null): static {
            if ($this->instance() instanceof HasActions) {
                $form ??= $this->instance()->getMountedActionSchemaName();
            }

            $form ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line */
            $this->assertSchemaExists($form);

            $livewire = $this->instance();

            /** @var Schema $schemaInstance */
            $schemaInstance = $livewire->{$form};

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
            $this->assertSchemaExists($name);

            return $this;
        };
    }

    public function assertFormComponentExists(): Closure
    {
        return function (string $componentKey, string | Closure | null $form = null, ?Closure $checkComponentUsing = null): static {
            if ($form instanceof Closure) {
                $checkComponentUsing = $form;
                $form = null;
            }

            $this->assertSchemaComponentExists($componentKey, $form, $checkComponentUsing);

            return $this;
        };
    }

    public function assertFormComponentDoesNotExist(): Closure
    {
        return function (string $componentKey, ?string $form = null): static {
            $this->assertSchemaComponentDoesNotExist($componentKey, $form);

            return $this;
        };
    }

    public function assertFormFieldExists(): Closure
    {
        return function (string $field, string | Closure | null $form = null, ?Closure $checkFieldUsing = null): static {
            if ($form instanceof Closure) {
                $checkFieldUsing = $form;
                $form = null;
            }

            if ($this->instance() instanceof HasActions) {
                $form ??= $this->instance()->getMountedActionSchemaName();
            }

            $form ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line */
            $this->assertSchemaExists($form);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$form};

            /** @var ?Field $fieldInstance */
            $fieldInstance = $schemaInstance->getFlatFields(withHidden: true)[$field] ?? null;

            $livewireClass = $this->instance()::class;

            Assert::assertInstanceOf(
                Field::class,
                $fieldInstance,
                "Failed asserting that a field with the name [{$field}] exists on the form with the name [{$form}] on the [{$livewireClass}] component."
            );

            if ($checkFieldUsing) {
                Assert::assertTrue(
                    $checkFieldUsing($fieldInstance),
                    "Failed asserting that a field with the name [{$field}] and provided configuration exists on the form with the name [{$form}] on the [{$livewireClass}] component."
                );
            }

            return $this;
        };
    }

    public function assertFormFieldDoesNotExist(): Closure
    {
        return function (string $field, ?string $form = null): static {
            if ($this->instance() instanceof HasActions) {
                $form ??= $this->instance()->getMountedActionSchemaName();
            }

            $form ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line */
            $this->assertSchemaExists($form);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$form};

            $fields = $schemaInstance->getFlatFields(withHidden: false);

            $livewireClass = $this->instance()::class;

            Assert::assertArrayNotHasKey(
                $field,
                $fields,
                "Failed asserting that a field with the name [{$field}] does not exist on the form named [{$form}] on the [{$livewireClass}] component."
            );

            return $this;
        };
    }

    public function assertFormFieldDisabled(): Closure
    {
        return function (string $field, ?string $form = null): static {
            if ($this->instance() instanceof HasActions) {
                $form ??= $this->instance()->getMountedActionSchemaName();
            }

            $form ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line */
            $this->assertFormFieldExists($field, $form);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$form};

            /** @var Field $fieldInstance */
            $fieldInstance = $schemaInstance->getFlatFields(withHidden: true)[$field];

            $livewireClass = $this->instance()::class;

            /** @phpstan-ignore-next-line */
            $this->assertFormFieldExists($field, $form, function (Field $fieldInstance) use ($field, $form, $livewireClass): bool {
                Assert::assertTrue(
                    $fieldInstance->isDisabled(),
                    "Failed asserting that a field with the name [{$field}] is disabled on the form named [{$form}] on the [{$livewireClass}] component."
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
        return function (string $field, ?string $form = null): static {
            if ($this->instance() instanceof HasActions) {
                $form ??= $this->instance()->getMountedActionSchemaName();
            }

            $form ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line */
            $this->assertFormFieldExists($field, $form);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$form};

            /** @var Field $fieldInstance */
            $fieldInstance = $schemaInstance->getFlatFields(withHidden: true)[$field];

            $livewireClass = $this->instance()::class;

            /** @phpstan-ignore-next-line */
            $this->assertFormFieldExists($field, $form, function (Field $fieldInstance) use ($field, $form, $livewireClass): bool {
                Assert::assertFalse(
                    $fieldInstance->isDisabled(),
                    "Failed asserting that a field with the name [{$field}] is enabled on the form named [{$form}] on the [{$livewireClass}] component."
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
        return function (string $field, ?string $form = null): static {
            if ($this->instance() instanceof HasActions) {
                $form ??= $this->instance()->getMountedActionSchemaName();
            }

            $form ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line */
            $this->assertFormFieldExists($field, $form);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$form};

            /** @var TextInput $fieldInstance */
            $fieldInstance = $schemaInstance->getFlatFields(withHidden: true)[$field];

            $livewireClass = $this->instance()::class;

            Assert::assertTrue(
                $fieldInstance->isReadOnly(),
                "Failed asserting that a field with the name [{$field}] is read-only on the form named [{$form}] on the [{$livewireClass}] component."
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
        return function (string $field, ?string $form = null): static {
            if ($this->instance() instanceof HasActions) {
                $form ??= $this->instance()->getMountedActionSchemaName();
            }

            $form ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line */
            $this->assertFormFieldExists($field, $form);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$form};

            $fields = $schemaInstance->getFlatFields(withHidden: false);

            $livewireClass = $this->instance()::class;

            Assert::assertArrayNotHasKey(
                $field,
                $fields,
                "Failed asserting that a field with the name [{$field}] is hidden on the form named [{$form}] on the [{$livewireClass}] component."
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
        return function (string $field, ?string $form = null): static {
            if ($this->instance() instanceof HasActions) {
                $form ??= $this->instance()->getMountedActionSchemaName();
            }

            $form ??= $this->instance()->getDefaultTestingSchemaName();

            /** @phpstan-ignore-next-line */
            $this->assertFormFieldExists($field, $form);

            /** @var Schema $schemaInstance */
            $schemaInstance = $this->instance()->{$form};

            $fields = $schemaInstance->getFlatFields(withHidden: false);

            $livewireClass = $this->instance()::class;

            Assert::assertArrayHasKey(
                $field,
                $fields,
                "Failed asserting that a field with the name [{$field}] is visible on the form named [{$form}] on the [{$livewireClass}] component."
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
