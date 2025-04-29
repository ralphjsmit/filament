<?php

namespace Filament\Auth\MultiFactor\Email\Contracts;

interface HasEmailAuthentication
{
    public function hasEmailAuthentication(): bool;

    public function getEmailAuthenticationSecret(): ?string;

    public function saveEmailAuthenticationSecret(?string $secret): void;
}
