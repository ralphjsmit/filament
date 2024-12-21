<div class="flex flex-col gap-3 text-sm">
    <p>
        {{ __('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.content.qr_code.instruction') }}
    </p>

    <img
        alt="{{ __('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.content.qr_code.alt') }}"
        src="{{ $qr }}"
        class="mx-auto size-48 rounded-lg border border-gray-300 dark:border-transparent"
    />

    <p>
        {{ __('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.content.text_code.instruction') }}

        <button
            class="inline"
            type="button"
            x-on:click="
                window.navigator.clipboard.writeText(@js($secret))
                $tooltip(@js(__('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.content.text_code.messages.copied')), {
                    theme: $store.theme,
                })
            "
        >
            <span class="font-mono">{{ $secret }}</span>
            <span class="font-sans text-xs text-gray-500 dark:text-gray-400">
                {{ __('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.content.text_code.copy_hint') }}
            </span>
        </button>
    </p>

    @if ($isRecoverable)
        <div
            class="flex flex-col gap-3 rounded-lg bg-gray-50 p-4 ring-1 ring-inset ring-gray-950/5 dark:bg-white/5 dark:ring-white/10"
        >
            <p class="font-bold">
                {{ __('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.content.recovery_codes.instruction') }}
            </p>

            @include('filament-panels::multi-factor-authentication.recovery-codes-modal-content', [
                'recoveryCodes' => $recoveryCodes,
            ])
        </div>
    @endif
</div>
