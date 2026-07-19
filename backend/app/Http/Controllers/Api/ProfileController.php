<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user()->load('investments.group');
        return response()->json([
            'user' => $user
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['name', 'phone']);

        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $path;
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    public function updateWithdrawalDetails(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'bank_name' => 'required|string|max:255',
            'bank_account_holder' => 'required|string|max:255',
            'bank_account_number' => 'required|string|max:50',
            'bank_routing_number' => 'nullable|string|max:20',
            'account_type' => 'required|string|in:checking,savings',
        ]);

        $user->update($request->only([
            'bank_name',
            'bank_account_holder',
            'bank_account_number',
            'bank_routing_number',
            'account_type',
        ]));

        return response()->json([
            'message' => 'Withdrawal details updated successfully',
            'user' => $user
        ]);
    }

}
