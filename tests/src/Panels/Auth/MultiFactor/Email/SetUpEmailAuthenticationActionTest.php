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

    actingAs(User::factory()->create());

    Notification::fake();
});

it('can generate a secret when the action is mounted', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailAuthentication')
            ->schemaComponent('email_code', schema: 'content'))
        ->assertActionMounted(TestAction::make('setUpEmailAuthentication')
            ->schemaComponent('email_code', schema: 'content')
            ->arguments(function (array $actualArguments): bool {
                $encrypted = decrypt($actualArguments['encrypted']);

                if (blank($encrypted['secret'] ?? null)) {
                    return false;
                }

                if (blank($encrypted['userId'] ?? null)) {
                    return false;
                }

                return $encrypted['userId'] === auth()->id();
            }));

    $encryptedActionArguments = decrypt($livewire->instance()->mountedActions[0]['arguments']['encrypted']);
    $secret = $encryptedActionArguments['secret'];

    Notification::assertSentTo(auth()->user(), VerifyEmailAuthentication::class, function (VerifyEmailAuthentication $notification) use ($emailAuthentication, $secret): bool {
        if ($notification->codeWindow !== $emailAuthentication->getCodeWindow()) {
            return false;
        }

        return $notification->code === $emailAuthentication->getCurrentCode(auth()->user(), $secret);
    });
});

it('can save the secret to the user when the action is submitted', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailAuthentication())
        ->toBeFalse();

    expect($user->getEmailAuthenticationSecret())
        ->toBeEmpty();

    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailAuthentication')
            ->schemaComponent('email_code', schema: 'content'));

    $encryptedActionArguments = decrypt($livewire->instance()->mountedActions[0]['arguments']['encrypted']);
    $secret = $encryptedActionArguments['secret'];

    $livewire
        ->fillForm(['code' => $emailAuthentication->getCurrentCode($user, $secret)])
        ->callMountedAction()
        ->assertHasNoFormErrors();

    expect($user->hasEmailAuthentication())
        ->toBeTrue();

    expect($user->getEmailAuthenticationSecret())
        ->toBe($secret);
});

it('can resend the code to the user', function (): void {
    $this->travelTo(now()->subMinute());

    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailAuthentication')
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
        ->mountAction(TestAction::make('setUpEmailAuthentication')
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

it('will not set up authentication when an invalid code is used', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailAuthentication())
        ->toBeFalse();

    expect($user->getEmailAuthenticationSecret())
        ->toBeEmpty();

    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailAuthentication')
            ->schemaComponent('email_code', schema: 'content'));

    $encryptedActionArguments = decrypt($livewire->instance()->mountedActions[0]['arguments']['encrypted']);
    $secret = $encryptedActionArguments['secret'];

    $livewire
        ->fillForm([
            'code' => ($emailAuthentication->getCurrentCode($user, $secret) === '000000') ? '111111' : '000000',
        ])
        ->callMountedAction()
        ->assertHasFormErrors();

    expect($user->hasEmailAuthentication())
        ->toBeFalse();

    expect($user->getEmailAuthenticationSecret())
        ->toBeEmpty();
});

test('codes are required', function (): void {
    $user = auth()->user();

    expect($user->hasEmailAuthentication())
        ->toBeFalse();

    expect($user->getEmailAuthenticationSecret())
        ->toBeEmpty();

    livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailAuthentication')
            ->schemaComponent('email_code', schema: 'content'))
        ->fillForm(['code' => ''])
        ->callMountedAction()
        ->assertHasFormErrors([
            'code' => 'required',
        ]);

    expect($user->hasEmailAuthentication())
        ->toBeFalse();

    expect($user->getEmailAuthenticationSecret())
        ->toBeEmpty();
});

test('codes must be 6 digits', function (): void {
    $emailAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailAuthentication())
        ->toBeFalse();

    expect($user->getEmailAuthenticationSecret())
        ->toBeEmpty();

    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailAuthentication')
            ->schemaComponent('email_code', schema: 'content'));

    $encryptedActionArguments = decrypt($livewire->instance()->mountedActions[0]['arguments']['encrypted']);
    $secret = $encryptedActionArguments['secret'];

    $livewire
        ->fillForm([
            'code' => Str::limit($emailAuthentication->getCurrentCode($user, $secret), limit: 5, end: ''),
        ])
        ->callMountedAction()
        ->assertHasFormErrors([
            'code' => 'digits',
        ]);

    expect($user->hasEmailAuthentication())
        ->toBeFalse();

    expect($user->getEmailAuthenticationSecret())
        ->toBeEmpty();
});
