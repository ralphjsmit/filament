<?php

namespace Filament\MultiFactorAuthentication\EmailCode\Actions;

use Closure;
use Filament\Actions\Action;
use Filament\Facades\Filament;
use Filament\Forms\Components\OneTimeCodeInput;
use Filament\MultiFactorAuthentication\EmailCode\Contracts\HasEmailCodeAuthentication;
use Filament\MultiFactorAuthentication\EmailCode\EmailCodeAuthentication;
use Filament\Notifications\Notification;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Support\Facades\DB;

class RemoveEmailCodeAuthenticationAction
{
    public static function make(EmailCodeAuthentication $emailCodeAuthentication): Action
    {
        return Action::make('removeEmailCodeAuthentication')
            ->label(__('filament-panels::multi-factor-authentication/email-code/actions/remove.label'))
            ->color('danger')
            ->icon('heroicon-m-lock-open')
            ->outlined()
            ->mountUsing(function () use ($emailCodeAuthentication) {
                /** @var HasEmailCodeAuthentication $user */
                $user = Filament::auth()->user();

                $emailCodeAuthentication->sendCode($user);
            })
            ->modalWidth(MaxWidth::Medium)
            ->modalIcon('heroicon-o-lock-open')
            ->modalHeading(__('filament-panels::multi-factor-authentication/email-code/actions/remove.modal.heading'))
            ->modalDescription(__('filament-panels::multi-factor-authentication/email-code/actions/remove.modal.description'))
            ->form([
                OneTimeCodeInput::make('code')
                    ->label(__('filament-panels::multi-factor-authentication/email-code/actions/remove.modal.form.code.label'))
                    ->validationAttribute(__('filament-panels::multi-factor-authentication/email-code/actions/remove.modal.form.code.validation_attribute'))
                    ->belowContent(Action::make('resend')
                        ->label(__('filament-panels::multi-factor-authentication/email-code/actions/remove.modal.form.code.actions.resend.label'))
                        ->link()
                        ->action(function () use ($emailCodeAuthentication) {
                            /** @var HasEmailCodeAuthentication $user */
                            $user = Filament::auth()->user();

                            $emailCodeAuthentication->sendCode($user);

                            Notification::make()
                                ->title(__('filament-panels::multi-factor-authentication/email-code/actions/remove.modal.form.code.actions.resend.notifications.resent.title'))
                                ->success()
                                ->send();
                        }))
                    ->required()
                    ->rule(function () use ($emailCodeAuthentication): Closure {
                        return function (string $attribute, mixed $value, Closure $fail) use ($emailCodeAuthentication): void {
                            if (is_string($value) && $emailCodeAuthentication->verifyCode($value)) {
                                return;
                            }

                            $fail(__('filament-panels::multi-factor-authentication/email-code/actions/remove.modal.form.code.messages.invalid'));
                        };
                    }),
            ])
            ->modalSubmitAction(fn (Action $action) => $action
                ->label(__('filament-panels::multi-factor-authentication/email-code/actions/remove.modal.actions.submit.label')))
            ->action(function () use ($emailCodeAuthentication) {
                /** @var HasEmailCodeAuthentication $user */
                $user = Filament::auth()->user();

                DB::transaction(function () use ($emailCodeAuthentication, $user) {
                    $emailCodeAuthentication->saveSecret($user, null);
                });

                Notification::make()
                    ->title(__('filament-panels::multi-factor-authentication/email-code/actions/remove.notifications.removed.title'))
                    ->success()
                    ->icon('heroicon-o-lock-open')
                    ->send();
            });
    }
}
