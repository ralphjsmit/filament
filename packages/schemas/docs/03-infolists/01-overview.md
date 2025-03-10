---
title: Overview
---
import Aside from "@components/Aside.astro"
import AutoScreenshot from "@components/AutoScreenshot.astro"

## Overview

Entry classes can be found in the `Filament\Infolists\Components` namespace.

Entries may be created using the static `make()` method, passing its unique name. Usually, the name of an entry corresponds to the name of an attribute on an Eloquent model. You may use "dot notation" to access attributes within relationships:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')

TextEntry::make('author.name')
```

<AutoScreenshot name="infolists/entries/simple" alt="Entries in an infolist" version="4.x" />

## Available entries

- [Text entry](text)
- [Icon entry](icon)
- [Image entry](image)
- [Color entry](color)
- [Key-value entry](key-value)
- [Repeatable entry](repeatable)

You may also [create your own custom entries](custom) to display data however you wish.

## Content (state) of an entry

Entries may feel a bit magic at first, but they are designed to be simple to use and optimized to display data from an Eloquent record. Despite this, they are flexible and you can display data from any source, not just an Eloquent record.

The data that an entry displays is called its "state". When using a [panel resource](../../resources), the infolist is aware of the record it is displaying. This means that the state of the entry is set based on the value of the attribute on the record. For example, if the entry is used in the infolist of a `PostResource`, then the `title` attribute value of the current post will be displayed.

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
```

If you want to access the value stored in a relationship, you can use "dot notation". The name of the relationship that you would like to access data from comes first, followed by a dot, and then the name of the attribute:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('author.name')
```

You can also use "dot notation" to access values within a JSON / array column on an Eloquent model. The name of the attribute comes first, followed by a dot, and then the key of the JSON object you want to read from:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('meta.title')
```

### Setting the state of an entry

You can pass your own state to an entry by using the `state()` method:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->state('Hello, world!')
```

<UtilityInjection set="infolistEntries" version="4.x">The `state()` method also accepts a function to dynamically calculate the state. You can inject various utilities into the function as parameters.</UtilityInjection>

### Setting the default state of an entry

When an entry is empty (its state is `null`), you can use the `default()` method to define alternative state to use instead. This method will treat the default state as if it were real, so entries like [image](image) or [color](color) will display the default image or color.

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->default('Untitled')
```

#### Adding placeholder text if an entry is empty

