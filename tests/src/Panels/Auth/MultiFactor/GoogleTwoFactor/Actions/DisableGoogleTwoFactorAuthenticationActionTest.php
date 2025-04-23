<?php

use Filament\Actions\Testing\TestAction;
use Filament\Auth\Pages\EditProfile;
use Filament\Facades\Filament;
use Filament\Tests\Fixtures\Models\User;
use Filament\Tests\TestCase;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

use function Filament\Tests\livewire;
use function Pest\Laravel\actingAs;

uses(TestCase::class);

beforeEach(function (): void {
    Filament::setCurrentPanel('google-two-factor-authentication');

    $googleTwoFactorAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $this->recoveryCodes = $googleTwoFactorAuthentication->generateRecoveryCodes();

    actingAs(User::factory()
        ->hasGoogleTwoFactorAuthentication($this->recoveryCodes)
        ->create());
});

it('can disable authentication when valid challenge code is used', function (): void {
    $googleTwoFactorAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('disableGoogleTwoFactorAuthentication')
                ->schemaComponent('google_two_factor', schema: 'content'),
            ['code' => $googleTwoFactorAuthentication->getCurrentCode($user)],
        )
        ->assertHasNoFormErrors();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeFalse();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->toBeEmpty();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeNull();
});

it('can disable authentication when a valid recovery code is used', function (): void {
    $user = auth()->user();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);

    livewire(EditProfile::class)
        ->mountAction(TestAction::make('disableGoogleTwoFactorAuthentication')
            ->schemaComponent('google_two_factor', schema: 'content'))
        ->callAction(TestAction::make('useRecoveryCode')
            ->schemaComponent('code'))
        ->fillForm([
            'recoveryCode' => Arr::first($this->recoveryCodes),
        ])
        ->callMountedAction()
        ->assertHasNoFormErrors();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeFalse();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->toBeEmpty();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeNull();
});

it('will not disable authentication when an invalid code is used', function (): void {
    $googleTwoFactorAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('disableGoogleTwoFactorAuthentication')
                ->schemaComponent('google_two_factor', schema: 'content'),
            ['code' => ($googleTwoFactorAuthentication->getCurrentCode($user) === '000000') ? '111111' : '000000'],
        )
        ->assertHasFormErrors();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);
});

test('codes are required without a recovery code', function (): void {
    $user = auth()->user();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('disableGoogleTwoFactorAuthentication')
                ->schemaComponent('google_two_factor', schema: 'content'),
            ['code' => ''],
        )
        ->assertHasFormErrors([
            'code' => 'required',
        ]);

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);
});

test('codes must be 6 digits', function (): void {
    $googleTwoFactorAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('disableGoogleTwoFactorAuthentication')
                ->schemaComponent('google_two_factor', schema: 'content'),
            ['code' => Str::limit($googleTwoFactorAuthentication->getCurrentCode($user), limit: 5, end: '')],
        )
        ->assertHasFormErrors([
            'code' => 'digits',
        ]);

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);
});

it('will not disable authentication when an invalid recovery code is used', function (): void {
    $user = auth()->user();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);

    livewire(EditProfile::class)
        ->mountAction(TestAction::make('disableGoogleTwoFactorAuthentication')
            ->schemaComponent('google_two_factor', schema: 'content'))
        ->callAction(TestAction::make('useRecoveryCode')
            ->schemaComponent('code'))
        ->fillForm([
            'recoveryCode' => 'invalid-recovery-code',
        ])
        ->callMountedAction()
        ->assertHasFormErrors();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);
});

it('will not disable authentication with a recovery code if recovery is disabled', function (): void {
    Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders())
        ->recoverable(false);

    $user = auth()->user();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('disableGoogleTwoFactorAuthentication')
                ->schemaComponent('google_two_factor', schema: 'content'),
            ['recoveryCode' => Arr::first($this->recoveryCodes)],
        )
        ->assertHasFormErrors();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);
});
