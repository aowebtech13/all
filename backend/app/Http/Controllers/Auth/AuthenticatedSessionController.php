<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Validation\ValidationException;


class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $request->authenticate();

            $user = Auth::user();

            // Defensive: authenticate() could technically succeed without a user
            if (!$user) {
                return response()->json([
                    'message' => 'Login failed: user not found after authentication.',
                ], 401);
            }

            // Issue token (if model supports Sanctum)
            $token = null;
            if (method_exists($user, 'createToken')) {
                $token = $user->createToken('auth_token')->plainTextToken;
            }

            return response()->json([
                'token' => $token,
                'user' => $user,
                'requires_email_verification' => true,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Login failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            \Log::error('API Login Error', [
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Login failed due to a server error.',
                // Show the raw message only when debugging locally
                'debug' => (
                    (function () {
                        try {
                            return app()->environment('local') ? true : false;
                        } catch (\Throwable $ignored) {
                            return false;
                        }
                    })()
                        ? [
                            'error' => $e->getMessage(),
                            'exception' => get_class($e),
                            'file' => $e->getFile(),
                            'line' => $e->getLine(),
                        ]
                        : null
                ),



            ], 500);
        }
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): \Illuminate\Http\JsonResponse
    {
        // Revoke the current bearer token
        $user = $request->user();
        if ($user) {
            $token = $user->currentAccessToken();
            if ($token) {
                $token->delete();
            }
        }


        return response()->json(['message' => 'Logged out successfully']);
    }
}
