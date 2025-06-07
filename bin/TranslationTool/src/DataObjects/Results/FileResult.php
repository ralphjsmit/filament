<?php

namespace Filament\TranslationTool\DataObjects\Results;

final class FileResult extends Result
{
    public function __construct(
        public string $package,
        public string $file,
        public string $locale,
        public int $totalTranslations = 0,
        public array $missingTranslations = [],
        public array $removedTranslations = []
    ) {
    }
}
