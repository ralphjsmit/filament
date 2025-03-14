---
title: Overview
---
import Aside from "@components/Aside.astro"
import UtilityInjection from "@components/UtilityInjection.astro"

## Overview

Within Filament schemas, prime components are the most basic building blocks that can be used to insert arbitrary content into a schema, such as text and images. As the name suggests, prime components are not divisible and cannot be made simpler.

Some examples of what prime components can be used for include:

- Displaying instructions to the user.
- Displaying an image like a QR code that the user can scan.
- Displaying a button that the user can click to perform an action.

<AutoScreenshot name="primes/overview/example" alt="An example of using prime components to set up two factor authentication." version="4.x" />

In these examples, the prime components are not associated with any other components in the schema, they are standalone. 

Prime component classes can be found in the `Filament\Schemas\Components` namespace. They reside within the schema array of components.

Components may be created using the static `make()` method. Usually, you will then define the child component `schema()` to display inside:

```php
use Filament\Schemas\Components\Text;

Text::make()
```

## Available prime components

Filament ships with some prime components, suitable for arranging your components depending on your needs:

- [Grid](grid)
- [Section](section)
- [Tabs](tabs)
- [Wizard](wizard)
- [Fieldset](fieldset)
- [Split](split)

You may also [create your own custom prime components](custom) to organize schemas however you wish.

## Adding extra HTML attributes to a prime component

You can pass extra HTML attributes to the component via the `extraAttributes()` method, which will be merged onto its outer HTML element. The attributes should be represented by an array, where the key is the attribute name and the value is the attribute value:

```php
use Filament\Schemas\Components\Section;

Section::make()
    ->extraAttributes(['class' => 'custom-section-style'])
```

<UtilityInjection set="formFields" version="4.x">As well as allowing a static value, the `extraAttributes()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

By default, calling `extraAttributes()` multiple times will overwrite the previous attributes. If you wish to merge the attributes instead, you can pass `merge: true` to the method.

## Component utility injection

The vast majority of methods used to configure entries accept functions as parameters instead of hardcoded values:

```php
use App\Models\User;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;

Grid::make(fn (): array => [
    'lg' => auth()->user()->isAdmin() ? 4 : 6,
])->schema([
    // ...
])

Section::make()
    ->heading(fn (): string => auth()->user()->isAdmin() ? 'Admin Dashboard' : 'User Dashboard')
    ->schema([
        // ...
    ])
```

This alone unlocks many customization possibilities.

The package is also able to inject many utilities to use inside these functions, as parameters. All customization methods that accept functions as arguments can inject utilities.

These injected utilities require specific parameter names to be used. Otherwise, Filament doesn't know what to inject.

### Injecting the state of another component

You may also retrieve the state (value) of a form field or infolist entry from within a callback, using a `$get` parameter:

```php
use Filament\Schemas\Components\Utilities\Get;

function (Get $get) {
    $email = $get('email'); // Store the value of the `email` entry in the `$email` variable.
    //...
}
```

### Injecting the current Eloquent record

You may retrieve the Eloquent record for the current schema using a `$record` parameter:

```php
use Illuminate\Database\Eloquent\Model;

function (?Model $record) {
    // ...
}
```

### Injecting the current operation

If you're writing a schema for a panel resource or relation manager, and you wish to check if a schema is `create`, `edit` or `view`, use the `$operation` parameter:

```php
function (string $operation) {
    // ...
}
```

<Aside variant="info">
    You can manually set a schema's operation using the `$schema->operation()` method.
</Aside>

### Injecting the current Livewire component instance

If you wish to access the current Livewire component instance, define a `$livewire` parameter:

```php
use Livewire\Component;

function (Component $livewire) {
    // ...
}
```

### Injecting the current component instance

If you wish to access the current component instance, define a `$component` parameter:

```php
use Filament\Schemas\Components\Component;

function (Component $component) {
    // ...
}
```

### Injecting multiple utilities

The parameters are injected dynamically using reflection, so you are able to combine multiple parameters in any order:

```php
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Livewire\Component as Livewire;

function (Livewire $livewire, Get $get, Set $set) {
    // ...
}
```

### Injecting dependencies from Laravel's container

You may inject anything from Laravel's container like normal, alongside utilities:

```php
use Filament\Schemas\Components\Utilities\Set;
use Illuminate\Http\Request;

function (Request $request, Set $set) {
    // ...
}
```

## Global settings

If you wish to change the default behavior of a component globally, then you can call the static `configureUsing()` method inside a service provider's `boot()` method, to which you pass a Closure to modify the component using. For example, if you wish to make all section components have [2 columns](grid) by default, you can do it like so:

```php
use Filament\Schemas\Components\Section;

Section::configureUsing(function (Section $section): void {
    $section
        ->columns(2);
});
```

Of course, you are still able to overwrite this on each component individually:

```php
use Filament\Schemas\Components\Section;

Section::make()
    ->columns(1)
```
