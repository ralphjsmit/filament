<?php

namespace Filament\Support\Enums;

enum Operation: string
{
    case Create = 'create';
    case View = 'view';
    case Edit = 'edit';
}
