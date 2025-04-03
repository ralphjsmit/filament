<?php

use Filament\Forms\ComponentContainer;
use Filament\Support\Colors\Color;
use Filament\Support\Components\Component;
use Filament\Tests\Forms\Fixtures\Livewire;
use Filament\Tests\TestCase;
use Illuminate\Support\Str;

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
