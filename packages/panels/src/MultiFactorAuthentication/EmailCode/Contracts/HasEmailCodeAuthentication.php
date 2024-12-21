<?php

namespace Filament\MultiFactorAuthentication\EmailCode\Contracts;

interface HasEmailCodeAuthentication
{
    public function hasEmailCodeAuthentication(): bool;

    public function getEmailCodeAuthenticationSecret(): string;

    public function saveEmailCodeAuthenticationSecret(?string $secret): void;
}
