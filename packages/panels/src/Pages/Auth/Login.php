<?php

namespace Filament\Pages\Auth;

use DanHarrin\LivewireRateLimiting\Exceptions\TooManyRequestsException;
use DanHarrin\LivewireRateLimiting\WithRateLimiting;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Facades\Filament;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\TextInput;
use Filament\Http\Responses\Auth\Contracts\LoginResponse;
use Filament\Models\Contracts\FilamentUser;
use Filament\MultiFactorAuthentication\Contracts\HasBeforeChallengeHook;
use Filament\MultiFactorAuthentication\Contracts\MultiFactorAuthenticationProvider;
use Filament\Notifications\Notification;
use Filament\Pages\SimplePage;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Decorations\FormActionsDecorations;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\NestedSchema;
use Filament\Schemas\Components\RenderHook;
use Filament\Schemas\Schema;
use Filament\Support\Enums\Alignment;
use Filament\View\PanelsRenderHook;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\HtmlString;
use Illuminate\Validation\ValidationException;
use Livewire\Attributes\Locked;

/**
 * @property-read Action $registerAction
 * @property-read Schema $form
 * @property-read Schema $multiFactorChallengeForm
 */
class Login extends SimplePage
{
    use WithRateLimiting;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    #[Locked]
    public ?string $userUndertakingMultiFactorAuthentication = null;

    public function mount(): void
    {
        if (Filament::auth()->check()) {
            redirect()->intended(Filament::getUrl());
        }

        $this->form->fill();
    }

    public function authenticate(): ?LoginResponse
    {
        try {
            $this->rateLimit(5);
        } catch (TooManyRequestsException $exception) {
            $this->getRateLimitedNotification($exception)?->send();

            return null;
        }

        $data = $this->form->getState();

        $authProvider = Filament::auth()->getProvider(); /** @phpstan-ignore-line */
        $credentials = $this->getCredentialsFromFormData($data);

        $user = $authProvider->retrieveByCredentials($credentials);

        if ((! $user) || (! $authProvider->validateCredentials($user, $credentials))) {
            $this->userUndertakingMultiFactorAuthentication = null;

            $this->throwFailureValidationException();
        }

        if (
            filled($this->userUndertakingMultiFactorAuthentication) &&
            (decrypt($this->userUndertakingMultiFactorAuthentication) === $user->getAuthIdentifier())
        ) {
            $this->multiFactorChallengeForm->validate();
        } else {
            foreach (Filament::getMultiFactorAuthenticationProviders() as $multiFactorAuthenticationProvider) {
                if (! $multiFactorAuthenticationProvider->isEnabled($user)) {
                    continue;
                }

                $this->userUndertakingMultiFactorAuthentication = encrypt($user->getAuthIdentifier());

                if ($multiFactorAuthenticationProvider instanceof HasBeforeChallengeHook) {
                    $multiFactorAuthenticationProvider->beforeChallenge($user);
                }
            }

            if (filled($this->userUndertakingMultiFactorAuthentication)) {
                $this->multiFactorChallengeForm->fill();

                return null;
            }
        }

        if (! Filament::auth()->attempt($credentials, $data['remember'] ?? false)) {
            $this->throwFailureValidationException();
        }

        $user = Filament::auth()->user();

        if (
            ($user instanceof FilamentUser) &&
            (! $user->canAccessPanel(Filament::getCurrentOrDefaultPanel()))
        ) {
            Filament::auth()->logout();

            $this->throwFailureValidationException();
        }

        session()->regenerate();

        return app(LoginResponse::class);
    }

    protected function getRateLimitedNotification(TooManyRequestsException $exception): ?Notification
    {
        return Notification::make()
            ->title(__('filament-panels::pages/auth/login.notifications.throttled.title', [
                'seconds' => $exception->secondsUntilAvailable,
                'minutes' => $exception->minutesUntilAvailable,
            ]))
            ->body(array_key_exists('body', __('filament-panels::pages/auth/login.notifications.throttled') ?: []) ? __('filament-panels::pages/auth/login.notifications.throttled.body', [
                'seconds' => $exception->secondsUntilAvailable,
                'minutes' => $exception->minutesUntilAvailable,
            ]) : null)
            ->danger();
    }

    protected function throwFailureValidationException(): never
    {
        throw ValidationException::withMessages([
            'data.email' => __('filament-panels::pages/auth/login.messages.failed'),
        ]);
    }

    public function form(Schema $form): Schema
    {
        return $form;
    }

    public function multiFactorChallengeForm(Schema $form): Schema
    {
        return $form;
    }

    /**
     * @return array<int | string, string | Schema>
     */
    protected function getForms(): array
    {
        return [
            'form' => $this->form(
                $this->makeSchema()
                    ->schema([
                        $this->getEmailFormComponent(),
                        $this->getPasswordFormComponent(),
                        $this->getRememberFormComponent(),
                    ])
                    ->statePath('data'),
            ),
            'multiFactorChallengeForm' => $this->multiFactorChallengeForm(
                $this->makeSchema()
                    ->schema(function (): array {
                        if (blank($this->userUndertakingMultiFactorAuthentication)) {
                            return [];
                        }

                        $authProvider = Filament::auth()->getProvider(); /** @phpstan-ignore-line */
                        $user = $authProvider->retrieveById(decrypt($this->userUndertakingMultiFactorAuthentication));

                        return collect(Filament::getMultiFactorAuthenticationProviders())
                            ->filter(fn (MultiFactorAuthenticationProvider $multiFactorAuthenticationProvider): bool => $multiFactorAuthenticationProvider->isEnabled($user))
                            ->map(fn (MultiFactorAuthenticationProvider $multiFactorAuthenticationProvider): Component => Group::make($multiFactorAuthenticationProvider->getChallengeFormComponents($user))
                                ->statePath($multiFactorAuthenticationProvider->getId()))
                            ->all();
                    })
                    ->statePath('data.multiFactor'),
            ),
        ];
    }

