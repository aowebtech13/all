<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DevicesController extends Controller
{
    /**
     * Return all Sanctum personal access tokens for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $tokens = $user
            ->tokens()
            ->get()
            ->map(function ($token) {
                return [
                    'id' => $token->id,
                    'name' => $token->name,
                    'last_used_at' => $token->last_used_at,
                    'created_at' => $token->created_at,
                    'expires_at' => $token->expires_at,
                    // The raw token string is never returned.
                ];
            });

        return response()->json([
            'devices' => $tokens,
        ]);
    }

    /**
     * Revoke one device/token.
     */
    public function logoutDevice(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'token_id' => ['required', 'integer'],
        ]);

        $token = $user->tokens()->where('id', $data['token_id'])->first();
        if (!$token) {
            return response()->json(['message' => 'Device not found'], 404);
        }

        $token->delete();

        return response()->json(['message' => 'Logged out on this device successfully']);
    }

    /**
     * Revoke all user tokens.
     */
    public function logoutAll(Request $request)
    {
        $user = Auth::user();

        $user->tokens()->delete();

        return response()->json(['message' => 'Logged out on all devices successfully']);
    }
}

