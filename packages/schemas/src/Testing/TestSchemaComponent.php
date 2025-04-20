<?php

namespace Filament\Schemas\Testing;

use Stringable;

class TestSchemaComponent implements Stringable
{
    final public function __construct(
        protected string $name,
    ) {}

    public static function make(string $name): static
    {
        return app(static::class, ['name' => $name]);
    }

    public static function inResourceForm(string $name): static
    {
        return app(static::class, ['name' => "form.{$name}"]);
    }

    public static function inResourceInfolist(string $name): static
    {
        return app(static::class, ['name' => "infolist.{$name}"]);
    }

    public static function inActionSchema(string $name, int $actionNestingIndex = 0): static
    {
        return app(static::class, ['name' => "mountedActionSchema{$actionNestingIndex}.{$name}"]);
    }

    public function __toString()
    {
        return $this->name;
    }
}
