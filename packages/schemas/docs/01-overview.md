---
title: Overview
---
import AutoScreenshot from "@components/AutoScreenshot.astro"

## What is a schema?

Schemas allow you to build UIs using an array of "component" PHP objects as configuration. They are used throughout Filament to render UI. Filament packages provide you with various components:

- [Form fields](forms) accept input from the user, for example, a text input, a select, or a checkbox. They come with integrated validation.
- [Infolist entries](infolists) are components for rendering "description lists." Entries are key-value UI elements that can present read-only information like text, icons, and images. The data for an infolist can be sourced from anywhere but commonly comes from an individual Eloquent record.
- [Layout components](layouts) are used to structure the components. For example, a grid, tabs, or a multi-step form wizard.
- [Prime components](primes) are simple components that are used to render basic stand-alone static content, such as text, images, and buttons (actions).

Schemas act as a container for many components, and you can add any combination of components within them. Components can also nest child schemas within them, allowing for an infinite level of nesting.

A schema is represented by a `Filament\Schemas\Schema` object, and you can pass an array of components to it in the `components()` method.

## An example schema

For example, you may want to build a form with a schema. The name of the schema is usually dictated by the name of the method that it is defined in (`form` in this example). Filament creates the `Schema` object and passes it to the method, which then returns the schema with the components added:

```php
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

$schema
    ->components([
        Grid::make(2)
            ->schema([
                Section::make('Details')
                    ->schema([
                        TextInput::make('name'),
                        Select::make('position')
                            ->options([
                                'developer' => 'Developer',
                                'designer' => 'Designer',
                            ]),
                        Checkbox::make('is_admin'),
                    ]),
                Section::make('Auditing')
                    ->schema([
                        TextEntry::make('created_at')
                            ->dateTime(),
                        TextEntry::make('updated_at')
                            ->dateTime(),
                    ]),
            ]),
    ])
```

<AutoScreenshot name="schemas/overview/example" alt="Example schema" version="4.x" />

"Grid" is a layout component that renders multiple components together in a responsive grid. The number of columns in the grid is specified in the `make()` method. The `schema()` method is used to nest components within the grid.

"Section" is another layout component that renders multiple components together in a card, with a heading at the top.

"TextInput", "Select", and "Checkbox" are form components that accept input from the user.

"TextEntry" is an infolist component that displays read-only information. In this example, it is used to display the created and updated timestamps of the record. The `dateTime()` method is used to format the timestamps as dates and times.

The schema object is the container for the components and can now be rendered. Rendering the schema will render all the components within it in the correct layout.
