<?php

namespace Filament\MultiFactorAuthentication\EmailCode\Actions;

use Closure;
use Filament\Actions\Action;
use Filament\Actions\Contracts\HasActions;
use Filament\Facades\Filament;
use Filament\Forms\Components\OneTimeCodeInput;
use Filament\MultiFactorAuthentication\EmailCode\Contracts\HasEmailCodeAuthentication;
use Filament\MultiFactorAuthentication\EmailCode\EmailCodeAuthentication;
use Filament\Notifications\Notification;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\DB;

class SetUpEmailCodeAuthenticationAction
{
    public static function make(EmailCodeAuthentication $emailCodeAuthentication): Action
    {
        return Action::make('setUpEmailCodeAuthentication')
            ->label(__('filament-panels::multi-factor-authentication/email-code/actions/set-up.label'))
            ->color('primary')
            ->icon('heroicon-m-lock-closed')
            ->outlined()
            ->mountUsing(function (HasActions $livewire) use ($emailCodeAuthentication) {
                $livewire->mergeMountedActionArguments([
                    'encrypted' => encrypt([
                        'secret' => $secret = $emailCodeAuthentication->generateSecret(),
                        'userId' => Filament::auth()->id(),
                    ]),
                ]);

                /** @var HasEmailCodeAuthentication $user */
                $user = Filament::auth()->user();

                $emailCodeAuthentication->sendCode($user, $secret);
            })
            ->modalWidth(MaxWidth::Large)
            ->modalIcon('heroicon-o-lock-closed')
            ->modalIconColor('primary')
            ->modalHeading(__('filament-panels::multi-factor-authentication/email-code/actions/set-up.modal.heading'))
            ->modalDescription(__('filament-panels::multi-factor-authentication/email-code/actions/set-up.modal.description'))
            ->form(fn (array $arguments): array => [
                OneTimeCodeInput::make('code')
                    ->label(__('filament-panels::multi-factor-authentication/email-code/actions/set-up.modal.form.code.label'))
                    ->belowContent(Action::make('resend')
                        ->label(__('filament-panels::multi-factor-authentication/email-code/actions/set-up.modal.form.code.actions.resend.label'))
                        ->link()
                        ->action(function () use ($arguments, $emailCodeAuthentication) {
                            /** @var HasEmailCodeAuthentication $user */
                            $user = Filament::auth()->user();

                            $emailCodeAuthentication->sendCode($user, decrypt($arguments['encrypted'])['secret']);

                            Notification::make()
                                ->title(__('filament-panels::multi-factor-authentication/email-code/actions/set-up.modal.form.code.actions.resend.notifications.resent.title'))
                                ->success()
                                ->send();
                        }))
                    ->validationAttribute(__('filament-panels::multi-factor-authentication/email-code/actions/set-up.modal.form.code.validation_attribute'))
                    ->required()
                    ->rule(function () use ($arguments, $emailCodeAuthentication): Closure {
                        return function (string $attribute, $value, Closure $fail) use ($arguments, $emailCodeAuthentication): void {
                            if ($emailCodeAuthentication->verifyCode($value, decrypt($arguments['encrypted'])['secret'])) {
                                return;
                            }

                            $fail(__('filament-panels::multi-factor-authentication/email-code/actions/set-up.modal.form.code.messages.invalid'));
                        };
                    }),
            ])
            ->modalSubmitAction(fn (Action $action) => $action
                ->label(__('filament-panels::multi-factor-authentication/email-code/actions/set-up.modal.actions.submit.label'))
                ->color('danger'))
            ->action(function (array $arguments) use ($emailCodeAuthentication) {
                /** @var Authenticatable&HasEmailCodeAuthentication $user */
                $user = Filament::auth()->user();

                $encrypted = decrypt($arguments['encrypted']);

                if ($user->getAuthIdentifier() !== $encrypted['userId']) {
                    // Avoid encrypted arguments being passed between users by verifying that the authenticated
                    // user is the same as the user that the encrypted arguments were issued for.
                    return;
                }

                DB::transaction(function () use ($emailCodeAuthentication, $encrypted, $user) {
                    $emailCodeAuthentication->saveSecret($user, $encrypted['secret']);
                });

                Notification::make()
                    ->title(__('filament-panels::multi-factor-authentication/email-code/actions/set-up.notifications.enabled.title'))
                    ->success()
                    ->icon('heroicon-o-lock-closed')
                    ->send();
            });
    }
}
