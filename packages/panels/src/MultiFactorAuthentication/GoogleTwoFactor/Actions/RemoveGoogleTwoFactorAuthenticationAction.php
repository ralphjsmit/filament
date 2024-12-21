<?php

namespace Filament\MultiFactorAuthentication\GoogleTwoFactor\Actions;

use Closure;
use Filament\Actions\Action;
use Filament\Facades\Filament;
use Filament\Forms\Components\OneTimeCodeInput;
use Filament\Forms\Components\TextInput;
use Filament\MultiFactorAuthentication\GoogleTwoFactor\Contracts\HasGoogleTwoFactorAuthentication;
use Filament\MultiFactorAuthentication\GoogleTwoFactor\Contracts\HasGoogleTwoFactorAuthenticationRecovery;
use Filament\MultiFactorAuthentication\GoogleTwoFactor\GoogleTwoFactorAuthentication;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Support\Facades\DB;

class RemoveGoogleTwoFactorAuthenticationAction
{
    public static function make(GoogleTwoFactorAuthentication $googleTwoFactorAuthentication): Action
    {
        $isRecoverable = $googleTwoFactorAuthentication->isRecoverable();

        return Action::make('removeGoogleTwoFactorAuthentication')
            ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.label'))
            ->color('danger')
            ->icon('heroicon-m-lock-open')
            ->outlined()
            ->modalWidth(MaxWidth::Medium)
            ->modalIcon('heroicon-o-lock-open')
            ->modalHeading(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.modal.heading'))
            ->modalDescription(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.modal.description'))
            ->form([
                OneTimeCodeInput::make('code')
                    ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.modal.form.code.label'))
                    ->belowContent(fn (Get $get): Action => Action::make('useRecoveryCode')
                        ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.modal.form.code.actions.use_recovery_code.label'))
                        ->link()
                        ->action(fn (Set $set) => $set('useRecoveryCode', true))
                        ->visible(fn (): bool => $isRecoverable && (! $get('useRecoveryCode'))))
                    ->validationAttribute(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.modal.form.code.validation_attribute'))
                    ->required(fn (Get $get): bool => (! $isRecoverable) || blank($get('recoveryCode')))
                    ->rule(function () use ($googleTwoFactorAuthentication): Closure {
                        return function (string $attribute, mixed $value, Closure $fail) use ($googleTwoFactorAuthentication): void {
                            if (is_string($value) && $googleTwoFactorAuthentication->verifyCode($value)) {
                                return;
                            }

                            $fail(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.modal.form.code.messages.invalid'));
                        };
                    }),
                TextInput::make('recoveryCode')
                    ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.modal.form.recovery_code.label'))
                    ->validationAttribute(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.modal.form.recovery_code.validation_attribute'))
                    ->password()
                    ->revealable(Filament::arePasswordsRevealable())
                    ->rule(function () use ($googleTwoFactorAuthentication): Closure {
                        return function (string $attribute, mixed $value, Closure $fail) use ($googleTwoFactorAuthentication): void {
                            if (blank($value)) {
                                return;
                            }

                            if (is_string($value) && $googleTwoFactorAuthentication->verifyRecoveryCode($value)) {
                                return;
                            }

                            $fail(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.modal.form.recovery_code.messages.invalid'));
                        };
                    })
                    ->visible(fn (Get $get): bool => $isRecoverable && $get('useRecoveryCode'))
                    ->live(onBlur: true),
            ])
            ->modalSubmitAction(fn (Action $action) => $action
                ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.modal.actions.submit.label')))
            ->action(function () use ($googleTwoFactorAuthentication, $isRecoverable) {
                /** @var HasGoogleTwoFactorAuthentication&HasGoogleTwoFactorAuthenticationRecovery $user */
                $user = Filament::auth()->user();

                DB::transaction(function () use ($googleTwoFactorAuthentication, $isRecoverable, $user) {
                    $googleTwoFactorAuthentication->saveSecret($user, null);

                    if ($isRecoverable) {
                        $googleTwoFactorAuthentication->saveRecoveryCodes($user, null);
                    }
                });

                Notification::make()
                    ->title(__('filament-panels::multi-factor-authentication/google-two-factor/actions/remove.notifications.removed.title'))
                    ->success()
                    ->icon('heroicon-o-lock-open')
                    ->send();
            });
    }
}
