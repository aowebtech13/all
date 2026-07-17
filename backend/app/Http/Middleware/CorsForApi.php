<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsForApi
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        $origin = $request->headers->get('Origin');
        $allowedOrigins = config('cors.allowed_origins', []);

        // If there is no Origin header, treat as non-browser request.
        if ($origin && in_array($origin, $allowedOrigins, true)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', $request->headers->get('Access-Control-Request-Headers', '*'));
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '86400');

        // If this is a preflight request, return early.
        if ($request->isMethod('OPTIONS')) {
            $response->setStatusCode(204);
        }

        return $response;
    }
}

