<?php

namespace Filament\Forms\Components\TextInput\Actions;

use Closure;
use Filament\Actions\Action;
use Filament\Forms\View\FormsIconAlias;
use Filament\Support\Facades\FilamentIcon;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Js;

class CopyAction extends Action
{
    private string | Closure | null $copyMessage = null;

    private int | Closure | null $copyMessageTimeout = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->label(__('filament-forms::components.text_input.actions.copy.label'));

        $this->icon(FilamentIcon::resolve(FormsIconAlias::COMPONENTS_TEXT_INPUT_ACTIONS_COPY) ?? Heroicon::ClipboardDocument);

        $this->defaultColor('gray');

        $this->alpineClickHandler(function (mixed $state) {
            $copyableState = Js::from($state);
            $copyMessageJs = Js::from($this->getCopyMessage($state));
            $copyMessageTimeoutJs = Js::from($this->getCopyMessageTimeout($state));

            return <<<JS
                window.navigator.clipboard.writeText({$copyableState})
                \$tooltip({$copyMessageJs}, {
                    theme: \$store.theme,
                    timeout: {$copyMessageTimeoutJs}
                })
            JS;
        });
    }

    public static function getDefaultName(): ?string
    {
        return 'copy';
    }

    public function copyMessage(string | Closure | null $message): static
    {
        $this->copyMessage = $message;

        return $this;
    }

    public function copyMessageTimeout(int | Closure | null $duration): static
    {
        $this->copyMessageTimeout = $duration;

        return $this;
    }

    public function getCopyMessage(mixed $state): string
    {
        return $this->evaluate($this->copyMessage, [
            'state' => $state,
        ]) ?? __('filament-forms::components.text_input.actions.copy.message');
    }

    public function getCopyMessageTimeout(mixed $state): int
    {
        return $this->evaluate($this->copyMessageTimeout, [
            'state' => $state,
        ]) ?? 2000;
    }
}
