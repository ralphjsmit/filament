<?php

namespace Filament\Infolists\Concerns;

use Closure;

trait Cloneable
{
    /**
     * @var array<Closure>
     */
    protected array $cloneCallbacks = [];

    public function afterClone(Closure $callback): static
    {
        $this->cloneCallbacks[] = $callback;

        return $this;
    }

    public function cloneComponents(): static
    {
        $components = [];

        foreach ($this->getComponents(withHidden: true) as $component) {
            $components[] = $component->getClone();
        }

        return $this->components($components);
    }

    public function getClone(): static
    {
        $clone = clone $this;
        $clone->flushCachedAbsoluteStatePath();
        $clone->cloneComponents();

        foreach ($this->cloneCallbacks as $callback) {
            $clone->evaluate(
                value: $callback->bindTo($clone),
                namedInjections: ['clone' => $clone, 'original' => $this]
            );
        }

        return $clone;
    }
}
