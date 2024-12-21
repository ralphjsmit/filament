<?php

namespace Filament\MultiFactorAuthentication\GoogleTwoFactor\Actions;

use Closure;
use Filament\Actions\Action;
use Filament\Actions\Contracts\HasActions;
use Filament\Facades\Filament;
use Filament\Forms\Components\OneTimeCodeInput;
use Filament\Forms\Components\TextInput;
use Filament\MultiFactorAuthentication\GoogleTwoFactor\Contracts\HasGoogleTwoFactorAuthenticationRecovery;
use Filament\MultiFactorAuthentication\GoogleTwoFactor\GoogleTwoFactorAuthentication;
use Filament\Notifications\Notification;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Contracts\View\View;

class RegenerateGoogleTwoFactorAuthenticationRecoveryCodesAction
{
    public static function make(GoogleTwoFactorAuthentication $googleTwoFactorAuthentication): Action
    {
        return Action::make('regenerateGoogleTwoFactorAuthenticationRecoveryCodes')
            ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.label'))
            ->color('gray')
            ->icon('heroicon-m-arrow-path')
            ->outlined()
            ->modalWidth(MaxWidth::Large)
            ->modalIcon('heroicon-o-arrow-path')
            ->modalIconColor('primary')
            ->modalHeading(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.modal.heading'))
            ->modalDescription(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.modal.description'))
            ->form([
                OneTimeCodeInput::make('code')
                    ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.modal.form.code.label'))
                    ->validationAttribute(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.modal.form.code.validation_attribute'))
                    ->requiredWithout('password')
                    ->rule(function () use ($googleTwoFactorAuthentication): Closure {
                        return function (string $attribute, $value, Closure $fail) use ($googleTwoFactorAuthentication): void {
                            if ($googleTwoFactorAuthentication->verifyCode($value)) {
                                return;
                            }

                            $fail(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.modal.form.code.messages.invalid'));
                        };
                    }),
                TextInput::make('password')
                    ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.modal.form.password.label'))
                    ->validationAttribute(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.modal.form.password.validation_attribute'))
                    ->currentPassword(guard: Filament::getAuthGuard())
                    ->password()
                    ->revealable(filament()->arePasswordsRevealable())
                    ->dehydrated(false),
            ])
            ->modalSubmitAction(fn (Action $action) => $action
                ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.modal.actions.submit.label'))
                ->color('danger'))
            ->action(function (Action $action, HasActions $livewire) use ($googleTwoFactorAuthentication) {
                $recoveryCodes = $googleTwoFactorAuthentication->generateRecoveryCodes();

                /** @var HasGoogleTwoFactorAuthenticationRecovery $user */
                $user = Filament::auth()->user();

                $googleTwoFactorAuthentication->saveRecoveryCodes($user, $recoveryCodes);

                $livewire->mountAction('showNewRecoveryCodes', arguments: [
                    'recoveryCodes' => $recoveryCodes,
                ]);

                Notification::make()
                    ->title(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.notifications.regenerated.title'))
                    ->success()
                    ->icon('heroicon-o-arrow-path')
                    ->send();
            })
            ->registerModalActions([
                Action::make('showNewRecoveryCodes')
                    ->modalHeading(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.show_new_recovery_codes.modal.heading'))
                    ->modalDescription(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.show_new_recovery_codes.modal.description'))
                    ->modalContent(fn (array $arguments): View => view(
                        'filament-panels::multi-factor-authentication.recovery-codes-modal-content',
                        $arguments,
                    ))
                    ->modalWidth(MaxWidth::Large)
                    ->closeModalByClickingAway(false)
                    ->closeModalByEscaping(false)
                    ->modalCloseButton(false)
                    ->modalSubmitAction(fn (Action $action) => $action
                        ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/regenerate-recovery-codes.show_new_recovery_codes.modal.actions.submit.label'))
                        ->color('danger'))
                    ->modalCancelAction(false)
                    ->cancelParentActions(),
            ]);
    }
}
