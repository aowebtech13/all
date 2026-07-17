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

        // Determine whether the incoming Origin is permitted.
        $originAllowed = false;
        if ($origin) {
            if (in_array($origin, $allowedOrigins, true)) {
                $originAllowed = true;
            } else {
                // Support wildcard host patterns (e.g. '*.lexicron.org' or '#^https://.*\.lexicron\.org$#').
                foreach ($allowedOriginPatterns as $pattern) {
                    $regex = str_starts_with($pattern, '#')
                        ? $pattern
                        : '#^' . str_replace('\*', '.*', preg_quote($pattern, '#')) . '$#';
                    if (preg_match($regex, $origin)) {
                        $originAllowed = true;
                        break;
                    }
                }
            }
        }

        // If there is no Origin header, treat as non-browser request.
        if ($origin && $originAllowed) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

        // IMPORTANT: When credentials are allowed (Access-Control-Allow-Credentials: true),
        // the CORS spec forbids a wildcard '*' for Access-Control-Allow-Headers. Echo back the
        // requested headers when present; otherwise fall back to the configured allowed headers
        // (never '*'), otherwise the browser rejects the response.
        $requestHeaders = $request->headers->get('Access-Control-Request-Headers');
        if ($requestHeaders) {
            $response->headers->set('Access-Control-Allow-Headers', $requestHeaders);
        } else {
            $allowedHeaders = config('cors.allowed_headers', []);
            $fallback = !empty($allowedHeaders) && !in_array('*', $allowedHeaders, true)
                ? implode(', ', $allowedHeaders)
                : 'Authorization, Content-Type, X-Requested-With, X-XSRF-TOKEN, X-CSRF-TOKEN, Accept, Origin';
            $response->headers->set('Access-Control-Allow-Headers', $fallback);
        }

        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '86400');

        // Preflight must return immediately with correct headers.
        if ($request->isMethod('OPTIONS')) {
            $response->setStatusCode(204);
            return $response;
        }


        return $response;
    }
}

