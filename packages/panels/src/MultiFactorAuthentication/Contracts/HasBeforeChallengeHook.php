<?php

namespace Filament\MultiFactorAuthentication\Contracts;

use Illuminate\Contracts\Auth\Authenticatable;

interface HasBeforeChallengeHook
{
    public function beforeChallenge(Authenticatable $user): void;
}
