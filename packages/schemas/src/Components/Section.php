<?php

namespace Filament\Schemas\Components;

use Closure;
use Filament\Actions\Action;
use Filament\Schemas\Components\Concerns\CanBeCollapsed;
use Filament\Schemas\Components\Concerns\CanBeCompacted;
use Filament\Schemas\Components\Concerns\EntanglesStateWithSingularRelationship;
use Filament\Schemas\Components\Concerns\HasDescription;
use Filament\Schemas\Components\Concerns\HasFooterActions;
use Filament\Schemas\Components\Concerns\HasHeaderActions;
use Filament\Schemas\Components\Concerns\HasHeading;
use Filament\Schemas\Components\Contracts\CanConcealComponents;
use Filament\Schemas\Components\Contracts\CanEntangleWithSingularRelationships;
use Filament\Schemas\Components\Decorations\Layouts\AlignDecorations;
use Filament\Schemas\Components\Decorations\Layouts\DecorationsLayout;
use Filament\Support\Concerns\CanBeContained;
use Filament\Support\Concerns\HasExtraAlpineAttributes;
use Filament\Support\Concerns\HasIcon;
use Filament\Support\Concerns\HasIconColor;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Str;

class Section extends Component implements CanConcealComponents, CanEntangleWithSingularRelationships, Contracts\HasFooterActions, Contracts\HasHeaderActions
{
    use CanBeCollapsed;
    use CanBeCompacted;
    use CanBeContained;
    use EntanglesStateWithSingularRelationship;
    use HasDescription;
    use HasExtraAlpineAttributes;
    use HasFooterActions;
    use HasHeaderActions;
    use HasHeading;
    use HasIcon;
    use HasIconColor;

    /**
     * @var view-string
     */
    protected string $view = 'filament-schema::components.section';

    protected bool | Closure | null $isAside = null;

    protected bool | Closure $isFormBefore = false;

    const AFTER_HEADER_DECORATIONS = 'after_header';

    const FOOTER_DECORATIONS = 'footer';

    /**
     * @param  string | array<Component> | Htmlable | Closure | null  $heading
     */
    final public function __construct(string | array | Htmlable | Closure | null $heading = null)
    {
        is_array($heading)
            ? $this->childComponents($heading)
            : $this->heading($heading);
    }

    /**
     * @param  string | array<Component> | Htmlable | Closure | null  $heading
     */
    public static function make(string | array | Htmlable | Closure | null $heading = null): static
    {
        $static = app(static::class, ['heading' => $heading]);
        $static->configure();

        return $static;
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->columnSpan('full');

        $this->key(function (Section $component): ?string {
            if ($statePath = $component->getStatePath(isAbsolute: false)) {
                return $statePath;
            }

            $heading = $this->getHeading();

            if (blank($heading)) {
                return null;
            }

            return Str::slug(Str::transliterate($heading, strict: true));
        });

        $this->afterHeader(fn (Section $component): array => $component->getHeaderActions());
        $this->setUpFooterActions();
    }

    public function aside(bool | Closure | null $condition = true): static
    {
        $this->isAside = $condition;

        return $this;
    }

    public function canConcealComponents(): bool
    {
        return $this->isCollapsible();
    }

    public function isAside(): bool
    {
        return (bool) ($this->evaluate($this->isAside) ?? false);
    }

    public function formBefore(bool | Closure $condition = true): static
    {
        $this->isFormBefore = $condition;

        return $this;
    }

    public function isFormBefore(): bool
    {
        return (bool) $this->evaluate($this->isFormBefore);
    }

    /**
     * @param  array<Component | Action> | DecorationsLayout | Component | Action | string | Closure | null  $decorations
     */
    public function afterHeader(array | DecorationsLayout | Component | Action | string | Closure | null $decorations): static
    {
        $this->decorations(
            static::AFTER_HEADER_DECORATIONS,
            $decorations,
            makeDefaultLayoutUsing: fn (array $decorations): AlignDecorations => AlignDecorations::end($decorations),
        );

        return $this;
    }

    /**
     * @param  array<Component | Action> | DecorationsLayout | Component | Action | string | Closure | null  $decorations
     */
    public function footer(array | DecorationsLayout | Component | Action | string | Closure | null $decorations): static
    {
        $this->decorations(static::FOOTER_DECORATIONS, $decorations);

        return $this;
    }
}
