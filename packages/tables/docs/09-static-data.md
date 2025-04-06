---
title: Static data
---

## Introduction

Filament's table builder was originally designed to render data directly from a SQL database connected to a Laravel app. It uses Eloquent models to fetch the data, and each row in a Filament table is represented by a row in a database table, which has an Eloquent record. However, there are times when this is not possible or practical. For example, you may want to display data not stored in a database, or you may want to display data stored in a database but is not accessible via Eloquent.

To use static data in a table instead of it being fetched through an Eloquent model, you can pass a function to the `records()` method of the table builder that returns an array of data. This function will be called when the table is rendered, and the data will be used to populate the table.

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->records(function (): array {
            return [
                1 => [
                    'title' => 'First item',
                    'slug' => 'first-item',
                    'isFeatured' => true,
                ],
                2 => [
                    'title' => 'Second item',
                    'slug' => 'second-item',
                    'isFeatured' => false,
                ],
                3 => [
                    'title' => 'Third item',
                    'slug' => 'third-item',
                    'isFeatured' => true,
                ],
            ];
        })
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('slug'),
            IconColumn::make('isFeatured')
                ->boolean(),
        ]);
}
```

## Columns

[Columns](columns) in the table work similarly to how they do when using Eloquent models. Instead of the column name representing an attribute or relationship on an Eloquent model, the column name represents a key in the array of data returned by the `records()` function.

When accessing the current record in a column function, you should adjust the type of the `$record` parameter to be `array` instead of `Model`. For example, to define a column with a [`state()` function](columns#setting-the-state-of-a-column), you could do the following:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('isFeatured')
    ->state(function (array $record): string {
        return $record['isFeatured'] ? 'Featured' : 'Not featured';
    });
```

### Sorting

Filament's built-in [sorting](columns#sorting) function uses SQL to sort the data. When using static data, you need to sort it yourself. This may sound like it should be handled automatically, but there are likely many situations where the sorting logic can be already handled by a layer of your data source, such as a custom database query or API call.

To get the currently sorted column and direction, you can inject `$sortColumn` and `$sortDirection` into the `records()` function. These variables will be `null` if no column is currently being sorted.

