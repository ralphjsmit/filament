<?php

use Filament\Facades\Filament;
use Filament\Tests\Fixtures\Models\Ticket;
use Filament\Tests\TestCase;
use Illuminate\View\ComponentAttributeBag;

use function Filament\get_authorization_response;
use function Filament\Support\prepare_inherited_attributes;

uses(TestCase::class);

it('will prepare attributes', function (): void {
    $bag = new ComponentAttributeBag([
        'style' => 'color:red',
    ]);

    $attributes = prepare_inherited_attributes($bag);

    expect($attributes->getAttributes())->toBe([
        'style' => 'color:red',
    ]);
});

it('will prepare Alpine attributes', function (): void {
    $bag = new ComponentAttributeBag([
        'x-data' => '{foo:bar}',
    ]);

    $attributes = prepare_inherited_attributes($bag);

    expect($attributes->getAttributes())->toBe([
        'x-data' => '{foo:bar}',
    ]);
});

it('will prepare data attributes', function (): void {
    $bag = new ComponentAttributeBag([
        'data-foo' => 'bar',
    ]);

    $attributes = prepare_inherited_attributes($bag);

    expect($attributes->getAttributes())->toBe([
        'data-foo' => 'bar',
    ]);
});


it('can handle policy being an object when method does not exist', function (): void {
    Filament::getCurrentOrDefaultPanel()->strictAuthorization();

    get_authorization_response('edit', Ticket::class);
})->throws(Exception::class, 'Strict authorization mode is enabled, but no [edit()] method was found on [Filament\Tests\Fixtures\Policies\TicketPolicy].');
