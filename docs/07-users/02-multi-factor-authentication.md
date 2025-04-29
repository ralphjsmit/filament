---
title: Multi-factor authentication
---
import Aside from "@components/Aside.astro"

## Introduction

Users in Filament can sign in with their email address and password by default. However, you can enable multi-factor authentication (MFA) to add an extra layer of security to your users' accounts.

When MFA is enabled, users must perform an extra step before they are authenticated and have access to the application.

Filament includes two methods of MFA which you can enable out of the box:

- [Google two-factor authentication](#google-two-factor-authentication) uses a Google Authenticator-compatible app (such as the Google Authenticator, Authy, or Microsoft Authenticator apps) to generate a time-based one-time password (TOTP) that is used to verify the user.
- [Email authentication](#email-authentication) sends a time-based one-time password (TOTP) to the user's email address, which they must enter to verify their identity.

In Filament, users set up multi-factor authentication from their [profile page](overview#authentication-features). If you use Filament's profile page feature, setting up multi-factor authentication will automatically add the correct UI elements to the profile page:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->profile();
}
```

## Google two-factor authentication

To enable Google two-factor authentication in a panel, you must first add a new column to your `users` table (or whichever table is being used for your "authenticatable" Eloquent model in this panel). The column needs to store the secret key used to generate and verify the time-based one-time passwords. It can be a normal `text()` column in a migration:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->text('google_two_factor_authentication_secret')->nullable();
});
```

In the `User` model, you need to ensure that this column is encrypted and `$hidden`, since this is incredibly sensitive information that should be stored securely:

```php
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, MustVerifyEmail
{
    // ...

    /**
     * @var array<string>
     */
    protected $hidden = [
        // ...
        'google_two_factor_authentication_secret',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        // ...
        'google_two_factor_authentication_secret' => 'encrypted',
    ];
    
    // ...
}
```

Next, you should implement the `HasGoogleTwoFactorAuthentication` interface on the `User` model. This provides Filament with the necessary methods to interact with the secret code and other information about the integration:

```php
use Filament\Auth\MultiFactor\GoogleTwoFactor\Contracts\HasGoogleTwoFactorAuthentication;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, HasGoogleTwoFactorAuthentication, MustVerifyEmail
{
    // ...

    public function hasGoogleTwoFactorAuthentication(): bool
    {
        // This method should return true if the user has enabled Google two-factor authentication.
        // We know that the user has enabled it if the secret is not null, but if your app has
        // another mechanism for disabling two-factor authentication even when a secret is
        // set, you should check that here.
        
        return filled($this->google_two_factor_authentication_secret);
    }

    public function getGoogleTwoFactorAuthenticationSecret(): ?string
    {
        // This method should return the user's saved Google two-factor authentication secret.
    
        return $this->google_two_factor_authentication_secret;
    }

    public function saveGoogleTwoFactorAuthenticationSecret(?string $secret): void
    {
        // This method should save the user's Google two-factor authentication secret.
    
        $this->google_two_factor_authentication_secret = $secret;
        $this->save();
    }

    public function getGoogleTwoFactorAuthenticationHolderName(): string
    {
        // In a user's authentication app, each account can be represented by a "holder name".
        // If the user has multiple accounts in your app, it might be a good idea to use
        // their email address as then they are still uniquely identifiable.
    
        return $this->email;
    }
}
```

<Aside variant="tip">
    Since Filament uses an interface on your `User` model instead of assuming that the `google_two_factor_authentication_secret` column exists, you can use any column name you want. You could even use a different model entirely if you want to store the secret in a different table.
</Aside>

Finally, you should activate the Google two-factor authentication feature in your panel. To do this, use the `multiFactorAuthentication()` method in the [configuration](../panel-configuration), and pass a `GoogleTwoFactorAuthentication` instance to it:

```php
use Filament\Auth\MultiFactor\GoogleTwoFactor\GoogleTwoFactorAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            GoogleTwoFactorAuthentication::make(),
        ]);
}
```

### Setting up Google two-factor recovery codes

If your users lose access to their two-factor authentication app, they will be unable to sign in to your application. To prevent this, you can generate a set of recovery codes that users can use to sign in if they lose access to their two-factor authentication app.

In a similar way to the `google_two_factor_authentication_secret` column, you should add a new column to your `users` table (or whichever table is being used for your "authenticatable" Eloquent model in this panel). The column needs to store the recovery codes. It can be a normal `text()` column in a migration:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->text('google_two_factor_authentication_recovery_codes')->nullable();
});
```

In the `User` model, you need to ensure that this column is encrypted as an array and `$hidden`, since this is incredibly sensitive information that should be stored securely:

```php
use Filament\Auth\MultiFactor\GoogleTwoFactor\Contracts\HasGoogleTwoFactorAuthentication;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, HasGoogleTwoFactorAuthentication, MustVerifyEmail
{
    // ...

    /**
     * @var array<string>
     */
    protected $hidden = [
        // ...
        'google_two_factor_authentication_recovery_codes',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        // ...
        'google_two_factor_authentication_recovery_codes' => 'encrypted:array',
    ];
    
    // ...
}
```

Next, you should implement the `HasGoogleTwoFactorAuthenticationRecovery` interface on the `User` model. This provides Filament with the necessary methods to interact with the recovery codes:

```php
use Filament\Auth\MultiFactor\GoogleTwoFactor\Contracts\HasGoogleTwoFactorAuthentication;
use Filament\Auth\MultiFactor\GoogleTwoFactor\Contracts\HasGoogleTwoFactorAuthenticationRecovery;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, HasGoogleTwoFactorAuthentication, HasGoogleTwoFactorAuthenticationRecovery, MustVerifyEmail
{
    // ...

    /**
     * @return ?array<string>
     */
    public function getGoogleTwoFactorAuthenticationRecoveryCodes(): ?array
    {
        // This method should return the user's saved Google two-factor authentication recovery codes.
    
        return $this->google_two_factor_authentication_recovery_codes;
    }

    /**
     * @param  array<string> | null  $codes
     */
    public function saveGoogleTwoFactorAuthenticationRecoveryCodes(?array $codes): void
    {
        // This method should save the user's Google two-factor authentication recovery codes.
    
        $this->google_two_factor_authentication_recovery_codes = $codes;
        $this->save();
    }
}
```

<Aside variant="tip">
    Since Filament uses an interface on your `User` model instead of assuming that the `google_two_factor_authentication_recovery_codes` column exists, you can use any column name you want. You could even use a different model entirely if you want to store the recovery codes in a different table.
</Aside>

Finally, you should activate the Google two-factor authentication recovery codes feature in your panel. To do this, pass the `recoverable()` method to the `GoogleTwoFactorAuthentication` instance in the `multiFactorAuthentication()` method in the [configuration](../panel-configuration):

```php
use Filament\Auth\MultiFactor\GoogleTwoFactor\GoogleTwoFactorAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            GoogleTwoFactorAuthentication::make()
                ->recoverable(),
        ]);
}
```

#### Changing the number of recovery codes that are generated

By default, Filament generates 8 recovery codes for each user. If you want to change this, you can use the `recoveryCodeCount()` method on the `GoogleTwoFactorAuthentication` instance in the `multiFactorAuthentication()` method in the [configuration](../panel-configuration):

```php
use Filament\Auth\MultiFactor\GoogleTwoFactor\GoogleTwoFactorAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            GoogleTwoFactorAuthentication::make()
                ->recoverable()
                ->recoveryCodeCount(10),
        ]);
}
```

#### Preventing users from regenerating their recovery codes

By default, users can visit their profile to regenerate their recovery codes. If you want to prevent this, you can use the `regenerableRecoveryCodes(false)` method on the `GoogleTwoFactorAuthentication` instance in the `multiFactorAuthentication()` method in the [configuration](../panel-configuration):

```php
use Filament\Auth\MultiFactor\GoogleTwoFactor\GoogleTwoFactorAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            GoogleTwoFactorAuthentication::make()
                ->recoverable()
                ->regenerableRecoveryCodes(false),
        ]);
}
```

### Changing the Google two-factor code expiration time

Google two-factor codes are issued using a time-based one-time password (TOTP) algorithm, which means that they are only valid for a short period of time before and after the time they are generated. The time is defined in a "window" of time. By default, Filament uses an expiration window of `8`, which allows the code to be valid for 4 minutes after it is generated.

To change the window, for example to only be valid for 2 minutes after it is generated, you can use the `codeWindow()` method on the `GoogleTwoFactorAuthentication` instance, set to `4`:

```php
use Filament\Auth\MultiFactor\GoogleTwoFactor\GoogleTwoFactorAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            GoogleTwoFactorAuthentication::make()
                ->codeWindow(4),
        ]);
}
```

### Customizing the Google two-factor authentication brand name

Each Google two-factor authentication integration has a "brand name" that is displayed in the authentication app. By default, this is the name of your app. If you want to change this, you can use the `brandName()` method on the `GoogleTwoFactorAuthentication` instance in the `multiFactorAuthentication()` method in the [configuration](../panel-configuration):

```php
use Filament\Auth\MultiFactor\GoogleTwoFactor\GoogleTwoFactorAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            GoogleTwoFactorAuthentication::make()
                ->brandName('Filament Demo'),
        ]);
}
```

## Email authentication

Email authentication sends the user time-based one-time passwords (TOTP) to their email address, which they must enter to verify their identity. These TOTP codes are generated using the same algorithm as [Google two-factor authentication](#google-two-factor-authentication).

To enable email authentication in a panel, you must first add a new column to your `users` table (or whichever table is being used for your "authenticatable" Eloquent model in this panel). The column needs to store the secret key used to generate and verify the time-based one-time passwords. It can be a normal `text()` column in a migration:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->text('email_authentication_secret')->nullable();
});
```

