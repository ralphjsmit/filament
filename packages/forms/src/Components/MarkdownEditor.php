<?php

namespace Filament\Forms\Components;

use Closure;
use Filament\Support\Concerns\CanConfigureCommonMark;
use Filament\Support\Concerns\HasExtraAlpineAttributes;

class MarkdownEditor extends Field implements Contracts\CanBeLengthConstrained
{
    use CanConfigureCommonMark;
    use Concerns\CanBeLengthConstrained;
    use Concerns\HasFileAttachments;
    use Concerns\HasMaxHeight;
    use Concerns\HasMinHeight;
    use Concerns\HasPlaceholder;
    use Concerns\InteractsWithToolbarButtons;
    use HasExtraAlpineAttributes;

    /**
     * @var view-string
     */
    protected string $view = 'filament-forms::components.markdown-editor';

    /**
     * @var array<string | array<string>>
     */
    protected array | Closure $toolbarButtons = [
        ['bold', 'italic', 'strike', 'link'],
        ['heading'],
        ['blockquote', 'codeBlock', 'bulletList', 'orderedList'],
        ['table', 'attachFiles'],
        ['undo', 'redo'],
    ];
}
