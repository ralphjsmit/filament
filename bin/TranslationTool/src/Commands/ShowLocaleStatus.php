<?php

namespace Filament\TranslationTool\Commands;

use Filament\TranslationTool\DataObjects\Locale;
use Filament\TranslationTool\DataObjects\Translator;
use Filament\TranslationTool\DataObjects\Results\FileResult;
use Filament\TranslationTool\DataObjects\Results\Result;
use Filament\TranslationTool\FindOutdatedTranslations;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

use function Laravel\Prompts\table;

final class ShowLocaleStatus
{
    public function __invoke(): void
    {
        $checker = new FindOutdatedTranslations(locales: Locale::getAvailableLocales());
        $results = $checker->getResults();

        $this->format($results);
    }

    public function format(Collection $results): void
    {
        Translator::loadFromFile();

        $data = collect($results)
            ->groupBy('locale')
            ->map(function (Collection $fileResults, string $localeCode) {
                $totalTranslations = $fileResults->sum('totalTranslations');
                $missingTranslations = $fileResults->flatMap(fn (FileResult $result) => $result->missingTranslations)->unique()->values()->all();
                $removedTranslations = $fileResults->flatMap(fn (FileResult $result) => $result->removedTranslations)->unique()->values()->all();

                $locale = new Locale($localeCode);
                $result = new Result(
                    totalTranslations: $totalTranslations,
                    missingTranslations: $missingTranslations,
                    removedTranslations: $removedTranslations
                );

                return [
                    'language' => $locale->displayName(),
                    'locale' => $locale->code,
                    'nr_of_outdated' => count($result->missingTranslations) + count($result->removedTranslations),
                    'coverage_value' => $result->coverage(),
                    'coverage' => $result->coverage().'%',
                    'translators' => collect(Translator::getTranslatorsForLocale($locale))
                        ->map(fn (Translator $translator) => $translator->discordId
                            ? $translator->getDiscordLink()
                            : $translator->discordHandle
                        )
                        ->implode(', '),
                ];
            })
            ->sortBy('coverage_value')
            ->map(fn (array $row) => Arr::only($row, ['language', 'locale', 'nr_of_outdated', 'coverage', 'translators']))
            ->toArray();

        table(
            ['Language', 'Locale', 'No. Outdated', 'Coverage', 'Translators'],
            $data
        );
    }
}
