<?php

namespace Filament\Forms\Components\RichEditor;

abstract class RichContentCustomBlock
{
    abstract public static function getId(): string;

    abstract public static function getLabel(): string;
}
