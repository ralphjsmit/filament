#! /usr/bin/env php
<?php

declare(strict_types = 1);

use Filament\TranslationTool\Commands;
use function Laravel\Prompts\select;

require __DIR__ . '/TranslationTool/vendor/autoload.php';

const PACKAGES_DIR = __DIR__ . '/../packages/';

$commandName = select(
    label: 'Choose the command you want to run',
    options: [
        'status' => 'Show translation status',
        'list_outdated' => 'List outdated translations',
        'list_translators' => 'List translation managers',
    ],
    default: 'status',
);

$command = match($commandName) {
    'status' => new Commands\ShowLocaleStatus,
    'list_outdated' => new Commands\ListOutdatedTranslations,
    'list_translators' => new Commands\ListTranslators,
};

$command();
