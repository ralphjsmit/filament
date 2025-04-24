<?php

namespace Filament\Forms\Components\Slider\Enums;

enum Behavior: string
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
