<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Stateless / non-browser endpoints (Bearer token / Sanctum) — no session/CSRF needed.
        // NOTE: Admin login is a stateful Blade form and should NOT be excluded from CSRF.
        'login',
        'register',
        'logout',
        'forgot-password',
        'reset-password',
        'forgot-password-otp',
        'verify-otp',
        'reset-password-with-otp',
        'invest/level-1',
        'invest/level-2',
        'invest/level-3',
        'invest/withdraw',
        'withdraw',
        'deposit',
        'deposit/paystack/verify',
        'deposit/paystack/webhook',
        'loans',
        'recipients',
        'profile',
        'profile/password',
        'profile/withdrawal-details',
        'my-cards',
        'devices/logout',
        'devices/logout-all',
        'transactions',
        'investments',
        'investments/*/cancel',
        'withdrawals',
        'deposits',
        'payment-requests',
        'auth/login',
        'auth/register',
        'auth/forgot-password',
        'auth/reset-password',
        'auth/forgot-password-otp',
        'auth/verify-otp',
        'auth/reset-password-with-otp',
        'auth/logout',
    ];
}
