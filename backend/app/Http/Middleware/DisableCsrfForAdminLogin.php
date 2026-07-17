<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DisableCsrfForAdminLogin
{
    public function handle(Request $request, Closure $next)
    {
        // Only disable CSRF for the specific admin login POST.
        if ($request->isMethod('post') && $request->is('geyfdv/login')) {
            $request->attributes->set('csrf_exempt', true);
        }

        return $next($request);
    }
}

