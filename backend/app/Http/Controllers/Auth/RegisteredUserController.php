<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\VerificationMail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;

use Illuminate\Validation\ValidationException;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
                'phone' => ['required', 'string', 'max:20'],
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'age' => ['required', 'integer', 'min:18', 'max:99'],

                // Registration form completeness enforcement.
                // If coop_category is not provided, we MUST NOT trigger email verification.
                'coop_category' => ['required', 'string', 'max:255'],


                'source' => ['nullable', 'string', 'max:255'],
            ]);

            // IMPORTANT: Only trigger email verification when the full registration form is complete.
            // Backend validation guarantees coop_category exists and is valid at this point.
            $rawPhone = $request->phone;


            $rawPhone = is_string($rawPhone) ? trim($rawPhone) : '';


            // Add +234 prefix if the number is provided without country code.
            if (!str_starts_with($rawPhone, '+234')) {
                $digitsOnly = preg_replace('/\D+/', '', $rawPhone);
                if (str_starts_with($digitsOnly, '0')) {
                    $digitsOnly = substr($digitsOnly, 1);
                }
                $rawPhone = '+234' . $digitsOnly;
            }



            $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $rawPhone,

                'password' => Hash::make($request->password),
                'age' => $request->age,
                'role' => 'user', // Default role
                'source' => $request->source ?? 'main',
                'balance' => 1.00, // Welcome bonus
                'email_verification_code' => $verificationCode,
                'email_verification_expires_at' => now()->addMinutes(10),
            ]);

            // Send verification email immediately ONLY if registration is complete.
            // Since coop_category is required by validation above, this is now safe.
            try {
                Mail::to($user->email)->send(new VerificationMail($verificationCode));
            } catch (\Exception $e) {
                \Log::error('Mail Sending Error: ' . $e->getMessage());
                // Continue registration even if mail fails
            }


            event(new Registered($user));

            // Create a welcome bonus transaction
            \App\Models\Transaction::create([
                'user_id' => $user->id,
                'type' => 'deposit',
                'amount' => 1.00,
                'status' => 'completed',
                'description' => 'Welcome Bonus',
                'method' => 'System'
            ]);

            if ($request->hasSession()) {
                Auth::login($user);
            }

            // Do NOT issue an access token until the user verifies their email.
            // This avoids cases where the frontend thinks the user is authenticated
            // but /api/user is blocked by ensure.email.verified.

            return response()->json([
                'user' => $user,
                'requires_email_verification' => true,
            ]);
        } catch (ValidationException $e) {
            \Log::warning('Registration Validation Failed: ', $e->errors());
            return response()->json([
                'message' => 'Registration failed: ' . $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Registration Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Registration failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
