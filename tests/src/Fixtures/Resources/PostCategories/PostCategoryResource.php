<?php

namespace Filament\Tests\Fixtures\Resources\PostCategories;

use Filament\Resources\Resource;
use Filament\Tests\Fixtures\Models\PostCategory;
use Filament\Tests\Fixtures\Resources\PostCategories\Pages\CreatePostCategory;
use Filament\Tests\Fixtures\Resources\PostCategories\Pages\EditPostCategory;
use Filament\Tests\Fixtures\Resources\PostCategories\Pages\ListPostCategories;
use Filament\Tests\Fixtures\Resources\PostCategories\Pages\ViewPostCategory;

class PostCategoryResource extends Resource
{
    protected static ?string $model = PostCategory::class;

    protected static ?string $navigationGroup = 'Blog';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function getPages(): array
    {
        return [
            'index' => ListPostCategories::route('/'),
            'create' => CreatePostCategory::route('/create'),
            'view' => ViewPostCategory::route('/{record}'),
            'edit' => EditPostCategory::route('/{record}/edit'),
        ];
    }
}
