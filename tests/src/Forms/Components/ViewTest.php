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
    $view = View::make('test')
        ->viewData([
            'key_a' => 'Value A',
        ])
        ->viewData(function () {
            // Closure result will be merged with the top-level array...
            return ['string_keyed_closure' => 'string_keyed_closure'];
        })
        ->viewData(function () {
            // Closure result will be merged with the top-level array...
            return ['string_keyed_closure_b' => 'string_keyed_closure_b'];
        });

    expect($view)
        ->getViewData()->toBe([
            'key_a' => 'Value A',
            'string_keyed_closure' => 'string_keyed_closure',
            'string_keyed_closure_b' => 'string_keyed_closure_b',
        ]);
});
