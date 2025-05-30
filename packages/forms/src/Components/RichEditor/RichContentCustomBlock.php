<?php

namespace Filament\Forms\Components\RichEditor;

use Filament\Actions\Action;
use Illuminate\Support\Str;

abstract class RichContentCustomBlock
{
    abstract public static function getId(): string;

    public static function getLabel(): string
    {
        return Str::headline(static::getId());
    }

    public static function getPreviewLabel(array $config): string
    {
        return static::getLabel();
    }

    /**
     * @param  array<string, mixed>  $config
     */
    public static function toPreviewHtml(array $config): ?string
    {
        return null;
    }

    public static function configureEditorAction(Action $action): Action
    {
        return $action;
    }
}
