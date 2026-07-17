<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasVerifiedDeposit
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $path = $request->path();

        // Allow deposit-related endpoints to complete the funding flow
        // Allow key endpoints in the funding/onboarding flow.
        // IMPORTANT: $request->path() can differ depending on mount/prefixing.
        // We support both raw and /api-prefixed paths.
        $allowedUntilFunded = [
            'deposits',
            'deposit',
            'deposit/paystack/verify',
            'deposit/paystack/webhook',
            'api/deposits',
            'api/deposit',
            'api/deposit/paystack/verify',
            'api/deposit/paystack/webhook',

            // Allow onboarding/on-verify UI to read dashboard context
            // so users can see pending verification-related transactions.
            'dashboard-data',

            'forgot-password',
            'auth/verify-otp',
            'verify-otp',
            'profile',
            'devices',
            'devices/logout',
            'devices/logout-all',
            'api/forgot-password',
            'api/auth/verify-otp',
            'api/verify-otp',
            'api/profile',
            'api/devices',
            'api/devices/logout',
            'api/devices/logout-all',
        ];

        $isAllowed = in_array($path, $allowedUntilFunded, true)
            // deposit endpoints
            || str_starts_with($path, 'deposit/')
            || str_starts_with($path, 'api/deposit/')
            // otp endpoints
            || str_starts_with($path, 'auth/verify-otp')
            || str_starts_with($path, 'api/auth/verify-otp')
            || str_starts_with($path, 'verify-otp')
            || str_starts_with($path, 'api/verify-otp')
            // payment requests
            || str_starts_with($path, 'payment-requests')
            || str_starts_with($path, 'api/payment-requests');


        if ($isAllowed) {
            return $next($request);
        }


        if (! $request->user()->hasConfirmedVerificationDeposit()) {
            return response()->json([
                'message' => 'Verification deposit required. Please deposit $500 to continue.',
                'required_amount' => 5000,
            ], 402);
        }

        return $next($request);
    }
}

