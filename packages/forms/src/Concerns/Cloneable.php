<?php

namespace Filament\Forms\Concerns;

use Closure;
use Filament\Forms\Components\Component;

trait Cloneable
{
    /**
     * @var array<Closure>
     */
    protected array $cloneCallbacks = [];

    protected function cloneComponents(): static
    {
        if (is_array($this->components)) {
            $this->components = array_map(
                fn (Component $component): Component => $component
                    ->container($this)
                    ->getClone(),
                $this->components,
            );
        }

        return $this;
    }

    public function afterClone(Closure $callback): static
    {
        $this->cloneCallbacks[] = $callback;

        return $this;
    }

    public function getClone(): static
    {
        $clone = clone $this;
        $clone->flushCachedAbsoluteStatePath();
        $clone->cloneComponents();

        foreach ($this->cloneCallbacks as $callback) {
            $clone->evaluate($callback->bindTo($clone), [
                'clone' => $clone,
                'original' => $this,
            ]);
        }

        return $clone;
    }
}
