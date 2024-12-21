<?php

use Filament\Actions\Testing\Fixtures\TestAction;
use Filament\Facades\Filament;
use Filament\Pages\Auth\EditProfile;
use Filament\Tests\Fixtures\Models\User;
use Filament\Tests\TestCase;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

use function Filament\Tests\livewire;
use function Pest\Laravel\actingAs;

uses(TestCase::class);

beforeEach(function () {
    Filament::setCurrentPanel('google-two-factor-authentication');

    $googleTwoFactorAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $this->recoveryCodes = $googleTwoFactorAuthentication->generateRecoveryCodes();

    actingAs(User::factory()
        ->hasGoogleTwoFactorAuthentication($this->recoveryCodes)
        ->create());
});

it('can remove authentication when valid challenge code is used', function () {
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
            TestAction::make('removeGoogleTwoFactorAuthentication')
                ->schemaComponent('form.google_two_factor.removeGoogleTwoFactorAuthenticationAction'),
            ['code' => $googleTwoFactorAuthentication->getCurrentCode($user)],
        )
        ->assertHasNoActionErrors();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeFalse();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->toBeEmpty();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toBeEmpty();
});

it('can remove authentication when a valid recovery code is used', function () {
    $user = auth()->user();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);

    livewire(EditProfile::class)
        ->mountAction(TestAction::make('removeGoogleTwoFactorAuthentication')
            ->schemaComponent('form.google_two_factor.removeGoogleTwoFactorAuthenticationAction'))
        ->callAction(TestAction::make('useRecoveryCode')
            ->schemaComponent('mountedActionSchema0.code'))
        ->setActionData([
            'recoveryCode' => Arr::first($this->recoveryCodes),
        ])
        ->callMountedAction()
        ->assertHasNoActionErrors();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeFalse();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->toBeEmpty();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toBeEmpty();
});

it('will not remove authentication when an invalid code is used', function () {
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
            TestAction::make('removeGoogleTwoFactorAuthentication')
                ->schemaComponent('form.google_two_factor.removeGoogleTwoFactorAuthenticationAction'),
            ['code' => ($googleTwoFactorAuthentication->getCurrentCode($user) === '000000') ? '111111' : '000000'],
        )
        ->assertHasActionErrors();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);
});

test('codes are required without a recovery code', function () {
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
            TestAction::make('removeGoogleTwoFactorAuthentication')
                ->schemaComponent('form.google_two_factor.removeGoogleTwoFactorAuthenticationAction'),
            ['code' => ''],
        )
        ->assertHasActionErrors([
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

test('codes must be 6 digits', function () {
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
            TestAction::make('removeGoogleTwoFactorAuthentication')
                ->schemaComponent('form.google_two_factor.removeGoogleTwoFactorAuthenticationAction'),
            ['code' => Str::limit($googleTwoFactorAuthentication->getCurrentCode($user), limit: 5, end: '')],
        )
        ->assertHasActionErrors([
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

it('will not remove authentication when an invalid recovery code is used', function () {
    $user = auth()->user();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);

    livewire(EditProfile::class)
        ->mountAction(TestAction::make('removeGoogleTwoFactorAuthentication')
            ->schemaComponent('form.google_two_factor.removeGoogleTwoFactorAuthenticationAction'))
        ->callAction(TestAction::make('useRecoveryCode')
            ->schemaComponent('mountedActionSchema0.code'))
        ->setActionData([
            'recoveryCode' => 'invalid-recovery-code',
        ])
        ->callMountedAction()
        ->assertHasActionErrors();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);
});

it('will not remove authentication with a recovery code if recovery is disabled', function () {
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
            TestAction::make('removeGoogleTwoFactorAuthentication')
                ->schemaComponent('form.google_two_factor.removeGoogleTwoFactorAuthenticationAction'),
            ['recoveryCode' => Arr::first($this->recoveryCodes)],
        )
        ->assertHasActionErrors();

    expect($user->hasGoogleTwoFactorAuthentication())
        ->toBeTrue();

    expect($user->getGoogleTwoFactorAuthenticationSecret())
        ->not()->toBeNull();

    expect($user->getGoogleTwoFactorAuthenticationRecoveryCodes())
        ->toBeArray()
        ->toHaveCount(8);
});