In the `User` model, you need to ensure that this column is encrypted and `$hidden`, since this is incredibly sensitive information that should be stored securely:

```php
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, MustVerifyEmail
{
    // ...

    /**
     * @var array<string>
     */
    protected $hidden = [
        // ...
        'email_authentication_secret',
    ];
    
    /**
     * @var array<string, string>
     */
    protected $casts = [
        // ...
        'email_authentication_secret' => 'encrypted',
    ];
    
    // ...
}
```

Next, you should implement the `HasEmailAuthentication` interface on the `User` model. This provides Filament with the necessary methods to interact with the secret code and other information about the integration:

```php
use Filament\Auth\MultiFactor\Email\Contracts\HasEmailAuthentication;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, HasEmailAuthentication, MustVerifyEmail
{
    // ...

    public function hasEmailAuthentication(): bool
    {
        // This method should return true if the user has enabled email authentication.
        // We know that the user has enabled it if the secret is not null, but if your app has
        // another mechanism for disabling email authentication even when a secret is
        // set, you should check that here.
        
        return filled($this->email_authentication_secret);
    }

    public function getEmailAuthenticationSecret(): ?string
    {
        // This method should return the user's saved email authentication secret.
    
        return $this->email_authentication_secret;
    }

    public function saveEmailAuthenticationSecret(?string $secret): void
    {
        // This method should save the user's email authentication secret.
    
        $this->email_authentication_secret = $secret;
        $this->save();
    }
}
```

