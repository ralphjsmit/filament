<?php

namespace Filament\Tests\Fixtures\Resources\Shop\Products;

use Filament\Resources\Resource;
use Filament\Tests\Fixtures\Models\Product;
use Filament\Tests\Fixtures\Resources\Shop\Products\Pages\CreateProduct;
use Filament\Tests\Fixtures\Resources\Shop\Products\Pages\EditProduct;
use Filament\Tests\Fixtures\Resources\Shop\Products\Pages\ListProducts;
use Filament\Tests\Fixtures\Resources\Shop\Products\Pages\ViewProduct;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationGroup = 'Shop';

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    public static function getPages(): array
    {
        return [
            'index' => ListProducts::route('/'),
            'create' => CreateProduct::route('/create'),
            'view' => ViewProduct::route('/{record}'),
            'edit' => EditProduct::route('/{record}/edit'),
        ];
    }
}
