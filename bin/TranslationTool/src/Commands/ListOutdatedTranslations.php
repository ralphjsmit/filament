<?php

namespace Filament\TranslationTool\Commands;

use Filament\TranslationTool\DataObjects\Locale;
use Filament\TranslationTool\DataObjects\Results\FileResult;
use Filament\TranslationTool\FindOutdatedTranslations;
use Illuminate\Support\Collection;

use Laravel\Prompts;

final class ListOutdatedTranslations
{
    public function __invoke(): void
    {
        $localeCode = Prompts\search(
            label: 'Select a locale to check',
            options: fn ($search) => Locale::getAvailableLocales()
                ->mapWithKeys(fn (Locale $locale) => [$locale->code => $locale->displayName()])
                ->filter(fn (string $displayName) => ! $search || str_contains($displayName, $search))
                ->toArray(),
            placeholder: 'Search for a locale',
            required: true,
        );

        $locale = new Locale($localeCode);

        $checker = new FindOutdatedTranslations(locales: collect([$locale]));
        $results = $checker->getResults();

        $this->format($results, $locale);
    }

    public function format(Collection $results, Locale $locale): void
    {
        $data = collect($results)
            ->groupBy('package')
            ->map(function (Collection $fileResults, string $package) use ($locale) {
                return $fileResults
                    ->groupBy('file')
                    ->map(function (Collection $fileGroup, string $file) use ($package, $locale) {
                        $missingTranslations = $fileGroup->flatMap(fn (FileResult $result) => $result->missingTranslations)->keys()->unique();
                        $removedTranslations = $fileGroup->flatMap(fn (FileResult $result) => $result->removedTranslations)->keys()->unique();

                        $missingTranslations = $missingTranslations->map(
                            function (string $key) use ($package, $locale, $file) {
                                $filepath = realpath(PACKAGES_DIR.$package.'/resources/lang/'.$locale->code.DIRECTORY_SEPARATOR.$file);
                                $filename = $package.DIRECTORY_SEPARATOR.$file;

                                return [
                                    'file' => $filepath ? createLink('file://'.$filepath, $filename) : $filename,
                                    'key' => $key,
                                    'status' => 'Missing',
                                ];
                            }
                        );

                        $removedTranslations = $removedTranslations->map(
                            function (string $key) use ($package, $locale, $file) {
                                $filepath = realpath(PACKAGES_DIR.$package.'/resources/lang/'.$locale->code.DIRECTORY_SEPARATOR.$file);
                                $filename = $package.DIRECTORY_SEPARATOR.$file;

                                return [
                                    'file' => $filepath ? createLink('file://'.$filepath, $filename) : $filename,
                                    'key' => $key,
                                    'status' => 'Removed',
                                ];
                            }
                        );

                        return $missingTranslations->merge($removedTranslations)->toArray();
                    });
            })
            ->flatten(2);

        if (count($data) === 0) {
            info("🎉🎉🎉 All translations are up to date 🎉🎉🎉");
            return;
        }

        Prompts\table(
            ['File', 'Translation Key', 'Status'],
            $data
        );

        Prompts\info("Total outdated translations: ".count($data));
    }
}
