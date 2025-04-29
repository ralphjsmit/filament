<?php

use Filament\Actions\Testing\TestAction;
use Filament\Auth\MultiFactor\Email\Notifications\VerifyEmailAuthentication;
use Filament\Auth\Pages\EditProfile;
use Filament\Facades\Filament;
use Filament\Tests\Fixtures\Models\User;
use Filament\Tests\TestCase;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

use function Filament\Tests\livewire;
use function Pest\Laravel\actingAs;

uses(TestCase::class);

beforeEach(function (): void {
    Filament::setCurrentPanel('email-authentication');

    actingAs(User::factory()
        ->hasEmailAuthentication()
        ->create());

    Notification::fake();
});

it('can disable authentication when valid challenge code is used', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailAuthentication())
        ->toBeTrue();

    $originalSecret = $user->getEmailAuthenticationSecret();

    expect($originalSecret)
        ->not()->toBeNull();

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('disableEmailAuthentication')
                ->schemaComponent('email_code', schema: 'content'),
            ['code' => $emailAuthentication->getCurrentCode($user)],
        )
        ->assertHasNoFormErrors();

    expect($user->hasEmailAuthentication())
        ->toBeFalse();

    expect($user->getEmailAuthenticationSecret())
        ->toBeEmpty();

    Notification::assertSentTo($user, VerifyEmailAuthentication::class, function (VerifyEmailAuthentication $notification) use ($emailAuthentication, $originalSecret, $user): bool {
        if ($notification->codeWindow !== $emailAuthentication->getCodeWindow()) {
            return false;
        }

        return $notification->code === $emailAuthentication->getCurrentCode($user, $originalSecret);
    });
});

it('can resend the code to the user', function (): void {
    $this->travelTo(now()->subMinute());

    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('disableEmailAuthentication')
            ->schemaComponent('email_code', schema: 'content'));

    Notification::assertSentTimes(VerifyEmailAuthentication::class, 1);

    $this->travelBack();

    $livewire
        ->callAction(TestAction::make('resend')
            ->schemaComponent('code'));

    Notification::assertSentTimes(VerifyEmailAuthentication::class, 2);
});

it('can resend the code to the user more than once per minute', function (): void {
    $this->travelTo(now()->subMinute());

    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('disableEmailAuthentication')
            ->schemaComponent('email_code', schema: 'content'));

    Notification::assertSentTimes(VerifyEmailAuthentication::class, 1);

    $livewire
        ->callAction(TestAction::make('resend')
            ->schemaComponent('code'));

    Notification::assertSentTimes(VerifyEmailAuthentication::class, 1);

    $this->travelBack();

    $livewire
        ->callAction(TestAction::make('resend')
            ->schemaComponent('code'));

    Notification::assertSentTimes(VerifyEmailAuthentication::class, 2);
});

it('will not disable authentication when an invalid code is used', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailAuthentication())
        ->toBeTrue();

    expect($user->getEmailAuthenticationSecret())
        ->not()->toBeNull();

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('disableEmailAuthentication')
                ->schemaComponent('email_code', schema: 'content'),
            ['code' => ($emailAuthentication->getCurrentCode($user) === '000000') ? '111111' : '000000'],
        )
        ->assertHasFormErrors();

    expect($user->hasEmailAuthentication())
        ->toBeTrue();

    expect($user->getEmailAuthenticationSecret())
        ->not()->toBeNull();
});

test('codes are required', function (): void {
    $user = auth()->user();

    expect($user->hasEmailAuthentication())
        ->toBeTrue();

    expect($user->getEmailAuthenticationSecret())
        ->not()->toBeNull();

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('disableEmailAuthentication')
                ->schemaComponent('email_code', schema: 'content'),
            ['code' => ''],
        )
        ->assertHasFormErrors([
            'code' => 'required',
        ]);

    expect($user->hasEmailAuthentication())
        ->toBeTrue();

    expect($user->getEmailAuthenticationSecret())
        ->not()->toBeNull();
});

test('codes must be 6 digits', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailAuthentication())
        ->toBeTrue();

    expect($user->getEmailAuthenticationSecret())
        ->not()->toBeNull();

    livewire(EditProfile::class)
        ->callAction(
            TestAction::make('disableEmailAuthentication')
                ->schemaComponent('email_code', schema: 'content'),
            ['code' => Str::limit($emailAuthentication->getCurrentCode($user), limit: 5, end: '')],
        )
        ->assertHasFormErrors([
            'code' => 'digits',
        ]);

    expect($user->hasEmailAuthentication())
        ->toBeTrue();

    expect($user->getEmailAuthenticationSecret())
        ->not()->toBeNull();
});
