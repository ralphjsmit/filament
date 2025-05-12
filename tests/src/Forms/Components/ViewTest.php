<?php

use Filament\Forms\Components\View;
use Filament\Tests\TestCase;

uses(TestCase::class);

it('can have view data', function () {
    $view = View::make('test')->viewData([
        'key_a' => 'Value A',
        'key_b' => 'Value B',
    ]);

    expect($view)
        ->getViewData()->toBe([
            'key_a' => 'Value A',
            'key_b' => 'Value B',
        ]);
});

it('can have view data with closure on numeric keys', function () {
    $view = View::make('test')->viewData([
        'key_a' => 'Value A',
        fn() => ['string_keyed_closure' => 'string_keyed_closure'],
    ]);

    expect($view)
        ->getViewData()->toBe([
            'key_a' => 'Value A',
                'string_keyed_closure' => 'string_keyed_closure',
        ]);
});

it('can have view data with closure on string keys', function () {
    $view = View::make('test')->viewData([
        'key_a' => 'Value A',
        'key_b' => fn() => ['string_keyed_closure' => 'string_keyed_closure'],
    ]);

    expect($view)
        ->getViewData()->toBe([
            'key_a' => 'Value A',
            'key_b' => [
                'string_keyed_closure' => 'string_keyed_closure',
            ]
        ]);
});