    protected function getEmailFormComponent(): Component
    {
        return TextInput::make('email')
            ->label(__('filament-panels::pages/auth/login.form.email.label'))
            ->email()
            ->required()
            ->autocomplete()
            ->autofocus()
            ->extraInputAttributes(['tabindex' => 1]);
    }

    protected function getPasswordFormComponent(): Component
    {
        return TextInput::make('password')
            ->label(__('filament-panels::pages/auth/login.form.password.label'))
            ->hint(filament()->hasPasswordReset() ? new HtmlString(Blade::render('<x-filament::link :href="filament()->getRequestPasswordResetUrl()" tabindex="3"> {{ __(\'filament-panels::pages/auth/login.actions.request_password_reset.label\') }}</x-filament::link>')) : null)
            ->password()
            ->revealable(filament()->arePasswordsRevealable())
            ->autocomplete('current-password')
            ->required()
            ->extraInputAttributes(['tabindex' => 2]);
    }

    protected function getRememberFormComponent(): Component
    {
        return Checkbox::make('remember')
            ->label(__('filament-panels::pages/auth/login.form.remember.label'));
    }

    public function registerAction(): Action
    {
        return Action::make('register')
            ->link()
            ->label(__('filament-panels::pages/auth/login.actions.register.label'))
            ->url(filament()->getRegistrationUrl());
    }

    public function getTitle(): string | Htmlable
    {
        return __('filament-panels::pages/auth/login.title');
    }

    public function getHeading(): string | Htmlable
    {
        if (filled($this->userUndertakingMultiFactorAuthentication)) {
            return __('filament-panels::pages/auth/login.multi_factor_heading');
        }

        return __('filament-panels::pages/auth/login.heading');
    }

    /**
     * @return array<Action | ActionGroup>
     */
    protected function getFormActions(): array
    {
        return [
            $this->getAuthenticateFormAction(),
        ];
    }

    protected function getAuthenticateFormAction(): Action
    {
        return Action::make('authenticate')
            ->label(__('filament-panels::pages/auth/login.form.actions.authenticate.label'))
            ->submit('authenticate');
    }

    /**
     * @return array<Action | ActionGroup>
     */
    protected function getMultiFactorChallengeFormActions(): array
    {
        return [
            $this->getMultiFactorAuthenticateFormAction(),
        ];
    }

    protected function getMultiFactorAuthenticateFormAction(): Action
    {
        return Action::make('authenticate')
            ->label(__('filament-panels::pages/auth/login.multi_factor_form.actions.authenticate.label'))
            ->submit('authenticate');
    }

    protected function hasFullWidthFormActions(): bool
    {
        return true;
    }

    protected function hasFullWidthMultiFactorChallengeFormActions(): bool
    {
        return $this->hasFullWidthFormActions();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function getCredentialsFromFormData(array $data): array
    {
        return [
            'email' => $data['email'],
            'password' => $data['password'],
        ];
    }

    public function getSubheading(): string | Htmlable | null
    {
        if (filled($this->userUndertakingMultiFactorAuthentication)) {
            return null;
        }

        if (! filament()->hasRegistration()) {
            return null;
        }

        return new HtmlString(__('filament-panels::pages/auth/login.actions.register.before') . ' ' . $this->registerAction->toHtml());
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                RenderHook::make(PanelsRenderHook::AUTH_LOGIN_FORM_BEFORE),
                $this->getFormContentComponent(),
                $this->getMultiFactorChallengeFormContentComponent(),
                RenderHook::make(PanelsRenderHook::AUTH_LOGIN_FORM_AFTER),
            ]);
    }

    public function getFormContentComponent(): Component
    {
        return Form::make([NestedSchema::make('form')])
            ->id('form')
            ->livewireSubmitHandler('authenticate')
            ->footer(FormActionsDecorations::make($this->getFormActions())
                ->alignment($this->getFormActionsAlignment())
                ->fullWidth($this->hasFullWidthFormActions()))
            ->visible(fn (): bool => blank($this->userUndertakingMultiFactorAuthentication));
    }

    public function getMultiFactorChallengeFormContentComponent(): Component
    {
        return Form::make([NestedSchema::make('multiFactorChallengeForm')])
            ->id('multiFactorChallengeForm')
            ->livewireSubmitHandler('authenticate')
            ->footer(FormActionsDecorations::make($this->getMultiFactorChallengeFormActions())
                ->alignment($this->getMultiFactorChallengeFormActionsAlignment())
                ->fullWidth($this->hasFullWidthMultiFactorChallengeFormActions()))
            ->visible(fn (): bool => filled($this->userUndertakingMultiFactorAuthentication));
    }

    public function getMultiFactorChallengeFormActionsAlignment(): string | Alignment
    {
        return $this->getFormActionsAlignment();
    }
}
