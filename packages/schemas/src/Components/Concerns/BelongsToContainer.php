<?php

namespace Filament\Schemas\Components\Concerns;

use Filament\Schemas\Contracts\HasSchemas;
use Filament\Schemas\Schema;
use Livewire\Component;

trait BelongsToContainer
{
    protected Schema $container;

    public function container(Schema $container): static
    {
        $this->container = $container;

        return $this;
    }

    public function getContainer(): Schema
    {
        return $this->container;
    }

    public function getLivewire(): Component & HasSchemas
    {
        return $this->getContainer()->getLivewire();
    }
}
