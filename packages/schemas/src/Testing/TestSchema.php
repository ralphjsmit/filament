<?php

namespace Filament\Schemas\Testing;

use Stringable;

class TestSchema implements Stringable
{
    final public function __construct(
        protected string $name,
    ) {}

    public static function make(string $name): static
    {
        return app(static::class, ['name' => $name]);
    }

    public static function resourceForm(): static
    {
        return app(static::class, ['name' => 'form']);
    }

    public static function resourceInfolist(string $name): static
    {
        return app(static::class, ['name' => 'infolist']);
    }

    public static function actionSchema(int $nestingIndex = 0): static
    {
        return app(static::class, ['name' => "mountedActionSchema{$nestingIndex}"]);
    }

    public function __toString()
    {
        return $this->name;
    }
}
