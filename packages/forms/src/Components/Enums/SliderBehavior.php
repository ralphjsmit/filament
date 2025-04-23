<?php

namespace Filament\Forms\Components\Enums;

enum SliderBehavior: string
{
    case Drag = 'drag';
    case DragAll = 'drag-all';
    case Tap = 'tap';
    case Fixed = 'fixed';
    case Snap = 'snap';
    case Unconstrained = 'unconstrained';
    case InvertConnects = 'invert-connects';
    case None = 'none';
}
