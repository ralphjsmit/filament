<?php

namespace Filament\Pages\Dashboard\Components;

use Closure;
use Filament\Support\Components\Component;
use Filament\Support\Concerns\HasBadge;
use Filament\Support\Concerns\HasExtraAttributes;
use Filament\Support\Concerns\HasIcon;

class Tab extends Component
{
    use HasBadge;
    use HasExtraAttributes;
    use HasIcon;

    protected string | Closure | null $label = null;

    public function __construct(string | Closure | null $label = null)
    {
        $this->label($label);
    }

    public static function make(string | Closure | null $label = null): static
    {
        $static = app(static::class, ['label' => $label]);
        $static->configure();

        return $static;
    }

    public function label(string | Closure | null $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->evaluate($this->label);
    }
}
