<?php

namespace Filament\Forms\Components;

use Filament\Schemas\Components\StateCasts\BooleanStateCast;
use Filament\Schemas\Components\StateCasts\Contracts\StateCast;

class Checkbox extends Field
{
    use Concerns\CanBeAccepted;
    use Concerns\CanBeInline;
    use Concerns\CanFixIndistinctState;
    use Concerns\HasExtraInputAttributes;

    /**
     * @var view-string
     */
    protected string $view = 'filament-forms::components.checkbox';

    protected function setUp(): void
    {
        parent::setUp();

        $this->rule('boolean');
    }

    /**
     * @return array<StateCast>
     */
    public function getDefaultStateCasts(): array
    {
        return [
            app(BooleanStateCast::class),
        ];
    }
}
