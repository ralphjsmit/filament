<?php

use Filament\Infolists\Components\Component;
use Filament\Tests\TestCase;

uses(TestCase::class);

it('can clone', function () {
    $cloneCallbackCount = 0;
    $cloneCallbackClone = null;
    $cloneCallbackOriginal = null;

    $component = (new Component)
        ->afterClone(function (Component $clone, Component $original) use (&$cloneCallbackCount, &$cloneCallbackClone, &$cloneCallbackOriginal) {
            $cloneCallbackCount++;
            $cloneCallbackClone = $clone;
            $cloneCallbackOriginal = $original;
        });

    $clone = $component->getClone();

    expect($cloneCallbackCount)
        ->toBe(1);

    expect($cloneCallbackClone)
        ->not->toBe($component)
        ->toBe($clone);

    expect($cloneCallbackOriginal)
        ->toBe($component);
});
