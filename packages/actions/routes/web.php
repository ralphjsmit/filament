<?php

use Filament\Actions\Exports\Http\Controllers\DownloadExport;
use Filament\Actions\Imports\Http\Controllers\DownloadImportFailureCsv;
use Illuminate\Support\Facades\Route;

$prefix = config('filament.utility_route_prefix', 'filament');

Route::get("/{$prefix}/exports/{export}/download", DownloadExport::class)
    ->name('filament.exports.download')
    ->middleware('filament.actions');

Route::get("/{$prefix}/imports/{import}/failed-rows/download", DownloadImportFailureCsv::class)
    ->name('filament.imports.failed-rows.download')
    ->middleware('filament.actions');
