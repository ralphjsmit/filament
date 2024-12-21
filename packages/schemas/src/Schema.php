<?php

namespace Filament\Schemas;

use Filament\Schemas\Contracts\HasSchemas;
use Filament\Support\Components\ViewComponent;
use Filament\Support\Concerns\HasExtraAttributes;
use Illuminate\Database\Eloquent\Model;
use Livewire\Component;

class Schema extends ViewComponent
{
    use Concerns\BelongsToLivewire;
    use Concerns\BelongsToModel;
    use Concerns\BelongsToParentComponent;
    use Concerns\CanBeDisabled;
    use Concerns\CanBeHidden;
    use Concerns\CanBeValidated;
    use Concerns\Cloneable;
    use Concerns\HasColumns;
    use Concerns\HasComponents;
    use Concerns\HasEntryWrapper;
    use Concerns\HasFieldWrapper;
    use Concerns\HasInlineLabels;
    use Concerns\HasKey;
    use Concerns\HasOperation;
    use Concerns\HasState;
    use Concerns\HasStateBindingModifiers;
    use HasExtraAttributes;

    protected string $view = 'filament-schema::schema';

    protected string $evaluationIdentifier = 'schema';

    protected string $viewIdentifier = 'schema';

    public static string $defaultCurrency = 'usd';

    public static string $defaultDateDisplayFormat = 'M j, Y';

    public static string $defaultDateTimeDisplayFormat = 'M j, Y H:i:s';

    public static ?string $defaultNumberLocale = null;

    public static string $defaultTimeDisplayFormat = 'H:i:s';

    final public function __construct(Component & HasSchemas $livewire)
    {
        $this->livewire($livewire);
    }

    public static function make(Component & HasSchemas $livewire): static
    {
        $static = app(static::class, ['livewire' => $livewire]);
        $static->configure();

        return $static;
    }

    /**
     * @return array<mixed>
     */
    protected function resolveDefaultClosureDependencyForEvaluationByName(string $parameterName): array
    {
        return match ($parameterName) {
            'container' => [$this],
            'livewire' => [$this->getLivewire()],
            'model' => [$this->getModel()],
            'record' => [$this->getRecord()],
            default => parent::resolveDefaultClosureDependencyForEvaluationByName($parameterName),
        };
    }

    /**
     * @return array<mixed>
     */
    protected function resolveDefaultClosureDependencyForEvaluationByType(string $parameterType): array
    {
        $record = $this->getRecord();

        if (! ($record instanceof Model)) {
            return match ($parameterType) {
                static::class, self::class => [$this],
                default => parent::resolveDefaultClosureDependencyForEvaluationByType($parameterType),
            };
        }

        return match ($parameterType) {
            static::class, self::class => [$this],
            Model::class, $record::class => [$record],
            default => parent::resolveDefaultClosureDependencyForEvaluationByType($parameterType),
        };
    }
}
