---
title: Slider
---
import AutoScreenshot from "@components/AutoScreenshot.astro"

## Overview

The slider component allows you to select a value from a range of values. The component uses the [noUiSlider library](https://refreshless.com/nouislider/).

<AutoScreenshot name="forms/fields/slider/simple" alt="Slider" version="4.x" />


## Range

All values on the slider are part of a range. The range has a minimum and maximum value. By default, the slider has a range of 0 to 100. This can be changed using the `range()` method:

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->range(['min' => 0, 'max' => 300]),
```

## Pips

Pips allows the generation of points along the slider by injecting Javascript code into the slider component:

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->pips(RawJs::make(<<<'JS'
        {
            mode: 'steps',
            stepped: true,
            density: 5,
        }
    JS))
    ->step(true)
]);
```

<AutoScreenshot name="forms/fields/slider/pips" alt="Slider" version="4.x" />

## Multiple Handles

The number of handles can be set using the `start()` method. This option accepts an array of initial handle positions. A handle is created for every provided value.

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->connect(true)
    ->pips(RawJs::make(<<<'JS'
        {
            mode: 'steps',
            stepped: true,
            density: 5,
        }
    JS))
    ->start([10, 50])
    ->range(['min' => 0, 'max' => 200]),
```

<AutoScreenshot name="forms/fields/slider/increased" alt="Slider" version="4.x" />

## Connect

The `connect()` method is used to control the bar between the handles or the edges of the slider.
```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->connect(true)
    ->start([10, 100])
    ->range(['min' => 0, 'max' => 200]),
```

## Margin

The `margin()` method sets the minimum distance between the handles:
```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->connect(true)
    ->step(true)
    ->start([10, 50])
    ->margin(90)
    ->range(['min' => 0, 'max' => 200]),
```

## Limit

The `limit()` method limits the maximum distance between the handles:

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->connect(true)
    ->step(true)
    ->start([10, 50])
    ->limit(90)
    ->range(['min' => 0, 'max' => 200]),
```
In order to use this method you need at least 2 handles.

## Padding

The `padding()` method limits how close to the slider edges handles can be:

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->start([20, 80])
    ->padding([10,15])
    ->range(['min' => 0, 'max' => 100]),
```

## Step

You can add steps to the slider, which determines the amount the slider changes on movement, allowing it to "snap" into values. This can enabled using the `step()` method:

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->step(true),
```

## Orientation

The orientation of the slider can be set to `horizontal` or `vertical`:
```php
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Enums\SliderOrientation;

Slider::make('slider')
    ->orientation(SliderOrientation::Vertical),
```

## Direction

The direction of the slider can be set to `ltr` or `rtl`:
```php
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Enums\SliderDirection;

Slider::make('slider')
    ->direction(SliderDirection::LTR),
```

## Tooltips

You can add and even format tooltips to the slider handles:

<AutoScreenshot name="forms/fields/slider/tooltips" alt="Slider" version="4.x" />

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->connect(true)
    ->tooltips(true)
    ->format(RawJs::make(<<<'JS'
        wNumb({decimals: 1})
    JS))
    ->start([50, 150])
    ->range(['min' => 0, 'max' => 200]),
```

If you would like to use Aria format for the tooltips, you should use the `ariaFormat()` method:

```php
use Filament\Forms\Components\Slider;

Slider::make('slider')
    ->connect(true)
    ->tooltips(true)
    ->ariaFormat(RawJs::make(<<<'JS'
        wNumb({decimals: 3})
    JS))
    ->start([50, 150])
    ->range(['min' => 0, 'max' => 200]),
```

## Slider Behaviour

The Slider component offers several ways to handle user interaction. The range can be made draggable, or handles can move to tapped positions. All these effects are optional, and can be enabled by adding their keyword to the behaviour option.

The slider handle can be `tapped`, `dragged`, `fixed` etc. The slider behaviour is defined by `SliderBehaviour::Drag`,`SliderBehaviour::DragAll`,`SliderBehaviour::Tap`,`SliderBehaviour::Fixed`,`SliderBehaviour::Snap`,`SliderBehaviour::Unconstrained`,`SliderBehaviour::InvertConnects` and `SliderBehaviour::None`.

```php
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Enums\SliderBehaviour;

Slider::make('slider')
    ->behaviour([SliderBehaviour::Drag]),
```