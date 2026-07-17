<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * API Health endpoint.
 *
 * Keep it lightweight: do not touch DB/Cache, because your project currently
 * throws when SQLite file is missing.
 *
 * URL:
 *   GET /api/health
 */

Route::middleware(['throttle:api'])->get('/health', function (Request $request) {
    return response()->json([
        'status' => 'ok',
        'checks' => [
            'app_env' => config('app.env'),
            'app_debug' => (bool) config('app.debug'),
            'time' => now()->toIso8601String(),
        ],
    ]);
});

