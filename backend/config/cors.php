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
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

'paths' => ['api/*', '*'],

    'allowed_methods' => ['*'],


'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
        // Local dev
        'http://localhost:3000',
        'http://127.0.0.1:3000',

        // Production (add all frontend origins that call the API)
        'https://enterprise.Ally-b.org',
        'https://support-Ally-b-enterpise.lexicron.org',
        'https://account.ally-b.com',

        // Existing known domains
        'https://lexicron.org',
        'https://www.lexicron.org',
        'https://www.partners.Ally-b.com',
        'http://lexicron.org',
        'http://www.lexicron.org',
    ],

    'allowed_origins_patterns' => [
        '*.lexicron.org',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
