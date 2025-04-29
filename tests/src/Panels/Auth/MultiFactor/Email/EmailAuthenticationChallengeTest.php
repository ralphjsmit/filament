<?php

use Filament\Actions\Testing\TestAction;
use Filament\Auth\MultiFactor\Email\Notifications\VerifyEmailAuthentication;
use Filament\Auth\Pages\Login;
use Filament\Facades\Filament;
use Filament\Tests\Fixtures\Models\User;
use Filament\Tests\TestCase;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

use function Filament\Tests\livewire;

uses(TestCase::class);

beforeEach(function (): void {
    Filament::setCurrentPanel('email-authentication');

    Notification::fake();
});

it('can render the challenge form after valid login credentials are successfully used', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $userToAuthenticate = User::factory()
        ->hasEmailAuthentication()
        ->create();

    $livewire = livewire(Login::class)
        ->fillForm([
            'email' => $userToAuthenticate->email,
            'password' => 'password',
        ])
        ->assertSet('userUndertakingMultiFactorAuthentication', null)
        ->call('authenticate')
        ->assertNotSet('userUndertakingMultiFactorAuthentication', null)
        ->assertNoRedirect();

    expect(decrypt($livewire->instance()->userUndertakingMultiFactorAuthentication))
        ->toBe($userToAuthenticate->getKey());

    $this->assertGuest();

    Notification::assertSentTo($userToAuthenticate, VerifyEmailAuthentication::class, function (VerifyEmailAuthentication $notification) use ($emailAuthentication, $userToAuthenticate): bool {
        if ($notification->codeWindow !== $emailAuthentication->getCodeWindow()) {
            return false;
        }

        return $notification->code === $emailAuthentication->getCurrentCode($userToAuthenticate);
    });
});

it('will authenticate the user after a valid challenge code is used', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $userToAuthenticate = User::factory()
        ->hasEmailAuthentication()
        ->create();

    livewire(Login::class)
        ->fillForm([
            'email' => $userToAuthenticate->email,
            'password' => 'password',
        ])
        ->call('authenticate')
        ->assertNotSet('userUndertakingMultiFactorAuthentication', null)
        ->assertNoRedirect()
        ->fillForm([
            $emailAuthentication->getId() => [
                'code' => $emailAuthentication->getCurrentCode($userToAuthenticate),
            ],
        ], 'multiFactorChallengeForm')
        ->call('authenticate')
        ->assertHasNoErrors()
        ->assertRedirect(Filament::getUrl());

    $this->assertAuthenticatedAs($userToAuthenticate);
});

it('can resend the code to the user', function (): void {
    $this->travelTo(now()->subMinute());

    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $userToAuthenticate = User::factory()
        ->hasEmailAuthentication()
        ->create();

    $livewire = livewire(Login::class)
        ->fillForm([
            'email' => $userToAuthenticate->email,
            'password' => 'password',
        ])
        ->call('authenticate');

    Notification::assertSentTimes(VerifyEmailAuthentication::class, 1);

    $this->travelBack();

    $livewire
        ->callAction(TestAction::make('resend')
            ->schemaComponent("{$emailAuthentication->getId()}.code", schema: 'multiFactorChallengeForm'));

    Notification::assertSentTimes(VerifyEmailAuthentication::class, 2);
});

it('can not resend the code to the user more than once per minute', function (): void {
    $this->travelTo(now()->subMinute());

    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $userToAuthenticate = User::factory()
        ->hasEmailAuthentication()
        ->create();

    $livewire = livewire(Login::class)
        ->fillForm([
            'email' => $userToAuthenticate->email,
            'password' => 'password',
        ])
        ->call('authenticate');

    Notification::assertSentTimes(VerifyEmailAuthentication::class, 1);

    $livewire
        ->callAction(TestAction::make('resend')
            ->schemaComponent("{$emailAuthentication->getId()}.code", schema: 'multiFactorChallengeForm'));

    Notification::assertSentTimes(VerifyEmailAuthentication::class, 1);

    $this->travelBack();

    $livewire
        ->callAction(TestAction::make('resend')
            ->schemaComponent("{$emailAuthentication->getId()}.code", schema: 'multiFactorChallengeForm'));

    Notification::assertSentTimes(VerifyEmailAuthentication::class, 2);
});

