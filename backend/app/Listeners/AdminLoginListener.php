<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;

class AdminLoginListener
{
    public function handle(Login $event): void
    {
        // Email/SMTP delivery on admin login intentionally disabled.
        // Admin login continues to work normally; this listener now performs no action.
        return;
    }
}

