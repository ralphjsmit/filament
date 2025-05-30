<?php

namespace Filament\Forms\Components\RichEditor;

use Filament\Schemas\Schema;

abstract class RichContentCustomBlock
{
    abstract public static function getId(): string;

    abstract public static function getLabel(): string;

    abstract public static function toPreviewHtml(array $config): string;

    public static function form(Schema $form): Schema
    {
        return $form;
    }
}
