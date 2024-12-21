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

    actingAs(User::factory()->create());

    Notification::fake();
});

it('can generate a secret when the action is mounted', function () {
    $emailCodeAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailCodeAuthentication')
            ->schemaComponent('form.email_code.setUpEmailCodeAuthenticationAction'))
        ->assertActionMounted(TestAction::make('setUpEmailCodeAuthentication')
            ->schemaComponent('form.email_code.setUpEmailCodeAuthenticationAction')
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

    Notification::assertSentTo(auth()->user(), VerifyEmailCodeAuthentication::class, function (VerifyEmailCodeAuthentication $notification) use ($emailCodeAuthentication, $secret): bool {
        if ($notification->codeWindow !== $emailCodeAuthentication->getCodeWindow()) {
            return false;
        }

        return $notification->code === $emailCodeAuthentication->getCurrentCode(auth()->user(), $secret);
    });
});

it('can save the secret to the user when the action is submitted', function () {
    $emailCodeAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailCodeAuthentication())
        ->toBeFalse();

    expect($user->getEmailCodeAuthenticationSecret())
        ->toBeEmpty();

    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailCodeAuthentication')
            ->schemaComponent('form.email_code.setUpEmailCodeAuthenticationAction'));

    $encryptedActionArguments = decrypt($livewire->instance()->mountedActions[0]['arguments']['encrypted']);
    $secret = $encryptedActionArguments['secret'];

    $livewire
        ->setActionData(['code' => $emailCodeAuthentication->getCurrentCode($user, $secret)])
        ->callMountedAction()
        ->assertHasNoActionErrors();

    expect($user->hasEmailCodeAuthentication())
        ->toBeTrue();

    expect($user->getEmailCodeAuthenticationSecret())
        ->toBe($secret);
});

it('can resend the code to the user', function () {
    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailCodeAuthentication')
            ->schemaComponent('form.email_code.setUpEmailCodeAuthenticationAction'));

    Notification::assertSentTimes(VerifyEmailCodeAuthentication::class, 1);

    $livewire
        ->callAction(TestAction::make('resend')
            ->schemaComponent('mountedActionSchema0.code'));

    Notification::assertSentTimes(VerifyEmailCodeAuthentication::class, 2);
});

it('will not set up authentication when an invalid code is used', function () {
    $emailCodeAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailCodeAuthentication())
        ->toBeFalse();

    expect($user->getEmailCodeAuthenticationSecret())
        ->toBeEmpty();

    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailCodeAuthentication')
            ->schemaComponent('form.email_code.setUpEmailCodeAuthenticationAction'));

    $encryptedActionArguments = decrypt($livewire->instance()->mountedActions[0]['arguments']['encrypted']);
    $secret = $encryptedActionArguments['secret'];

    $livewire
        ->setActionData([
            'code' => ($emailCodeAuthentication->getCurrentCode($user, $secret) === '000000') ? '111111' : '000000',
        ])
        ->callMountedAction()
        ->assertHasActionErrors();

    expect($user->hasEmailCodeAuthentication())
        ->toBeFalse();

    expect($user->getEmailCodeAuthenticationSecret())
        ->toBeEmpty();
});

test('codes are required', function () {
    $user = auth()->user();

    expect($user->hasEmailCodeAuthentication())
        ->toBeFalse();

    expect($user->getEmailCodeAuthenticationSecret())
        ->toBeEmpty();

    livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailCodeAuthentication')
            ->schemaComponent('form.email_code.setUpEmailCodeAuthenticationAction'))
        ->setActionData(['code' => ''])
        ->callMountedAction()
        ->assertHasActionErrors([
            'code' => 'required',
        ]);

    expect($user->hasEmailCodeAuthentication())
        ->toBeFalse();

    expect($user->getEmailCodeAuthenticationSecret())
        ->toBeEmpty();
});

test('codes must be 6 digits', function () {
    $emailCodeAuthentication = Arr::first(Filament::getCurrentOrDefaultPanel()->getMultiFactorAuthenticationProviders());

    $user = auth()->user();

    expect($user->hasEmailCodeAuthentication())
        ->toBeFalse();

    expect($user->getEmailCodeAuthenticationSecret())
        ->toBeEmpty();

    $livewire = livewire(EditProfile::class)
        ->mountAction(TestAction::make('setUpEmailCodeAuthentication')
            ->schemaComponent('form.email_code.setUpEmailCodeAuthenticationAction'));

    $encryptedActionArguments = decrypt($livewire->instance()->mountedActions[0]['arguments']['encrypted']);
    $secret = $encryptedActionArguments['secret'];

    $livewire
        ->setActionData([
            'code' => Str::limit($emailCodeAuthentication->getCurrentCode($user, $secret), limit: 5, end: ''),
        ])
        ->callMountedAction()
        ->assertHasActionErrors([
            'code' => 'digits',
        ]);

    expect($user->hasEmailCodeAuthentication())
        ->toBeFalse();

    expect($user->getEmailCodeAuthenticationSecret())
        ->toBeEmpty();
});
