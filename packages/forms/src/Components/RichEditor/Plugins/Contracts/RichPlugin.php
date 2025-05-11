<?php

namespace Filament\Forms\Components\RichEditor\Plugins\Contracts;

use Filament\Forms\Components\RichEditor\RichEditorTool;
use Tiptap\Core\Extension;

interface RichPlugin
{
    /**
     * @return array<Extension>
     */
    public function getTipTapPhpExtensions(): array;

    /**
     * @return array<string>
     */
    public function getTipTapJsExtensions(): array;

    /**
     * @return array<RichEditorTool>
     */
    public function getEditorTools(): array;
}
