<?php

namespace Filament\Tests\Fixtures\Resources\Shop\Products;

use Filament\Resources\Resource;
use Filament\Tests\Fixtures\Models\Product;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationGroup = 'Shop';

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    public static function getPages(): array
    {
        return [
            'index' => \Filament\Tests\Fixtures\Resources\Shop\Products\Pages\ListProducts::route('/'),
            'create' => \Filament\Tests\Fixtures\Resources\Shop\Products\Pages\CreateProduct::route('/create'),
            'view' => \Filament\Tests\Fixtures\Resources\Shop\Products\Pages\ViewProduct::route('/{record}'),
            'edit' => \Filament\Tests\Fixtures\Resources\Shop\Products\Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
