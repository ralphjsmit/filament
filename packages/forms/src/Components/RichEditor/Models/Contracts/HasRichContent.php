<?php

namespace Filament\Forms\Components\RichEditor\Models\Contracts;

use Filament\Forms\Components\RichEditor\RichContentAttribute;

interface HasRichContent
{
    public function getRichContentAttribute(string $attribute): ?RichContentAttribute;
}
