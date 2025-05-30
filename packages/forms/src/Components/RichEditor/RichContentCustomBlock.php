<?php

namespace Filament\Forms\Components\RichEditor;

use Filament\Schemas\Schema;
use Illuminate\Support\Str;

abstract class RichContentCustomBlock
{
    abstract public static function getId(): string;

    public static function getLabel(): string
    {
        return Str::headline(static::getId());
    }

    /**
     * @param array<string, mixed> $config
     */
    public static function toPreviewHtml(array $config): ?string
    {
        return null;
    }

    public static function configurationForm(Schema $form): Schema
    {
        return $form;
    }

    public static function isConfigurationFormSlideOver(): bool
    {
        return false;
    }
}