In this example, a [collection](https://laravel.com/docs/collections#method-sortby) is used to sort the data by key. The collection is returned instead of an array, and Filament can recognize it in the same way. However, using a collection like this is not necessary to be able to use this feature.

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Collection;

public function table(Table $table): Table
{
    return $table
        ->records(function (?string $sortColumn, ?string $sortDirection): Collection {
            return collect([
                1 => [
                    'title' => 'First item',
                    'slug' => 'first-item',
                    'isFeatured' => true,
                ],
                // ...
            ])
                ->when(
                    filled($sortColumn),
                    fn (Collection $data): Collection => $data->sortBy($sortColumn, SORT_REGULAR, $sortDirection === 'desc'),
                )
                ->all();
        })
        ->columns([
            TextColumn::make('title')
                ->sortable(),
            // ...
        ]);
}
```

### Searching

Filament's built-in [searching](columns#searching) function uses SQL to search the data. When using static data, you need to search it yourself. This may sound like it should be handled automatically, but there are likely many situations where the searching logic can be already handled by a layer of your data source, such as a custom database query or API call.

To get the current search query, you can inject `$search` into the `records()` function. This variable will be `null` if no search query is currently being used.

In this example, a [collection](https://laravel.com/docs/collections#method-filter) is used to filter the data by the search query. The collection is returned instead of an array, and Filament can recognize it in the same way. However, using a collection like this is not necessary to be able to use this feature.

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

public function table(Table $table): Table
{
    return $table
        ->records(function (?string $search): Collection {
            return collect([
                1 => [
                    'title' => 'First item',
                    'slug' => 'first-item',
                    'isFeatured' => true,
                ],
                // ...
            ])
                ->when(
                    filled($search),
                    fn (Collection $data) => $data->filter(fn (array $record): bool => str_contains(Str::lower($record['title']), Str::lower($search))),
                )
                ->all();
        })
        ->columns([
            TextColumn::make('title'),
            // ...
        ])
        ->searchable();
}
```

In this example, specific columns like `title` do not need to be `searchable()` since the searching behaviour is defined within the `records()` function. However, if you want to enable the search field without enabling search for a specific column, you can use the `searchable()` method on the entire table.

#### Searching individual columns

The [individual column searches](#searching-individually) feature allows you to render a search field separately for each column, so the data can be filtered more precisely. When using static data, you need to implement this feature yourself.

Instead of injecting `$search` into the `records()` function, you can inject an array of `$columnSearches`, which contains the search queries for each column.

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

public function table(Table $table): Table
{
    return $table
        ->records(function (array $columnSearches): Collection {
            return collect([
                1 => [
                    'title' => 'First item',
                    'slug' => 'first-item',
                    'isFeatured' => true,
                ],
                // ...
            ])
                ->when(
                    filled($columnSearches['title'] ?? null),
                    fn (Collection $data) => $data->filter(fn (array $record): bool => str_contains(Str::lower($record['title']), Str::lower($columnSearches['title']))),
                )
                ->all();
        })
        ->columns([
            TextColumn::make('title')
                ->searchable(isIndividual: true),
            // ...
        ]);
}
```

## Filters

As well as [searching](#searching), Filament provides a way to filter data using [filters](filters). When using static data, you need to filter it yourself. Filament gives you access to an array of filter data by injecting `$filters` into the `records()` function. The array contains the names of the filters as keys and the values of the filter forms themselves.

In this example, a [collection](https://laravel.com/docs/collections#method-where) is used to filter the data. The collection is returned instead of an array, and Filament can recognize it in the same way. However, using a collection like this is not necessary to be able to use this feature.

```php
use Filament\Forms\Components\DatePicker;use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Collection;

public function table(Table $table): Table
{
    return $table
        ->records(function (array $filters): Collection {
            return collect([
                1 => [
                    'title' => 'First item',
                    'slug' => 'first-item',
                    'author' => 'dan',
                    'isFeatured' => true,
                    'creationDate' => '2021-01-01',
                ],
                // ...
            ])
                ->when(
                    filled($filters['isFeatured']['isActive'] ?? null),
                    fn (Collection $data) => $data->where('isFeatured', true),
                )
                ->when(
                    filled($filters['author']['value'] ?? null),
                    fn (Collection $data) => $data->where('author', $filters['author']['value']),
                )
                ->when(
                    filled($filters['creationDate']['date'] ?? null),
                    fn (Collection $data) => $data->where('creationDate', $filters['creationDate']['date']),
                )
                ->all();
        })
        ->columns([
            TextColumn::make('title'),
            // ...
        ])
        ->filters([
            Filter::make('isFeatured'),
            SelectFilter::make('author')
                ->options([
                    'dan' => 'Dan Harrin',
                    'ryan' => 'Ryan Chandler',
                ]),
            Filter::make('creationDate')
                ->schema([
                    DatePicker::make('date'),
                ]),
        ]);
}
```

Please note how the filter values are not easily accessible via `$filters['filterName']`, but instead through an additional key. This is because a filter can contain multiple form fields, each with their own name. The name of the form field is used as the key inside each filter's array of data. In this situation:

- A simple checkbox or toggle filter without a custom schema, like the `featured` filter, will have a key of `isActive`. So accessing the checkbox value is done via `$filters['featured']['isActive']`.
- A select filter, like the `author` filter, will have a key of `value`. So accessing the select value is done via `$filters['author']['value']`.
- A filter with a custom schema, like the `creationDate` filter, will use the name of the form field/s in the array of data. In this example, there is a `date` field in the `creationDate` filter, so accessing the date value is done via `$filters['creationDate']['date']`.

## Pagination

Filament's built-in [pagination](overview#pagination) feature uses SQL to paginate the data. When using static data, you need to paginate it yourself. This may sound like it should be handled automatically, but there are likely many situations where the pagination logic can be already handled by a layer of your data source, such as a custom database query or API call. The `$page` and `$recordsPerPage` arguments are injected into the `records()` function, and you can use them to paginate the data. A `LengthAwarePaginator` should be returned from the `records()` function, and Filament will handle the pagination links and other pagination features for you:

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

public function table(Table $table): Table
{
    return $table
        ->records(function (int $page, int $recordsPerPage): LengthAwarePaginator {
            $records = collect([
                1 => [
                    'title' => 'First item',
                    'slug' => 'first-item',
                    'isFeatured' => true,
                ],
                // ...
            ])->forPage($page, $recordsPerPage);
            
            return new LengthAwarePaginator(
                $records,
                total: 100, // Total number of records across pages
                perPage: $recordsPerPage,
                currentPage: $page,
            );
        })
        ->columns([
            TextColumn::make('title'),
            // ...
        ]);
}
```

In this example, the `forPage()` method is used to paginate the data. This is very likely not the best way to efficiently paginate data from a query or API, but it is a simple way to demonstrate how to paginate data from a static array.

## Actions

Actions work in the same way on static table data as they do on Eloquent models. The only difference is that the `$record` parameter in the action's callback function will be an array instead of a model.

```php
use Filament\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->records(function (): array {
            // ...
        })
        ->columns([
            // ...
        ])
        ->actions([
            Action::make('feature')
                ->requiresConfirmation()
                ->action(function (array $record): void {
                    // Do something with the array of `$record` data
                }),
        ]);
}
```

### Bulk actions

For actions that interact with a single record, the record is always present on the current table page, so the `records()` method can be used to fetch the data. However for bulk actions, records can be selected across pagination pages. If you would like to use a bulk action that selects records across pages, you need to give Filament a way to fetch records across pages, otherwise it will only return the records from the current page. The `resolveSelectedRecordsUsing()` method should accept a function which has a `$keys` parameter, and returns an array of record data:

```php
use Filament\Actions\BulkAction;
use Filament\Tables\Table;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

public function table(Table $table): Table
{
    return $table
        ->records(function (): array {
            // ...
        })
        ->resolveSelectedRecordsUsing(function (array $keys): array {
            return Arr::only([
                1 => [
                    'title' => 'First item',
                    'slug' => 'first-item',
                    'isFeatured' => true,
                ],
                2 => [
                    'title' => 'Second item',
                    'slug' => 'second-item',
                    'isFeatured' => false,
                ],
                3 => [
                    'title' => 'Third item',
                    'slug' => 'third-item',
                    'isFeatured' => true,
                ],
            ], $keys);
        })
        ->columns([
            // ...
        ])
        ->actions([
            BulkAction::make('feature')
                ->requiresConfirmation()
                ->action(function (Collection $records): void {
                    // Do something with the collection of `$records` data
                }),
        ]);
}
```
