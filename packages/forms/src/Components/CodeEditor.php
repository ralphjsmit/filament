<?php

namespace Filament\Forms\Components;

use Filament\Forms\Components\CodeEditor\Enums\Language;
use Filament\Support\Concerns\HasExtraAlpineAttributes;

class CodeEditor extends Field
{
    use HasExtraAlpineAttributes;

    /**
     * @var view-string
     */
    protected string $view = 'filament-forms::components.code-editor';

    protected Language $language = Language::PlainText;

    public function language(Language $language): static
    {
        $this->language = $language;

        return $this;
    }

    public function getLanguage(): Language
    {
        return $this->language;
    }
}
