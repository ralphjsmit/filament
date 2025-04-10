<?php

/*
 * Copyright (c) 2025. Encore Digital Group.
 * All Right Reserved.
 */

namespace Filament\Support\Enums;

enum Operation: string
{
    case Create = 'create';
    case View = 'view';
    case Edit = 'edit';
    case Delete = 'delete';
}