it('will not render the challenge form after invalid login credentials are used', function (): void {
    $userToAuthenticate = User::factory()
        ->hasEmailAuthentication()
        ->create();

    livewire(Login::class)
        ->fillForm([
            'email' => $userToAuthenticate->email,
            'password' => 'incorrect-password',
        ])
        ->assertSet('userUndertakingMultiFactorAuthentication', null)
        ->call('authenticate')
        ->assertSet('userUndertakingMultiFactorAuthentication', null)
        ->assertNoRedirect();

    $this->assertGuest();

    Notification::assertNotSentTo($userToAuthenticate, VerifyEmailAuthentication::class);
});

it('will not render the challenge form if a user does not have multi-factor authentication enabled', function (): void {
    $userToAuthenticate = User::factory()->create();

    livewire(Login::class)
        ->fillForm([
            'email' => $userToAuthenticate->email,
            'password' => 'password',
        ])
        ->assertSet('userUndertakingMultiFactorAuthentication', null)
        ->call('authenticate')
        ->assertSet('userUndertakingMultiFactorAuthentication', null)
        ->assertRedirect(Filament::getUrl());

    $this->assertAuthenticatedAs($userToAuthenticate);

    Notification::assertNotSentTo($userToAuthenticate, VerifyEmailAuthentication::class);
});

it('will not authenticate the user when an invalid challenge code is used', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $userToAuthenticate = User::factory()
        ->hasEmailAuthentication()
        ->create();

    livewire(Login::class)
        ->fillForm([
            'email' => $userToAuthenticate->email,
            'password' => 'password',
        ])
        ->call('authenticate')
        ->assertNotSet('userUndertakingMultiFactorAuthentication', null)
        ->assertNoRedirect()
        ->fillForm([
            $emailAuthentication->getId() => [
                'code' => ($emailAuthentication->getCurrentCode($userToAuthenticate) === '000000')
                    ? '111111'
                    : '000000',
            ],
        ], 'multiFactorChallengeForm')
        ->call('authenticate')
        ->assertHasFormErrors([
            "{$emailAuthentication->getId()}.code",
        ], 'multiFactorChallengeForm')
        ->assertNoRedirect();

    $this->assertGuest();
});

test('challenge codes are required', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $userToAuthenticate = User::factory()
        ->hasEmailAuthentication()
        ->create();

    livewire(Login::class)
        ->fillForm([
            'email' => $userToAuthenticate->email,
            'password' => 'password',
        ])
        ->call('authenticate')
        ->assertNotSet('userUndertakingMultiFactorAuthentication', null)
        ->assertNoRedirect()
        ->fillForm([
            $emailAuthentication->getId() => [
                'code' => '',
            ],
        ], 'multiFactorChallengeForm')
        ->call('authenticate')
        ->assertHasFormErrors([
            "{$emailAuthentication->getId()}.code" => 'required',
        ], 'multiFactorChallengeForm')
        ->assertNoRedirect();

    $this->assertGuest();
});

test('challenge codes must be numeric', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $userToAuthenticate = User::factory()
        ->hasEmailAuthentication()
        ->create();

    livewire(Login::class)
        ->fillForm([
            'email' => $userToAuthenticate->email,
            'password' => 'password',
        ])
        ->call('authenticate')
        ->assertNotSet('userUndertakingMultiFactorAuthentication', null)
        ->assertNoRedirect()
        ->fillForm([
            $emailAuthentication->getId() => [
                'code' => Str::random(6),
            ],
        ], 'multiFactorChallengeForm')
        ->call('authenticate')
        ->assertHasFormErrors([
            "{$emailAuthentication->getId()}.code" => 'numeric',
        ], 'multiFactorChallengeForm')
        ->assertNoRedirect();

    $this->assertGuest();
});

test('challenge codes must be 6 digits', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $userToAuthenticate = User::factory()
        ->hasEmailAuthentication()
        ->create();

    livewire(Login::class)
        ->fillForm([
            'email' => $userToAuthenticate->email,
            'password' => 'password',
        ])
        ->call('authenticate')
        ->assertNotSet('userUndertakingMultiFactorAuthentication', null)
        ->assertNoRedirect()
        ->fillForm([
            $emailAuthentication->getId() => [
                'code' => Str::limit($emailAuthentication->getCurrentCode($userToAuthenticate), limit: 5, end: ''),
            ],
        ], 'multiFactorChallengeForm')
        ->call('authenticate')
        ->assertHasFormErrors([
            "{$emailAuthentication->getId()}.code" => 'digits',
        ], 'multiFactorChallengeForm')
        ->assertNoRedirect();

    $this->assertGuest();
});
