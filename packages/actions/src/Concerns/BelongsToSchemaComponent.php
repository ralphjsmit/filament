<?php

namespace Filament\Actions\Concerns;

use Filament\Schemas\Components\Component;

trait BelongsToSchemaComponent
{
    protected ?Component $schemaComponent = null;

    public function schemaComponent(?Component $component): static
    {
        $this->schemaComponent = $component;

        return $this;
    }

    public function getSchemaComponent(): ?Component
    {
        return $this->schemaComponent;
    }
}
