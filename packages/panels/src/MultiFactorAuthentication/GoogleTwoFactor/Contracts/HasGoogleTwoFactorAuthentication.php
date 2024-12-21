<?php

namespace Filament\MultiFactorAuthentication\GoogleTwoFactor\Contracts;

interface HasGoogleTwoFactorAuthentication
{
    public function hasGoogleTwoFactorAuthentication(): bool;

    public function getGoogleTwoFactorAuthenticationSecret(): string;

    public function saveGoogleTwoFactorAuthenticationSecret(?string $secret): void;

    public function getGoogleTwoFactorAuthenticationHolderName(): string;
}
