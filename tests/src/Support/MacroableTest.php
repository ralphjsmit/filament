<?php

use Filament\Support\Components\Component;
use Filament\Tests\TestCase;

uses(TestCase::class);

it('can macro a component', function () {
    expect(Component::hasMacro('someMacro'))
        ->toBeFalse();

    expect(Component::hasMacro('someMacro'))
        ->toBeFalse();

    Component::macro('someMacro', fn () => 'Hello');

    expect(Component::hasMacro('someMacro'))
        ->toBeTrue();
});
