@props([
    'title' => null,
])

<!DOCTYPE html>
<html
    lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    dir="{{ __('filament::layout.direction') ?? 'ltr' }}"
    class="antialiased bg-gray-100 filament js-focus-visible"
>
    <head>
        {{ filament()->renderHook('head.start') }}

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @foreach (filament()->getMeta() as $tag)
            {{ $tag }}
        @endforeach

        @if ($favicon = config('filament.favicon'))
            <link rel="icon" href="{{ $favicon }}">
        @endif

        <title>{{ $title ? "{$title} - " : null }} {{ config('filament.brand') }}</title>

        {{ filament()->renderHook('styles.start') }}

        <style>
            [x-cloak=""], [x-cloak="x-cloak"], [x-cloak="1"] { display: none !important; }
            @media (max-width: 1023px) { [x-cloak="-lg"] { display: none !important; } }
            @media (min-width: 1024px) { [x-cloak="lg"] { display: none !important; } }
            :root {
                --sidebar-width: {{ config('filament.layout.sidebar.width') ?? '20rem' }};
                --collapsed-sidebar-width: {{ config('filament.layout.sidebar.collapsed_width') ?? '5.4rem' }};
            }
        </style>

        @livewireStyles

        @if (filled($fontsUrl = config('filament.google_fonts')))
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="{{ $fontsUrl }}" rel="stylesheet" />
        @endif

        @filamentStyles

        {{ filament()->renderHook('styles.end') }}

        <script>
            const theme = localStorage.getItem('theme')

            if ((theme === 'dark') || (! theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
            }
        </script>

        {{ filament()->renderHook('head.end') }}
    </head>

    <body class="filament-body bg-gray-100 text-gray-900 dark:text-gray-100 dark:bg-gray-900">
        {{ filament()->renderHook('body.start') }}

        {{ $slot }}

        {{ filament()->renderHook('scripts.start') }}

        @livewireScripts

        @filamentScripts(withCore: true)

        <script src="//unpkg.com/alpinejs" defer></script>

        @stack('scripts')

        @if (config('filament.broadcasting.echo'))
            <script>
                window.addEventListener('DOMContentLoaded', () => {
                    window.Echo = new window.EchoFactory(@js(config('filament.broadcasting.echo')))

                    window.dispatchEvent(new CustomEvent('EchoLoaded'))
                })
            </script>
        @endif

        {{ filament()->renderHook('scripts.end') }}

        {{ filament()->renderHook('body.end') }}
    </body>
</html>
