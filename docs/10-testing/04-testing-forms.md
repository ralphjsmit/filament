---
title: Testing forms
---

## Introduction

All examples in this guide will be written using [Pest](https://pestphp.com). To use Pest's Livewire plugin for testing, you can follow the installation instructions in the Pest documentation on plugins: [Livewire plugin for Pest](https://pestphp.com/docs/plugins#livewire). However, you can easily adapt this to PHPUnit, mostly by switching out the `livewire()` function from Pest with the `Livewire::test()` method.

Since the Form Builder works on Livewire components, you can use the [Livewire testing helpers](https://livewire.laravel.com/docs/testing). However, we have custom testing helpers that you can use with forms:

## Filling a form

To fill a form with data, pass the data to `fillForm()`:

```php
use function Pest\Livewire\livewire;

livewire(CreatePost::class)
    ->fillForm([
        'title' => fake()->sentence(),
        // ...
    ]);
```

> If you have multiple forms on a Livewire component, you can specify which form you want to fill using `fillForm([...], 'createPostForm')`.

To check that a form has data, use `assertFormSet()`:

```php
use Illuminate\Support\Str;
use function Pest\Livewire\livewire;

it('can automatically generate a slug from the title', function () {
    $title = fake()->sentence();

    livewire(CreatePost::class)
        ->fillForm([
            'title' => $title,
        ])
        ->assertFormSet([
            'slug' => Str::slug($title),
        ]);
});
```

> If you have multiple forms on a Livewire component, you can specify which form you want to check using `assertFormSet([...], 'createPostForm')`.

You may also find it useful to pass a function to the `assertFormSet()` method, which allows you to access the form `$state` and perform additional assertions:

```php
use Illuminate\Support\Str;
use function Pest\Livewire\livewire;

it('can automatically generate a slug from the title without any spaces', function () {
    $title = fake()->sentence();

    livewire(CreatePost::class)
        ->fillForm([
            'title' => $title,
        ])
        ->assertFormSet(function (array $state): array {
            expect($state['slug'])
                ->not->toContain(' ');
                
            return [
                'slug' => Str::slug($title),
            ];
        });
});
```

You can return an array from the function if you want Filament to continue to assert the form state after the function has been run.

## Validation

Use `assertHasFormErrors()` to ensure that data is properly validated in a form:

```php
use function Pest\Livewire\livewire;

it('can validate input', function () {
    livewire(CreatePost::class)
        ->fillForm([
            'title' => null,
        ])
        ->call('create')
        ->assertHasFormErrors(['title' => 'required']);
});
```

And `assertHasNoFormErrors()` to ensure there are no validation errors:

```php
use function Pest\Livewire\livewire;

livewire(CreatePost::class)
    ->fillForm([
        'title' => fake()->sentence(),
        // ...
    ])
    ->call('create')
    ->assertHasNoFormErrors();
```

> If you have multiple forms on a Livewire component, you can pass the name of a specific form as the second parameter like `assertHasFormErrors(['title' => 'required'], 'createPostForm')` or `assertHasNoFormErrors([], 'createPostForm')`.

## Form existence

To check that a Livewire component has a form, use `assertFormExists()`:

```php
use function Pest\Livewire\livewire;

it('has a form', function () {
    livewire(CreatePost::class)
        ->assertFormExists();
});
```

> If you have multiple forms on a Livewire component, you can pass the name of a specific form like `assertFormExists('createPostForm')`.

## Fields

To ensure that a form has a given field, pass the field name to `assertFormFieldExists()`:

```php
use function Pest\Livewire\livewire;

it('has a title field', function () {
    livewire(CreatePost::class)
        ->assertFormFieldExists('title');
});
```

You may pass a function as an additional argument to assert that a field passes a given "truth test". This is useful for asserting that a field has a specific configuration:

```php
use function Pest\Livewire\livewire;

it('has a title field', function () {
    livewire(CreatePost::class)
        ->assertFormFieldExists('title', function (TextInput $field): bool {
            return $field->isDisabled();
        });
});
```

To assert that a form does not have a given field, pass the field name to `assertFormFieldDoesNotExist()`:

```php
use function Pest\Livewire\livewire;

it('does not have a conditional field', function () {
    livewire(CreatePost::class)
        ->assertFormFieldDoesNotExist('no-such-field');
});
```

> If you have multiple forms on a Livewire component, you can specify which form you want to check for the existence of the field like `assertFormFieldExists('title', 'createPostForm')`.

### Hidden fields

To ensure that a field is visible, pass the name to `assertFormFieldVisible()`:

```php
use function Pest\Livewire\livewire;

test('title is visible', function () {
    livewire(CreatePost::class)
        ->assertFormFieldVisible('title');
});
```

Or to ensure that a field is hidden you can pass the name to `assertFormFieldHidden()`:

```php
use function Pest\Livewire\livewire;

test('title is hidden', function () {
    livewire(CreatePost::class)
        ->assertFormFieldHidden('title');
});
```

> For both `assertFormFieldHidden()` and `assertFormFieldVisible()` you can pass the name of a specific form the field belongs to as the second argument like `assertFormFieldHidden('title', 'createPostForm')`.

### Disabled fields

To ensure that a field is enabled, pass the name to `assertFormFieldEnabled()`:

```php
use function Pest\Livewire\livewire;

test('title is enabled', function () {
    livewire(CreatePost::class)
        ->assertFormFieldEnabled('title');
});
```

Or to ensure that a field is disabled you can pass the name to `assertFormFieldDisabled()`:

```php
use function Pest\Livewire\livewire;

test('title is disabled', function () {
    livewire(CreatePost::class)
        ->assertFormFieldDisabled('title');
});
```

> For both `assertFormFieldEnabled()` and `assertFormFieldDisabled()` you can pass the name of a specific form the field belongs to as the second argument like `assertFormFieldEnabled('title', 'createPostForm')`.

## Layout components

If you need to check if a particular layout component exists rather than a field, you may use `assertFormComponentExists()`.  As layout components do not have names, this method uses the `key()` provided by the developer:

```php
use Filament\Forms\Components\Section;

Section::make('Comments')
    ->key('comments-section')
    ->schema([
        //
    ])
```

```php
use function Pest\Livewire\livewire;

test('comments section exists', function () {
    livewire(EditPost::class)
        ->assertFormComponentExists('comments-section');
});
```

To assert that a form does not have a given component, pass the component key to `assertFormComponentDoesNotExist()`:

```php
use function Pest\Livewire\livewire;

it('does not have a conditional component', function () {
    livewire(CreatePost::class)
        ->assertFormComponentDoesNotExist('no-such-section');
});
```

To check if the component exists and passes a given truth test, you can pass a function to the second argument of `assertFormComponentExists()`, returning true or false if the component passes the test or not:

```php
use Filament\Forms\Components\Component;

use function Pest\Livewire\livewire;

test('comments section has heading', function () {
    livewire(EditPost::class)
        ->assertFormComponentExists(
            'comments-section',
            function (Component $component): bool {
                return $component->getHeading() === 'Comments';
            },
        );
});
```

If you want more informative test results, you can embed an assertion within your truth test callback:

```php
use Filament\Forms\Components\Component;
use Illuminate\Testing\Assert;

use function Pest\Livewire\livewire;

test('comments section is enabled', function () {
    livewire(EditPost::class)
        ->assertFormComponentExists(
            'comments-section',
            function (Component $component): bool {
                Assert::assertTrue(
                    $component->isEnabled(),
                    'Failed asserting that comments-section is enabled.',
                );
                
                return true;
            },
        );
});
```

### Wizard

To go to a wizard's next step, use `goToNextWizardStep()`:

```php
use function Pest\Livewire\livewire;

it('moves to next wizard step', function () {
    livewire(CreatePost::class)
        ->goToNextWizardStep()
        ->assertHasFormErrors(['title']);
});
```

You can also go to the previous step by calling `goToPreviousWizardStep()`:

```php
use function Pest\Livewire\livewire;

it('moves to next wizard step', function () {
    livewire(CreatePost::class)
        ->goToPreviousWizardStep()
        ->assertHasFormErrors(['title']);
});
```

If you want to go to a specific step, use `goToWizardStep()`, then the `assertWizardCurrentStep` method which can ensure you are on the desired step without validation errors from the previous:

```php
use function Pest\Livewire\livewire;

it('moves to the wizards second step', function () {
    livewire(CreatePost::class)
        ->goToWizardStep(2)
        ->assertWizardCurrentStep(2);
});
```

If you have multiple forms on a single Livewire component, any of the wizard test helpers can accept a `formName` parameter:

```php
use function Pest\Livewire\livewire;

it('moves to next wizard step only for fooForm', function () {
    livewire(CreatePost::class)
        ->goToNextWizardStep(formName: 'fooForm')
        ->assertHasFormErrors(['title'], formName: 'fooForm');
});
```
