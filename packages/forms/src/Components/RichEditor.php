<?php

namespace Filament\Forms\Components;

use Closure;
use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor\Actions\LinkAction;
use Filament\Forms\Components\RichEditor\EditorCommand;
use Filament\Forms\Components\StateCasts\RichEditorStateCast;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\StateCasts\Contracts\StateCast;
use Filament\Support\Concerns\HasExtraAlpineAttributes;
use Filament\Support\Enums\Width;

class RichEditor extends Field implements Contracts\CanBeLengthConstrained, Contracts\HasFileAttachments
{
    use Concerns\CanBeLengthConstrained;
    use Concerns\HasExtraInputAttributes;
    use Concerns\HasFileAttachments;
    use Concerns\HasPlaceholder;
    use Concerns\InteractsWithToolbarButtons;
    use HasExtraAlpineAttributes;

    /**
     * @var view-string
     */
    protected string $view = 'filament-forms::components.rich-editor';

    /**
     * @var array<string>
     */
    protected array | Closure $toolbarButtons = [
        'attachFiles',
        'blockquote',
        'bold',
        'bulletList',
        'codeBlock',
        'h2',
        'h3',
        'italic',
        'link',
        'orderedList',
        'redo',
        'strike',
        'sub',
        'sup',
        'underline',
        'undo',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerActions([
            LinkAction::make(),
        ]);
    }

    /**
     * @return array<StateCast>
     */
    public function getDefaultStateCasts(): array
    {
        return [
            ...parent::getDefaultStateCasts(),
            app(RichEditorStateCast::class, ['richEditor' => $this]),
        ];
    }

    /**
     * @param  array<EditorCommand>  $commands
     * @param  array<string, mixed>  $editorSelection
     */
    public function runCommands(array $commands, array $editorSelection): void
    {
        $key = $this->getKey();
        $livewire = $this->getLivewire();

        $livewire->dispatch(
            'run-rich-editor-commands',
            awaitSchemaComponent: $key,
            livewireId: $livewire->getId(),
            key: $key,
            editorSelection: $editorSelection,
            commands: array_map(fn (EditorCommand $command): array => $command->toArray(), $commands),
        );
    }
}
