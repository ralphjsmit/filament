<?php

use Filament\Actions\Testing\Fixtures\TestAction;
use Filament\Facades\Filament;
use Filament\MultiFactorAuthentication\EmailCode\Notifications\VerifyEmailCodeAuthentication;
use Filament\Pages\Auth\EditProfile;
use Filament\Tests\Fixtures\Models\User;
use Filament\Tests\TestCase;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

use function Filament\Tests\livewire;
use function Pest\Laravel\actingAs;

uses(TestCase::class);

beforeEach(function () {
    Filament::setCurrentPanel('email-code-authentication');

    actingAs(User::factory()
        ->hasEmailCodeAuthentication()
        ->create());

    Notification::fake();
});

it('can remove authentication when valid challenge code is used', function () {
    $emailCodeAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailCodeAuthentication())
        ->toBeTrue();

    $originalSecret = $user->getEmailCodeAuthenticationSecret();

    expect($originalSecret)
        ->not()->toBeNull();

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('removeEmailCodeAuthentication')
                ->schemaComponent('form.email_code.removeEmailCodeAuthenticationAction'),
            ['code' => $emailCodeAuthentication->getCurrentCode($user)],
        )
        ->assertHasNoActionErrors();

    expect($user->hasEmailCodeAuthentication())
        ->toBeFalse();

    expect($user->getEmailCodeAuthenticationSecret())
        ->toBeEmpty();

    Notification::assertSentTo($user, VerifyEmailCodeAuthentication::class, function (VerifyEmailCodeAuthentication $notification) use ($emailCodeAuthentication, $originalSecret, $user): bool {
        if ($notification->codeWindow !== $emailCodeAuthentication->getCodeWindow()) {
            return false;
        }

        return $notification->code === $emailCodeAuthentication->getCurrentCode($user, $originalSecret);
    });
});

it('can resend the code to the user', function () {
    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('removeEmailCodeAuthentication')
            ->schemaComponent('form.email_code.removeEmailCodeAuthenticationAction'));

    Notification::assertSentTimes(VerifyEmailCodeAuthentication::class, 1);

    $livewire
        ->callAction(TestAction::make('resend')
            ->schemaComponent('mountedActionSchema0.code'));

    Notification::assertSentTimes(VerifyEmailCodeAuthentication::class, 2);
});

it('will not remove authentication when an invalid code is used', function () {
    $emailCodeAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailCodeAuthentication())
        ->toBeTrue();

    expect($user->getEmailCodeAuthenticationSecret())
        ->not()->toBeNull();

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('removeEmailCodeAuthentication')
                ->schemaComponent('form.email_code.removeEmailCodeAuthenticationAction'),
            ['code' => ($emailCodeAuthentication->getCurrentCode($user) === '000000') ? '111111' : '000000'],
        )
        ->assertHasActionErrors();

    expect($user->hasEmailCodeAuthentication())
        ->toBeTrue();

    expect($user->getEmailCodeAuthenticationSecret())
        ->not()->toBeNull();
});

test('codes are required', function () {
    $user = auth()->user();

    expect($user->hasEmailCodeAuthentication())
        ->toBeTrue();

    expect($user->getEmailCodeAuthenticationSecret())
        ->not()->toBeNull();

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('removeEmailCodeAuthentication')
                ->schemaComponent('form.email_code.removeEmailCodeAuthenticationAction'),
            ['code' => ''],
        )
        ->assertHasActionErrors([
            'code' => 'required',
        ]);

    expect($user->hasEmailCodeAuthentication())
        ->toBeTrue();

    expect($user->getEmailCodeAuthenticationSecret())
        ->not()->toBeNull();
});

test('codes must be 6 digits', function () {
    $emailCodeAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailCodeAuthentication())
        ->toBeTrue();

    expect($user->getEmailCodeAuthenticationSecret())
        ->not()->toBeNull();

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('removeEmailCodeAuthentication')
                ->schemaComponent('form.email_code.removeEmailCodeAuthenticationAction'),
            ['code' => Str::limit($emailCodeAuthentication->getCurrentCode($user), limit: 5, end: '')],
        )
        ->assertHasActionErrors([
            'code' => 'digits',
        ]);

    expect($user->hasEmailCodeAuthentication())
        ->toBeTrue();

    expect($user->getEmailCodeAuthenticationSecret())
        ->not()->toBeNull();
});
