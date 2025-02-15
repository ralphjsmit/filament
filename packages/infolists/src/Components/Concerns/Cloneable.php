<?php

namespace Filament\Infolists\Components\Concerns;

use Closure;
use Filament\Infolists\Components\Component;

trait Cloneable
{
    /**
     * @var array<Closure>
     */
    protected array $cloneCallbacks = [];

    protected function cloneChildComponents(): static
    {
        if (is_array($this->childComponents)) {
            $this->childComponents = array_map(
                fn (Component $component): Component => $component->getClone(),
                $this->childComponents,
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
        $clone->cloneChildComponents();

        foreach ($this->cloneCallbacks as $callback) {
            $clone->evaluate($callback->bindTo($clone), [
                'clone' => $clone,
                'original' => $this,
            ]);
        }

        return $clone;
    }
}
