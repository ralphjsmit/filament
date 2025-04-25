---
title: Slider
---
import Aside from "@components/Aside.astro"
import AutoScreenshot from "@components/AutoScreenshot.astro"
import UtilityInjection from "@components/UtilityInjection.astro"

## Introduction

The slider component allows you to drag a handle across a track to select one or more numeric values:

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
```

<AutoScreenshot name="forms/fields/slider/simple" alt="Slider" version="4.x" />

The [noUiSlider](https://refreshless.com/nouislider) package is used for this component, and much of its API is based upon that library.

If you're saving multiple slider values using Eloquent, you should be sure to add an `array` [cast](https://laravel.com/docs/eloquent-mutators#array-and-json-casting) to the model property:

```php
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $casts = [
        'slider' => 'array',
    ];

    // ...
}
```

<Aside variant="warning">
    Due to their nature, slider fields can never be empty. The value of the field can never be `null` or an empty array. If a slider field is empty, the user will not have a handle to drag across the track.

    Because of this, slider fields have a default value set out of the box, which is set to the minimum value allowed in the [range](#controlling-the-range-of-the-slider) of the slider. The default value is used when a form is empty, for example on the Create page of a resource. To learn more about default values, check out the [`default()` documentation](overview#setting-the-default-value-of-a-field).
</Aside>

## Controlling the range of the slider

The minimum and maximum values that can be selected by the slider are 0 and 100 by default. You can adjust these with the `range()` method:

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(minValue: 40, maxValue: 80)
```

<UtilityInjection set="formFields" version="4.x">As well as allowing static values, the `range()` method also accepts functions to dynamically calculate them. You can inject various utilities into the functions as parameters.</UtilityInjection>

<AutoScreenshot name="forms/fields/slider/range" alt="Slider with a customized range" version="4.x" />
