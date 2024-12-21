<?php

namespace Filament\Tests\Fixtures\Resources\PostCategories;

use Filament\Resources\Resource;
use Filament\Tests\Fixtures\Models\PostCategory;

class PostCategoryResource extends Resource
{
    protected static ?string $model = PostCategory::class;

    protected static ?string $navigationGroup = 'Blog';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function getPages(): array
    {
        return [
            'index' => \Filament\Tests\Fixtures\Resources\PostCategories\Pages\ListPostCategories::route('/'),
            'create' => \Filament\Tests\Fixtures\Resources\PostCategories\Pages\CreatePostCategory::route('/create'),
            'view' => \Filament\Tests\Fixtures\Resources\PostCategories\Pages\ViewPostCategory::route('/{record}'),
            'edit' => \Filament\Tests\Fixtures\Resources\PostCategories\Pages\EditPostCategory::route('/{record}/edit'),
        ];
    }
}
