<?php

namespace Filament\TranslationTool;

use Filament\TranslationTool\DataObjects\Locale;
use Filament\TranslationTool\DataObjects\Results\FileResult;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;


class FindOutdatedTranslations
{
    public function __construct(
        public Collection $locales,
        public ?array $packages = null,
        public ?Locale $targetLocale = null,
    ) {
        $this->packages ??= $this->getPackages();
        $this->targetLocale ??= new Locale('en');
    }

    public function getResults(): Collection
    {
        $results = collect();

        foreach ($this->locales as $locale) {
            foreach ($this->packages as $package) {
                $results = $results->merge($this->getTranslationStatus($package, $locale));
            }
        }

        return $results;
    }

    protected function getPackages(): array
    {
        return array_filter(
            scandir(PACKAGES_DIR),
            fn($package) => is_dir(PACKAGES_DIR.$package) && !in_array($package, ['.', '..', '.DS_Store'])
        );
    }

    protected function getTranslationStatus(string $package, Locale $locale): array
    {
        $originDir = PACKAGES_DIR.$package.'/resources/lang/'.$this->targetLocale;

        if (!is_dir($originDir)) {
            return [];
        }

        $results = [];

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($originDir, RecursiveDirectoryIterator::SKIP_DOTS)
        );

        $files = array_map(
            fn(SplFileInfo $file) => str_replace($originDir.DIRECTORY_SEPARATOR, '', $file->getPathname()),
            iterator_to_array($iterator, false)
        );

        foreach ($files as $file) {
            $originFilePath = PACKAGES_DIR.$package.'/resources/lang/'.$this->targetLocale.'/'.$file;
            $localeFilePath = PACKAGES_DIR.$package.'/resources/lang/'.$locale->code.'/'.$file;

            $originKeys = Arr::dot(require $originFilePath);
            $totalKeys = count($originKeys);

            if (!file_exists($localeFilePath)) {
                $results[] = new FileResult(
                    package: $package,
                    file: $file,
                    locale: $locale,
                    totalTranslations: $totalKeys,
                    missingTranslations: $originKeys,
                    removedTranslations: []
                );

                continue;
            }

            $localeKeys = Arr::dot(require $localeFilePath);

            $missingKeys = array_diff_key($originKeys, $localeKeys);
            $removedKeys = array_diff_key($localeKeys, $originKeys);

            $results[] = new FileResult(
                package: $package,
                file: $file,
                locale: $locale,
                totalTranslations: $totalKeys,
                missingTranslations: $missingKeys,
                removedTranslations: $removedKeys
            );
        }

        return $results;
    }
}
