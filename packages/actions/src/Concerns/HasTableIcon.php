<?php

namespace Filament\Actions\Concerns;

use Closure;

trait HasTableIcon
{
    protected string | Closure | null $tableIcon = null;

    public function tableIcon(string | Closure | null $icon): static
    {
        $this->tableIcon = $icon;

        return $this;
    }

    public function getTableIcon(): ?string
    {
        return $this->evaluate($this->tableIcon);
    }
}
