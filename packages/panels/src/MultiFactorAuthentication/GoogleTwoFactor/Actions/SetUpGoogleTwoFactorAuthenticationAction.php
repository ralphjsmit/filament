<?php

namespace Filament\MultiFactorAuthentication\GoogleTwoFactor\Actions;

use Closure;
use Filament\Actions\Action;
use Filament\Actions\Contracts\HasActions;
use Filament\Facades\Filament;
use Filament\Forms\Components\OneTimeCodeInput;
use Filament\MultiFactorAuthentication\GoogleTwoFactor\Contracts\HasGoogleTwoFactorAuthentication;
use Filament\MultiFactorAuthentication\GoogleTwoFactor\Contracts\HasGoogleTwoFactorAuthenticationRecovery;
use Filament\MultiFactorAuthentication\GoogleTwoFactor\GoogleTwoFactorAuthentication;
use Filament\Notifications\Notification;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\HtmlString;

class SetUpGoogleTwoFactorAuthenticationAction
{
    public static function make(GoogleTwoFactorAuthentication $googleTwoFactorAuthentication): Action
    {
        return Action::make('setUpGoogleTwoFactorAuthentication')
            ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.label'))
            ->color('primary')
            ->icon('heroicon-m-lock-closed')
            ->outlined()
            ->mountUsing(function (HasActions $livewire) use ($googleTwoFactorAuthentication) {
                $livewire->mergeMountedActionArguments([
                    'encrypted' => encrypt([
                        'secret' => $googleTwoFactorAuthentication->generateSecret(),
                        ...($googleTwoFactorAuthentication->isRecoverable()
                            ? ['recoveryCodes' => $googleTwoFactorAuthentication->generateRecoveryCodes()]
                            : []),
                        'userId' => Filament::auth()->id(),
                    ]),
                ]);
            })
            ->modalWidth(MaxWidth::Large)
            ->modalIcon('heroicon-o-lock-closed')
            ->modalIconColor('primary')
            ->modalHeading(__('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.heading'))
            ->modalDescription(new HtmlString(Blade::render(__('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.description'))))
            ->modalContent(fn (array $arguments): View => view(
                'filament-panels::multi-factor-authentication.google-two-factor.set-up-modal-content',
                [
                    ...$encrypted = decrypt($arguments['encrypted']),
                    'isRecoverable' => $googleTwoFactorAuthentication->isRecoverable(),
                    'qr' => $googleTwoFactorAuthentication->generateQRCodeDataUri($encrypted['secret']),
                ],
            ))
            ->form(fn (array $arguments): array => [
                OneTimeCodeInput::make('code')
                    ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.form.code.label'))
                    ->belowContent(__('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.form.code.below_content'))
                    ->validationAttribute(__('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.form.code.validation_attribute'))
                    ->required()
                    ->rule(function () use ($arguments, $googleTwoFactorAuthentication): Closure {
                        return function (string $attribute, $value, Closure $fail) use ($arguments, $googleTwoFactorAuthentication): void {
                            if ($googleTwoFactorAuthentication->verifyCode($value, decrypt($arguments['encrypted'])['secret'])) {
                                return;
                            }

                            $fail(__('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.form.code.messages.invalid'));
                        };
                    }),
            ])
            ->modalSubmitAction(fn (Action $action) => $action
                ->label(__('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.modal.actions.submit.label'))
                ->color('danger'))
            ->action(function (array $arguments) use ($googleTwoFactorAuthentication) {
                /** @var Authenticatable&HasGoogleTwoFactorAuthentication&HasGoogleTwoFactorAuthenticationRecovery $user */
                $user = Filament::auth()->user();

                $encrypted = decrypt($arguments['encrypted']);

                if ($user->getAuthIdentifier() !== $encrypted['userId']) {
                    // Avoid encrypted arguments being passed between users by verifying that the authenticated
                    // user is the same as the user that the encrypted arguments were issued for.
                    return;
                }

                DB::transaction(function () use ($googleTwoFactorAuthentication, $encrypted, $user) {
                    $googleTwoFactorAuthentication->saveSecret($user, $encrypted['secret']);

                    if ($googleTwoFactorAuthentication->isRecoverable()) {
                        $googleTwoFactorAuthentication->saveRecoveryCodes($user, $encrypted['recoveryCodes']);
                    }
                });

                Notification::make()
                    ->title(__('filament-panels::multi-factor-authentication/google-two-factor/actions/set-up.notifications.enabled.title'))
                    ->success()
                    ->icon('heroicon-o-lock-closed')
                    ->send();
            });
    }
}
