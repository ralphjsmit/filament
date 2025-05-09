<?php

namespace Filament\Forms\Components;

use Closure;
use Filament\Forms\Components\RichEditor\Actions\AttachFilesAction;
use Filament\Forms\Components\RichEditor\Actions\LinkAction;
use Filament\Forms\Components\RichEditor\EditorCommand;
use Filament\Forms\Components\RichEditor\StateCasts\RichEditorStateCast;
use Filament\Forms\Components\RichEditor\TipTapExtensions\Image;
use Filament\Forms\Components\RichEditor\Tool;
use Filament\Schemas\Components\StateCasts\Contracts\StateCast;
use Filament\Support\Concerns\HasExtraAlpineAttributes;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Arr;
use Tiptap\Core\Extension;
use Tiptap\Editor;
use Tiptap\Marks\Bold;
use Tiptap\Marks\Code;
use Tiptap\Marks\Italic;
use Tiptap\Marks\Link;
use Tiptap\Marks\Strike;
use Tiptap\Marks\Subscript;
use Tiptap\Marks\Superscript;
use Tiptap\Marks\Underline;
use Tiptap\Nodes\Blockquote;
use Tiptap\Nodes\BulletList;
use Tiptap\Nodes\CodeBlock;
use Tiptap\Nodes\Document;
use Tiptap\Nodes\Heading;
use Tiptap\Nodes\ListItem;
use Tiptap\Nodes\OrderedList;
use Tiptap\Nodes\Paragraph;
use Tiptap\Nodes\Text;

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
     * @var array<string | array<string>>
     */
    protected array | Closure $toolbarButtons = [
        ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript', 'link'],
        ['h2', 'h3'],
        ['blockquote', 'codeBlock', 'bulletList', 'orderedList'],
        ['attachFiles'],
        ['undo', 'redo'],
    ];

    protected string | Closure | null $uploadingFileMessage = null;

    protected bool | Closure $isJson = false;

    /**
     * @var array<Extension | Closure>
     */
    protected array $tipTapPhpExtensions = [];

    /**
     * @var array<string | Closure>
     */
    protected array $tipTapJsExtensions = [];

    /**
     * @var array<Tool | Closure>
     */
    protected array $tools = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerActions([
            AttachFilesAction::make(),
            LinkAction::make(),
        ]);

        $this->tools([
            Tool::make('bold')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.bold'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleBold().run()')
                ->icon(Heroicon::Bold)
                ->iconAlias('forms:components.rich-editor.toolbar.bold'),
            Tool::make('italic')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.italic'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleItalic().run()')
                ->icon(Heroicon::Italic)
                ->iconAlias('forms:components.rich-editor.toolbar.italic'),
            Tool::make('underline')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.underline'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleUnderline().run()')
                ->icon(Heroicon::Underline)
                ->iconAlias('forms:components.rich-editor.toolbar.underline'),
            Tool::make('strike')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.strike'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleStrike().run()')
                ->icon(Heroicon::Strikethrough)
                ->iconAlias('forms:components.rich-editor.toolbar.strike'),
            Tool::make('subscript')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.subscript'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleSubscript().run()')
                ->icon('fi-s-subscript')
                ->iconAlias('forms:components.rich-editor.toolbar.subscript'),
            Tool::make('superscript')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.superscript'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleSuperscript().run()')
                ->icon('fi-s-superscript')
                ->iconAlias('forms:components.rich-editor.toolbar.superscript'),
            Tool::make('link')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.link'))
                ->javaScriptHandler(fn (): string => $this->getAction('link')->getAlpineClickHandler())
                ->icon(Heroicon::Link)
                ->iconAlias('forms:components.rich-editor.toolbar.link'),
            Tool::make('h1')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.h1'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleHeading({ level: 1 }).run()')
                ->activeOptions(['level' => 1])
                ->icon(Heroicon::H1)
                ->iconAlias('forms:components.rich-editor.toolbar.h1'),
            Tool::make('h2')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.h2'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleHeading({ level: 2 }).run()')
                ->activeOptions(['level' => 2])
                ->icon(Heroicon::H2)
                ->iconAlias('forms:components.rich-editor.toolbar.h2'),
            Tool::make('h3')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.h3'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleHeading({ level: 3 }).run()')
                ->activeOptions(['level' => 3])
                ->icon(Heroicon::H3)
                ->iconAlias('forms:components.rich-editor.toolbar.h3'),
            Tool::make('blockquote')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.blockquote'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleBlockquote().run()')
                ->icon(Heroicon::ChatBubbleBottomCenterText)
                ->iconAlias('forms:components.rich-editor.toolbar.blockquote'),
            Tool::make('codeBlock')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.code_block'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleCodeBlock().run()')
                ->icon(Heroicon::CodeBracket)
                ->iconAlias('forms:components.rich-editor.toolbar.code_block'),
            Tool::make('bulletList')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.bullet_list'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleBulletList().run()')
                ->icon(Heroicon::ListBullet)
                ->iconAlias('forms:components.rich-editor.toolbar.bullet_list'),
            Tool::make('orderedList')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.ordered_list'))
                ->javaScriptHandler('$getEditor()?.chain().focus().toggleOrderedList().run()')
                ->icon(Heroicon::NumberedList)
                ->iconAlias('forms:components.rich-editor.toolbar.ordered_list'),
            Tool::make('attachFiles')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.attach_files'))
                ->javaScriptHandler(fn (): string => $this->getAction('attachFiles')->getAlpineClickHandler())
                ->activeKey('image')
                ->icon(Heroicon::PaperClip)
                ->iconAlias('forms:components.rich-editor.toolbar.attach_files'),
            Tool::make('undo')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.undo'))
                ->javaScriptHandler('$getEditor()?.chain().focus().undo().run()')
                ->icon(Heroicon::ArrowUturnLeft)
                ->iconAlias('forms:components.rich-editor.toolbar.undo'),
            Tool::make('redo')
                ->label(__('filament-forms::components.rich_editor.toolbar_buttons.redo'))
                ->javaScriptHandler('$getEditor()?.chain().focus().redo().run()')
                ->icon(Heroicon::ArrowUturnRight)
                ->iconAlias('forms:components.rich-editor.toolbar.redo'),
        ]);

        $this->afterStateHydrated(function (RichEditor $component, ?array $rawState): void {
            $component->rawState(
                $component->getTipTapEditor()
                    ->setContent($rawState ?? [
                        'type' => 'doc',
                        'content' => [],
                    ])
                    ->descendants(function (object &$node) use ($component): void {
                        if ($node->type !== 'image') {
                            return;
                        }

                        if (blank($node->attrs->{'data-id'} ?? null)) {
                            return;
                        }

                        $node->attrs->src = $component->getFileAttachmentUrl($node->attrs->{'data-id'});
                    })
                    ->getDocument(),
            );
        });

        $this->beforeStateDehydrated(function (RichEditor $component, ?array $rawState): void {
            $component->rawState(
                $component->getTipTapEditor()
                    ->setContent($rawState ?? [
                        'type' => 'doc',
                        'content' => [],
                    ])
                    ->descendants(function (object &$node) use ($component): void {
                        if ($node->type !== 'image') {
                            return;
                        }

                        if (blank($node->attrs->{'data-id'} ?? null)) {
                            return;
                        }

                        $attachment = $component->getUploadedFileAttachment($node->attrs->{'data-id'});

                        if (! $attachment) {
                            return;
                        }

                        $node->attrs->{'data-id'} = $component->storeUploadedFileAttachment($attachment);
                        $node->attrs->src = $component->getFileAttachmentUrl($node->attrs->{'data-id'});
                    })
                    ->getDocument(),
            );
        });
    }

    /**
     * @param  array<string> | Closure  $extensions
     */
    public function tipTapJsExtensions(array | Closure $extensions): static
    {
        $this->tipTapJsExtensions = [
            ...$this->tipTapJsExtensions,
            ...is_array($extensions) ? $extensions : [$extensions],
        ];

        return $this;
    }

    /**
     * @param  array<Extension> | Closure  $extensions
     */
    public function tipTapPhpExtensions(array | Closure $extensions): static
    {
        $this->tipTapPhpExtensions = [
            ...$this->tipTapPhpExtensions,
            ...is_array($extensions) ? $extensions : [$extensions],
        ];

        return $this;
    }

    /**
     * @param  array<Tool> | Closure  $tools
     */
    public function tools(array | Closure $tools): static
    {
        $this->tools = [
            ...$this->tools,
            ...is_array($tools) ? $tools : [$tools],
        ];

        return $this;
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

    public function uploadingFileMessage(string | Closure | null $message): static
    {
        $this->uploadingFileMessage = $message;

        return $this;
    }

    public function getUploadingFileMessage(): string
    {
        return $this->evaluate($this->uploadingFileMessage) ?? __('filament::components/button.messages.uploading_file');
    }

    public function json(bool | Closure $condition = true): static
    {
        $this->isJson = $condition;

        return $this;
    }

    public function isJson(): bool
    {
        return (bool) $this->evaluate($this->isJson);
    }

    /**
     * @return array{extensions: array<Extension>}
     */
    public function getTipTapPhpConfiguration(): array
    {
        return [
            'extensions' => $this->getTipTapPhpExtensions(),
        ];
    }

    public function getTipTapEditor(): Editor
    {
        return app(Editor::class, ['configuration' => $this->getTipTapPhpConfiguration()]);
    }

    /**
     * @return array<Extension>
     */
    public function getTipTapPhpExtensions(): array
    {
        return [
            app(Blockquote::class),
            app(Bold::class),
            app(BulletList::class),
            app(Code::class),
            app(CodeBlock::class),
            app(Document::class),
            app(Heading::class),
            app(Italic::class),
            app(Image::class),
            app(Link::class),
            app(ListItem::class),
            app(OrderedList::class),
            app(Paragraph::class),
            app(Strike::class),
            app(Subscript::class),
            app(Superscript::class),
            app(Text::class),
            app(Underline::class),
            ...array_reduce(
                $this->tipTapPhpExtensions,
                function (array $carry, Extension | Closure $extension): array {
                    if ($extension instanceof Closure) {
                        $extension = $this->evaluate($extension);
                    }

                    return [
                        ...$carry,
                        ...Arr::wrap($extension),
                    ];
                },
                initial: [],
            ),
        ];
    }

    /**
     * @return array<string>
     */
    public function getTipTapJsExtensions(): array
    {
        return array_reduce(
            $this->tipTapJsExtensions,
            function (array $carry, string | Closure $extension): array {
                if ($extension instanceof Closure) {
                    $extension = $this->evaluate($extension);
                }

                return [
                    ...$carry,
                    ...Arr::wrap($extension),
                ];
            },
            initial: [],
        );
    }

    /**
     * @return array<string, Tool>
     */
    public function getTools(): array
    {
        return array_reduce(
            $this->tools,
            function (array $carry, Tool | Closure $tool): array {
                if ($tool instanceof Closure) {
                    $tool = $this->evaluate($tool);
                }

                return [
                    ...$carry,
                    ...array_reduce(
                        Arr::wrap($tool),
                        fn (array $carry, Tool $tool): array => [
                            ...$carry,
                            $tool->getName() => $tool,
                        ],
                        initial: [],
                    ),
                ];
            },
            initial: [],
        );
    }
}
