<?php

namespace Filament\Forms\Components;

use Filament\Forms\Enums\CodeEditorLanguage;
use Filament\Support\Concerns\HasExtraAlpineAttributes;

class CodeEditor extends Field
{
    use HasExtraAlpineAttributes;

    /**
     * @var view-string
     */
    protected string $view = 'filament-forms::components.code-editor';

    protected CodeEditorLanguage $language = CodeEditorLanguage::PlainText;

    public function language(CodeEditorLanguage $language): static
    {
        $this->language = $language;

        return $this;
    }

    public function getLanguage(): CodeEditorLanguage
    {
        return $this->language;
    }
}
