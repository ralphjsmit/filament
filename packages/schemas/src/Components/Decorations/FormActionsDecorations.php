<?php

namespace Filament\Schemas\Components\Decorations;

use Closure;
use Filament\Actions\Action;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Decorations\Layouts\DecorationsLayout;
use Filament\Support\Concerns\HasAlignment;

class FormActionsDecorations extends DecorationsLayout
{
    use HasAlignment;

    protected string $view = 'filament-schema::components.decorations.layouts.form-actions-decorations';

    protected bool | Closure $isSticky = false;

    protected bool | Closure $isFullWidth = false;

    /**
     * @param  array<Component | Action | array<Component | Action>>  $decorations
     */
    public function __construct(
        protected array $decorations,
    ) {}

    /**
     * @param  array<Component | Action | array<Component | Action>>  $decorations
     */
    public static function make(
        array $decorations = [],
    ): static {
        $static = app(static::class, [
            'decorations' => $decorations,
        ]);
        $static->configure();

        return $static;
    }

    public function hasDecorations(): bool
    {
        return count($this->getDecorations()) > 0;
    }

    /**
     * @return array<Component | Action | array<Component | Action>>
     */
    public function getDecorations(): array
    {
        return $this->prepareDecorations($this->decorations);
    }

    /**
     * @return array<string, Action>
     */
    public function getActions(): array
    {
        return $this->extractActionsFromDecorations($this->getDecorations());
    }

    public function sticky(bool | Closure $condition = true): static
    {
        $this->isSticky = $condition;

        return $this;
    }

    public function isSticky(): bool
    {
        return (bool) $this->evaluate($this->isSticky);
    }

    public function fullWidth(bool | Closure $condition = true): static
    {
        $this->isFullWidth = $condition;

        return $this;
    }

    public function isFullWidth(): bool
    {
        return (bool) $this->evaluate($this->isFullWidth);
    }
}
