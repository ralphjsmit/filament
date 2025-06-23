<?php

namespace Filament\Forms\Components\RichEditor\TipTapExtensions;

use Tiptap\Extensions\TextAlign;

class TextAlignExtension extends TextAlign
{
    /**
     * @return array<string, mixed>
     */
    public function addOptions(): array
    {
        return [
            ...parent::addOptions(),
            [
                'types' => ['heading', 'paragraph'],
                'alignments' => ['start', 'center', 'end', 'justify'],
                'defaultAlignment' => 'start',
            ],
        ];
    }
}
