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
        $allowedOriginPatterns = config('cors.allowed_origins_patterns', []);

        $originAllowed = false;
        $normalizedOrigin = $origin ? trim($origin) : null;

        if ($normalizedOrigin) {
            if (in_array($normalizedOrigin, array_map('trim', $allowedOrigins), true)) {
                $originAllowed = true;
            } else {
                foreach ($allowedOriginPatterns as $pattern) {
                    $regex = str_starts_with($pattern, '#')
                        ? $pattern
                        : '#^' . str_replace('\*', '.*', preg_quote($pattern, '#')) . '$#';

                    if (preg_match($regex, $normalizedOrigin)) {
                        $originAllowed = true;
                        break;
                    }
                }
            }
        }

        // Always set CORS headers for preflight/OPTIONS when the origin is allowed.
        if ($normalizedOrigin && $originAllowed) {
            $response->headers->set('Access-Control-Allow-Origin', $normalizedOrigin);
            $response->headers->set('Vary', 'Origin');
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

        // IMPORTANT: With credentials, never use wildcard '*' for Access-Control-Allow-Headers.
        $requestHeaders = $request->headers->get('Access-Control-Request-Headers');
        if ($requestHeaders) {
            $response->headers->set('Access-Control-Allow-Headers', $requestHeaders);
        } else {
            $allowedHeaders = config('cors.allowed_headers', []);
            $allowedHeaders = array_map('trim', $allowedHeaders);
            $fallback = !empty($allowedHeaders) && !in_array('*', $allowedHeaders, true)
                ? implode(', ', $allowedHeaders)
                : 'Authorization, Content-Type, X-Requested-With, X-XSRF-TOKEN, X-CSRF-TOKEN, Accept, Origin';
            $response->headers->set('Access-Control-Allow-Headers', $fallback);
        }

        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '86400');

        if ($request->isMethod('OPTIONS')) {
            $response->setStatusCode(204);
            return $response;
        }

        return $response;
    }
}

