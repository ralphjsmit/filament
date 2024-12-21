<div class="flex flex-col gap-3 text-sm">
    <ul class="ms-3 list-disc font-mono text-xs sm:columns-2">
        @foreach ($recoveryCodes as $recoveryCode)
            <li>
                <button
                    type="button"
                    x-on:click="
                        window.navigator.clipboard.writeText(@js($recoveryCode))
                        $tooltip(@js(__('filament-panels::multi-factor-authentication/recovery-codes-modal-content.messages.copied')), {
                            theme: $store.theme,
                        })
                    "
                >
                    {{ $recoveryCode }}
                </button>
            </li>
        @endforeach
    </ul>

    <p>
        {{ __('filament-panels::multi-factor-authentication/recovery-codes-modal-content.actions.0') }}

        <x-filament::link
            tag="button"
            :x-on:click="
                '
                    window.navigator.clipboard.writeText(' . \Illuminate\Support\Js::from(implode(PHP_EOL, $recoveryCodes)) . ')
                    $tooltip(' . \Illuminate\Support\Js::from(__('filament-panels::multi-factor-authentication/recovery-codes-modal-content.messages.copied')) . ', {
                        theme: $store.theme,
                    })
                '
            "
        >
            {{ __('filament-panels::multi-factor-authentication/recovery-codes-modal-content.actions.copy.label') }}
        </x-filament::link>

        {{ __('filament-panels::multi-factor-authentication/recovery-codes-modal-content.actions.1') }}

        <x-filament::link
            :href="'data:application/octet-stream,' . urlencode(implode(PHP_EOL, $recoveryCodes))"
            download
        >
            {{ __('filament-panels::multi-factor-authentication/recovery-codes-modal-content.actions.download.label') }}
        </x-filament::link>

        {{ __('filament-panels::multi-factor-authentication/recovery-codes-modal-content.actions.2') }}
    </p>
</div>
