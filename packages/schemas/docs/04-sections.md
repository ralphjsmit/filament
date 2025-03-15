---
title: Section
---
import AutoScreenshot from "@components/AutoScreenshot.astro"
import UtilityInjection from "@components/UtilityInjection.astro"

## Overview

You may want to separate your fields into sections, each with a heading and description. To do this, you can use a section component:

```php
use Filament\Schemas\Components\Section;

Section::make('Rate limiting')
    ->description('Prevent abuse by limiting the number of requests per period')
    ->schema([
        // ...
    ])
```

<UtilityInjection set="layoutComponents" version="4.x">As well as allowing static values, the `make()` and `description()` methods also accept functions to dynamically calculate them. You can inject various utilities into the function as parameters.</UtilityInjection>

<AutoScreenshot name="schemas/layout/section/simple" alt="Section" version="4.x" />

You can also use a section without a header, which just wraps the components in a simple card:

```php
use Filament\Schemas\Components\Section;

Section::make()
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="schemas/layout/section/without-header" alt="Section without header" version="4.x" />

## Adding an icon to the section's header

You may add an [icon](../../styling/icons) to the section's header using the `icon()` method:

```php
use Filament\Schemas\Components\Section;
use Filament\Support\Icons\Heroicon;

Section::make('Cart')
    ->description('The items you have selected for purchase')
    ->icon(Heroicon::ShoppingBag)
    ->schema([
        // ...
    ])
```

<UtilityInjection set="layoutComponents" version="4.x">As well as allowing a static value, the `icon()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

<AutoScreenshot name="schemas/layout/section/icons" alt="Section with icon" version="4.x" />

## Positioning the heading and description aside

You may use the `aside()` to align heading & description on the left, and the components inside a card on the right:

```php
use Filament\Schemas\Components\Section;

Section::make('Rate limiting')
    ->description('Prevent abuse by limiting the number of requests per period')
    ->aside()
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="schemas/layout/section/aside" alt="Section with heading and description aside" version="4.x" />

Optionally, you may pass a boolean value to control if the section should be aside or not:

```php
use Filament\Schemas\Components\Section;

Section::make('Rate limiting')
    ->description('Prevent abuse by limiting the number of requests per period')
    ->aside(FeatureFlag::active())
    ->schema([
        // ...
    ])
```

<UtilityInjection set="layoutComponents" version="4.x">As well as allowing a static value, the `aside()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

## Collapsing sections

Sections may be `collapsible()` to optionally hide long content:

```php
use Filament\Schemas\Components\Section;

Section::make('Cart')
    ->description('The items you have selected for purchase')
    ->schema([
        // ...
    ])
    ->collapsible()
```

Your sections may be `collapsed()` by default:

```php
use Filament\Schemas\Components\Section;

Section::make('Cart')
    ->description('The items you have selected for purchase')
    ->schema([
        // ...
    ])
    ->collapsed()
```

<AutoScreenshot name="schemas/layout/section/collapsed" alt="Collapsed section" version="4.x" />

Optionally, the `collapsible()` and `collapsed()` methods accept a boolean value to control if the section should be collapsible and collapsed or not:

```php
use Filament\Schemas\Components\Section;

Section::make('Cart')
    ->description('The items you have selected for purchase')
    ->schema([
        // ...
    ])
    ->collapsible(FeatureFlag::active())
    ->collapsed(FeatureFlag::active())
```

<UtilityInjection set="layoutComponents" version="4.x">As well as allowing static values, the `collapsible()` and `collapsed()` methods also accept functions to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

### Persisting collapsed sections

You can persist whether a section is collapsed in local storage using the `persistCollapsed()` method, so it will remain collapsed when the user refreshes the page:

```php
use Filament\Schemas\Components\Section;

Section::make('Cart')
    ->description('The items you have selected for purchase')
    ->schema([
        // ...
    ])
    ->collapsible()
    ->persistCollapsed()
```

To persist the collapse state, the local storage needs a unique ID to store the state. This ID is generated based on the heading of the section. If your section does not have a heading, or if you have multiple sections with the same heading that you do not want to collapse together, you can manually specify the `id()` of that section to prevent an ID conflict:

```php
use Filament\Schemas\Components\Section;

Section::make('Cart')
    ->description('The items you have selected for purchase')
    ->schema([
        // ...
    ])
    ->collapsible()
    ->persistCollapsed()
    ->id('order-cart')
```

Optionally, the `persistCollapsed()` method accepts a boolean value to control if the section should persist its collapsed state or not:

```php
use Filament\Schemas\Components\Section;

Section::make('Cart')
    ->description('The items you have selected for purchase')
    ->schema([
        // ...
    ])
    ->collapsible()
    ->persistCollapsed(FeatureFlag::active())
```

<UtilityInjection set="layoutComponents" version="4.x">As well as allowing static values, the `persistCollapsed()` and `id()` methods also accept functions to dynamically calculate them. You can inject various utilities into the function as parameters.</UtilityInjection>

## Compact section styling

When nesting sections, you can use a more compact styling:

```php
use Filament\Schemas\Components\Section;

Section::make('Rate limiting')
    ->description('Prevent abuse by limiting the number of requests per period')
    ->schema([
        // ...
    ])
    ->compact()
```

<AutoScreenshot name="schemas/layout/section/compact" alt="Compact section" version="4.x" />

Optionally, the `compact()` method accepts a boolean value to control if the section should be compact or not:

```php
use Filament\Schemas\Components\Section;

Section::make('Rate limiting')
    ->description('Prevent abuse by limiting the number of requests per period')
    ->schema([
        // ...
    ])
    ->compact(FeatureFlag::active())
```

<UtilityInjection set="layoutComponents" version="4.x">As well as allowing a static value, the `compact()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

## Using grid columns within a section

You may use the `columns()` method to easily create a [grid](grid) within the section:

```php
use Filament\Schemas\Components\Section;

Section::make('Heading')
    ->schema([
        // ...
    ])
    ->columns(2)
```

<UtilityInjection set="layoutComponents" version="4.x">As well as allowing a static value, the `columns()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>
