<?php

namespace Filament\Actions\Concerns;

use Closure;
use Filament\Actions\Events\ActionCalled;
use Filament\Actions\Events\ActionCalling;
use Illuminate\Support\Facades\Event;

trait HasLifecycleHooks
{
    /**
     * @var array<Closure>
     */
    protected array $beforeCallbacks = [];

    /**
     * @var array<Closure>
     */
    protected array $afterCallbacks = [];

    /**
     * @var array<Closure>
     */
    protected array $beforeFormFilledCallbacks = [];

    /**
     * @var array<Closure>
     */
    protected array $afterFormFilledCallbacks = [];

    /**
     * @var array<Closure>
     */
    protected array $beforeFormValidatedCallbacks = [];

    /**
     * @var array<Closure>
     */
    protected array $afterFormValidatedCallbacks = [];

    public function before(?Closure $callback): static
    {
        if ($callback) {
            $this->beforeCallbacks[] = $callback;
        } else {
            // Note: passing null to clear callbacks due to backwards compatibility reasons.
            $this->beforeCallbacks = [];
        }

        return $this;
    }

    public function after(?Closure $callback): static
    {
        if ($callback) {
            $this->afterCallbacks[] = $callback;
        } else {
            // Note: passing null to clear callbacks due to backwards compatibility reasons.
            $this->afterCallbacks = [];
        }

        return $this;
    }

    public function beforeFormFilled(?Closure $callback): static
    {
        if ($callback) {
            $this->beforeFormFilledCallbacks[] = $callback;
        } else {
            // Note: passing null to clear callbacks due to backwards compatibility reasons.
            $this->beforeFormFilledCallbacks = [];
        }

        return $this;
    }

    public function afterFormFilled(?Closure $callback): static
    {
        if ($callback) {
            $this->afterFormFilledCallbacks[] = $callback;
        } else {
            // Note: passing null to clear callbacks due to backwards compatibility reasons.
            $this->afterFormFilledCallbacks = [];
        }

        return $this;
    }

    public function beforeFormValidated(?Closure $callback): static
    {
        if ($callback) {
            $this->beforeFormValidatedCallbacks[] = $callback;
        } else {
            // Note: passing null to clear callbacks due to backwards compatibility reasons.
            $this->beforeFormValidatedCallbacks = [];
        }

        return $this;
    }

    public function afterFormValidated(?Closure $callback): static
    {
        if ($callback) {
            $this->afterFormValidatedCallbacks[] = $callback;
        } else {
            // Note: passing null to clear callbacks due to backwards compatibility reasons.
            $this->afterFormValidatedCallbacks = [];
        }

        return $this;
    }

    public function callBefore(): mixed
    {
        Event::dispatch(ActionCalling::class, $this);

        $result = null;

        foreach ($this->beforeCallbacks as $callback) {
            $result ??= $this->evaluate($callback);
        }

        return $result;
    }

    public function callAfter(): mixed
    {
        try {
            $result = null;

            foreach ($this->afterCallbacks as $callback) {
                $result ??= $this->evaluate($callback);
            }

            return $result;
        } finally {
            Event::dispatch(ActionCalled::class, $this);
        }
    }

    public function callBeforeFormFilled(): mixed
    {
        $result = null;

        foreach ($this->beforeFormFilledCallbacks as $callback) {
            $result ??= $this->evaluate($callback);
        }

        return $result;
    }

    public function callAfterFormFilled(): mixed
    {
        $result = null;

        foreach ($this->afterFormFilledCallbacks as $callback) {
            $result ??= $this->evaluate($callback);
        }

        return $result;
    }

    public function callBeforeFormValidated(): mixed
    {
        $result = null;

        foreach ($this->beforeFormValidatedCallbacks as $callback) {
            $result ??= $this->evaluate($callback);
        }

        return $result;
    }

    public function callAfterFormValidated(): mixed
    {
        $result = null;

        foreach ($this->afterFormValidatedCallbacks as $callback) {
            $result ??= $this->evaluate($callback);
        }

        return $result;
    }
}
