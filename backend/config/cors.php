<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    */

    // Use pure wildcards for routes—Laravel matches paths using string patterns, not regex
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'withdraw', 'deposit', 'invest/*', 'loans', 'recipients', 'user', 'my-cards', 'devices', 'transactions', 'investments', 'withdrawals', 'deposits', 'profile', 'payment-requests', 'forgot-password', 'verify-otp', 'reset-password', 'auth/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),

        // Local development variants
        'http://localhost:3000',
        'http://127.0.0.1:3000',

        // Production endpoints
        'https://livinus-backend-api.lexicron.org',
        'https://lexicron.org',
        'https://www.lexicron.org',
    ],

    // Allowed origins patterns DO accept regex
    'allowed_origins_patterns' => [
        '#^https?://.*\.lexicron\.org$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Set to false for pure Bearer Token architectures to prevent preflight credential blocks
    'supports_credentials' => false,

];