Sometimes you may want to display placeholder text for entries with an empty state, which is styled as a lighter gray text. This differs from the [default value](#setting-the-default-state-of-an-entry), as the placeholder is always text and not treated as if it were real state.

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->placeholder('Untitled')
```

<AutoScreenshot name="infolists/entries/placeholder" alt="Entry with a placeholder for empty state" version="4.x" />

## Setting an entry's label

By default, the label of the entry, which is displayed in the header of the infolist, is generated from the name of the entry. You may customize this using the `label()` method:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->label('Full name')
```

<UtilityInjection set="infolistEntries" version="4.x">As well as allowing a static value, the `label()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

Customizing the label in this way is useful if you wish to use a [translation string for localization](https://laravel.com/docs/localization#retrieving-translation-strings):

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->label(__('entries.name'))
```

### Hiding an entry's label

<Aside variant="tip">
    If you're looking to hide an entry's label, it might be the case that you are trying to use an entry for arbitrary text or UI. Entries are specifically designed to display data in a structured way, but [Prime components](../primes) are simple components that are used to render basic stand-alone static content, such as text, images, and buttons (actions). You may want to consider using a Prime component instead.
</Aside>

It may be tempting to set the label to an empty string to hide it, but this is not recommended. Setting the label to an empty string will not communicate the purpose of the entry to screen readers, even if the purpose is clear visually. Instead, you should use the `hiddenLabel()` method, so it is hidden visually but still accessible to screen readers:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->hiddenLabel()
```

Optionally, you may pass a boolean value to control if the label should be hidden or not:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->hiddenLabel(FeatureFlag::active())
```

<UtilityInjection set="infolistEntries" version="4.x">As well as allowing a static value, the `hiddenLabel()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

## Opening a URL when an entry is clicked

When an entry is clicked, you may open a URL. To do this, pass a URL to the `url()` method:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url('/about/titles')
```

You may pass a function to the `url()` method to dynamically calculate the URL. For example, you may want to access the current Eloquent record for the infolist by injecting `$record` as an argument:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url(fn (Post $record): string => route('posts.edit', ['post' => $record]))
```

If you're using a [panel resource](../../resources), you can generate a link to a page for the record using the `getUrl()` method:

```php
use App\Filament\Posts\PostResource;
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url(fn (Post $record): string => PostResource::getUrl('edit', ['record' => $record]))
```

<UtilityInjection set="infolistEntries" version="4.x">The function passed to `url()` can inject various utilities as parameters.</UtilityInjection>

You may also choose to open the URL in a new tab:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url(fn (Post $record): string => PostResource::getUrl('edit', ['record' => $record]))
    ->openUrlInNewTab()
```

Optionally, you may pass a boolean value to control if the URL should open in a new tab or not:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url(fn (Post $record): string => PostResource::getUrl('edit', ['record' => $record]))
    ->openUrlInNewTab(FeatureFlag::active())
```

<UtilityInjection set="infolistEntries" version="4.x">As well as allowing a static value, the `openUrlInNewTab()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

## Hiding an entry

You may hide an entry:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('role')
    ->hidden()
```

Optionally, you may pass a boolean value to control if the entry should be hidden or not:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('role')
    ->hidden(! FeatureFlag::active())
```

<UtilityInjection set="infolistEntries" version="4.x">As well as allowing a static value, the `hidden()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

Alternatively, you may use the `visible()` method to control if the entry should be hidden or not. In some situations, this may help to make your code more readable:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('role')
    ->visible(FeatureFlag::active())
```

<UtilityInjection set="infolistEntries" version="4.x">As well as allowing a static value, the `visible()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

<Aside variant="info">
    If both `hidden()` and `visible()` are used, they both need to indicate that the entry should be visible for it to be shown.
</Aside>

### Hiding an entry using JavaScript

If you need to hide an entry based on a user interaction, you can use the `hidden()` or `visible()` methods, passing a function that uses utilities injected to determine whether the entry should be hidden or not:

```php
use Filament\Forms\Components\Select;
use Filament\Infolists\Components\IconEntry;

Select::make('role')
    ->options([
        'user' => 'User',
        'staff' => 'Staff',
    ])
    ->live()

IconEntry::make('is_admin')
    ->boolean()
    ->hidden(fn (Get $get): bool => $get('role') !== 'staff')
```

In this example, the `role` field is set to `live()`, which means that the schema will reload the schema each time the `role` field is changed. This will cause the function that is passed to the `hidden()` method to be re-evaluated, which will hide the `is_admin` entry if the `role` field is not set to `staff`.

However, reloading the schema each time an entry causes a network request to be made, since there is no way to re-run the PHP function from the client-side. This is not ideal for performance.

Alternatively, you can write JavaScript to hide the entry based on the value of a field. This is done by passing a JavaScript expression to the `hiddenJs()` method:

```php
use Filament\Forms\Components\Select;
use Filament\Infolists\Components\IconEntry;

Select::make('role')
    ->options([
        'user' => 'User',
        'staff' => 'Staff',
    ])

IconEntry::make('is_admin')
    ->boolean()
    ->hiddenJs(>>>JS
        \$get('role') !== 'staff'
    JS)
```

Although the code passed to `hiddenJs()` looks very similar to PHP, it is actually JavaScript. Filament provides the `$get()` utility function to JavaScript that behaves very similar to its PHP equivalent, but without requiring the depended-on entry to be `live()`.

The `visibleJs()` method is also available, which works in the same way as `hiddenJs()`, but controls if the entry should be visible or not:

```php
use Filament\Forms\Components\Select;
use Filament\Infolists\Components\IconEntry;

Select::make('role')
    ->options([
        'user' => 'User',
        'staff' => 'Staff',
    ])
    
IconEntry::make('is_admin')
    ->boolean()
    ->visibleJs(>>>JS
        \$get('role') === 'staff'
    JS)
```

<Aside variant="info">
    If both `hiddenJs()` and `visibleJs()` are used, they both need to indicate that the entry should be visible for it to be shown.
</Aside>

### Hiding an entry based on the current operation

The "operation" of a schema is the current action being performed on it. Usually, this is either `create`, `edit` or `view`, if you are using the [panel resource](../../resources).

You can hide an entry based on the current operation by passing an operation to the `hiddenOn()` method:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_admin')
    ->boolean()
    ->hiddenOn('edit')
    
// is the same as

IconEntry::make('is_admin')
    ->boolean()
    ->hidden(fn (string $operation): bool => $operation === 'edit')
```

You can also pass an array of operations to the `hiddenOn()` method, and the entry will be hidden if the current operation is any of the operations in the array:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_admin')
    ->boolean()
    ->hiddenOn(['edit', 'view'])
    
// is the same as

IconEntry::make('is_admin')
    ->boolean()
    ->hidden(fn (string $operation): bool => in_array($operation, ['edit', 'view']))
```

<Aside variant="warning">
    The `hiddenOn()` method will overwrite any previous calls to the `hidden()` method, and vice versa.
</Aside>

Alternatively, you may use the `visibleOn()` method to control if the entry should be hidden or not. In some situations, this may help to make your code more readable:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_admin')
    ->boolean()
    ->visibleOn('create')

IconEntry::make('is_admin')
    ->boolean()
    ->visibleOn(['create', 'edit'])
```

<Aside variant="info">
    The `visibleOn()` method will overwrite any previous calls to the `visible()` method, and vice versa.
</Aside>

## Adding a tooltip to an entry

You may specify a tooltip to display when you hover over an entry:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->tooltip('Shown at the top of the page')
```

<UtilityInjection set="infolistEntries" version="4.x">As well as allowing a static value, the `tooltip()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

<AutoScreenshot name="infolists/entries/tooltips" alt="Entry with tooltip" version="4.x" />

## Aligning entry content

You may align the content of an entry to the start (left in left-to-right interfaces, right in right-to-left interfaces), center, or end (right in left-to-right interfaces, left in right-to-left interfaces) using the `alignStart()`, `alignCenter()` or `alignEnd()` methods:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->alignStart() // This is the default alignment.

TextEntry::make('title')
    ->alignCenter()

TextEntry::make('title')
    ->alignEnd()
```

Alternatively, you may pass an `Alignment` enum to the `alignment()` method:

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Support\Enums\Alignment;

TextEntry::make('title')
    ->alignment(Alignment::Center)
```

<UtilityInjection set="infolistEntries" version="4.x">As well as allowing a static value, the `alignment()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

## Custom attributes

The HTML of entries can be customized, by passing an array of `extraAttributes()`:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('slug')
    ->extraAttributes(['class' => 'bg-gray-200'])
```

These get merged onto the outer `<div>` element of each entry in that entry.

You can also pass extra HTML attributes to the entry wrapper which surrounds the label, entry, and any other text:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('slug')
    ->extraEntryWrapperAttributes(['class' => 'entry-locked'])
```

### Adding extra HTML attributes to an entry

You can pass extra HTML attributes to the entry via the `extraAttributes()` method, which will be merged onto its outer HTML element. The attributes should be represented by an array, where the key is the attribute name and the value is the attribute value:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('slug')
    ->extraAttributes(['class' => 'bg-gray-200'])
```

<UtilityInjection set="infolistEntries" version="4.x">As well as allowing a static value, the `extraAttributes()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

By default, calling `extraAttributes()` multiple times will overwrite the previous attributes. If you wish to merge the attributes instead, you can pass `merge: true` to the method.

#### Adding extra HTML attributes to the entry wrapper

You can also pass extra HTML attributes to the very outer element of the "entry wrapper" which surrounds the label and content of the entry. This is useful if you want to style the label or spacing of the entry via CSS, since you could target elements as children of the wrapper:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('slug')
    ->extraEntryWrapperAttributes(['class' => 'components-locked'])
```

<UtilityInjection set="infolistEntries" version="4.x">As well as allowing a static value, the `extraEntryWrapperAttributes()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

By default, calling `extraEntryWrapperAttributes()` multiple times will overwrite the previous attributes. If you wish to merge the attributes instead, you can pass `merge: true` to the method.

## Entry utility injection

The vast majority of methods used to configure entries accept functions as parameters instead of hardcoded values:

```php
use App\Models\User;
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->label(fn (string $state): string => str_contains($state, ' ') ? 'Full name' : 'Name')

TextEntry::make('currentUserEmail')
    ->state(fn (): string => auth()->user()->email)

TextEntry::make('role')
    ->hidden(fn (User $record): bool => $record->role === 'admin')
```

This alone unlocks many customization possibilities.

The package is also able to inject many utilities to use inside these functions, as parameters. All customization methods that accept functions as arguments can inject utilities.

These injected utilities require specific parameter names to be used. Otherwise, Filament doesn't know what to inject.

### Injecting the current state of the entry

If you wish to access the current value (state) of the entry, define a `$state` parameter:

```php
function ($state) {
    // ...
}
```

### Injecting the state of another entry or form field

You may also retrieve the state (value) of another entry or form field from within a callback, using a `$get` parameter:

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

### Injecting the current entry instance

If you wish to access the current component instance, define a `$component` parameter:

```php
use Filament\Infolists\Components\Entry;

function (Entry $component) {
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

If you wish to change the default behavior of all entries globally, then you can call the static `configureUsing()` method inside a service provider's `boot()` method, to which you pass a Closure to modify the entries using. For example, if you wish to make all `TextEntry` components [`words(10)`](text#limiting-word-count), you can do it like so:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::configureUsing(function (TextEntry $entry): void {
    $entry
        ->words(10);
});
```

Of course, you are still able to overwrite this on each entry individually:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->words(null)
```
