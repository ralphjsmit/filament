---
title: Text
---
import Aside from "@components/Aside.astro"
import AutoScreenshot from "@components/AutoScreenshot.astro"
import UtilityInjection from "@components/UtilityInjection.astro"

## Overview

Text can be inserted into a schema using the `Text` component. Text content is passed to the `make()` method:

```php
use Filament\Schemas\Components\Text;

Text::make('Modifying these permissions may give users access to sensitive information.')
```

<AutoScreenshot name="primes/text/simple" alt="Text" version="4.x" />

To render raw HTML content, you can pass an `HtmlString` object to the `make()` method:

```php
use Filament\Schemas\Components\Text;
use Illuminate\Support\HtmlString;

Text::make(new HtmlString('<strong>Warning:</strong> Modifying these permissions may give users access to sensitive information.'))
```

<Aside variant="danger">
    Be aware that you will need to ensure that the HTML is safe to render, otherwise your application will be vulnerable to XSS attacks.
</Aside>

<AutoScreenshot name="primes/text/html" alt="Text with HTML" version="4.x" />

To render Markdown, you can use Laravel's `str()` helper to convert Markdown to HTML, and then transform it into an `HtmlString` object:

```php
use Filament\Schemas\Components\Text;

Text::make(
    str('**Warning:** Modifying these permissions may give users access to sensitive information.')
        ->inlineMarkdown()
        ->toHtmlString(),
)
```

<UtilityInjection set="primeComponents" version="4.x">As well as allowing a static value, the `make()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

## Customizing the color

You may set a [color](../../styling/colors) for the text:

```php
use Filament\Schemas\Components\Text;

Text::make('Information')
    ->color('info')
```

<UtilityInjection set="infolistEntries" version="4.x">As well as allowing a static value, the `color()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

<AutoScreenshot name="primes/text/color" alt="Text in the info color" version="4.x" />

## Displaying as a "badge"

By default, text is quite plain and has no background color. You can make it appear as a "badge" instead using the `badge()` method. A great use case for this is with statuses, where may want to display a badge with a [color](#customizing-the-color) that matches the status:

```php
use Filament\Schemas\Components\Text;

Text::make('Warning')
    ->color('warning')
    ->badge()
```

<AutoScreenshot name="primes/text/badge" alt="Text as badge" version="4.x" />

Optionally, you may pass a boolean value to control if the text should be in a badge or not:

```php
use Filament\Schemas\Components\Text;

Text::make('Warning')
    ->color('warning')
    ->badge(FeatureFlag::active())
```

<UtilityInjection set="infolistEntries" version="4.x">As well as allowing a static value, the `badge()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>

### Adding an icon to a badge

You may add other things to the badge, like an [icon](../../styling/icons):

```php
use Filament\Schemas\Components\Text;
use Filament\Support\Icons\Heroicon;

Text::make('Warning')
    ->color('warning')
    ->badge()
    ->icon(Heroicon::ExclamationTriangle)
```

<AutoScreenshot name="primes/text/badge-icon" alt="Text as badge with an icon" version="4.x" />
