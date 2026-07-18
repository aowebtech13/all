<?php

return [

    'paths' => ['#^api/.*$#', '#^.*$#'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
        // Local dev
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8000',

        // Production
        'https://livinus-backend-api.lexicron.org',
        'https://lexicron.org',    
        'http://lexicron.org',
        'http://www.lexicron.org',
    ],

    'allowed_origins_patterns' => [
        // Match HTTP or HTTPS for any subdomain under lexicron.org safely
        '#^https?://.*\.lexicron\.org$#',
    ],

    'allowed_headers' => [
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'X-XSRF-TOKEN',
        'X-CSRF-TOKEN',
        'Accept',
        'Origin',
    ],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];