<Aside variant="tip">
    Since Filament uses an interface on your `User` model instead of assuming that the `email_authentication_secret` column exists, you can use any column name you want. You could even use a different model entirely if you want to store the secret in a different table.
</Aside>

Finally, you should activate the email authentication feature in your panel. To do this, use the `multiFactorAuthentication()` method in the [configuration](../panel-configuration), and pass an `EmailAuthentication` instance to it:

```php
use Filament\Auth\MultiFactor\Email\EmailAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            EmailAuthentication::make(),
        ]);
}
```

### Changing the email code expiration time

Email codes are issued using a time-based one-time password (TOTP) algorithm, which means that they are only valid for a short period of time before and after the time they are generated. The time is defined in a "window" of time. By default, Filament uses an expiration window of `8`, which allows the code to be valid for 4 minutes after it is generated.

To change the window, for example to only be valid for 2 minutes after it is generated, you can use the `codeWindow()` method on the `EmailAuthentication` instance, set to `4`:

```php
use Filament\Auth\MultiFactor\Email\EmailAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            EmailAuthentication::make()
                ->codeWindow(4),
        ]);
}
```

## Requiring multi-factor authentication

By default, users are not required to set up multi-factor authentication. You can require users to configure it by passing `isRequired: true` as a parameter to the `multiFactorAuthentication()` method in the [configuration](../panel-configuration):

```php
use Filament\Auth\MultiFactor\GoogleTwoFactor\GoogleTwoFactorAuthentication;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->multiFactorAuthentication([
            GoogleTwoFactorAuthentication::make(),
        ], isRequired: true);
}
```

When this is enabled, users will be prompted to set up multi-factor authentication after they sign in, if they have not already done so.

## Security notes about multi-factor authentication

In Filament, the multi-factor authentication process occurs before the user is actually authenticated into the app. This allows you to be sure that no users can authenticate and access the app without passing the multi-factor authentication step. You do not need to remember to add middleware to any of your authenticated routes to ensure that users completed the multi-factor authentication step.

However, if you have other parts of your Laravel app that authenticate users, please bear in mind that they will not be challenged for multi-factor authentication if they are already authenticated elsewhere and then visit the panel, unless [multi-factor authentication is required](#requiring-multi-factor-authentication) and they have not set it up yet.

