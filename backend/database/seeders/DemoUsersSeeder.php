<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUsersSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // IMPORTANT: keep credentials consistent with your demo/testing docs.
        // If you change these passwords, update any frontend/help text accordingly.

        $adminPassword = 'AS$%&*)ADNJ@kzaL=DDW';
        $userPassword = 'TestPassword123!';

        // Helper: insert/update demo users WITHOUT violating `users.lxp_id` unique constraint.
        // Strategy (per request):
        // - If `email` exists -> update that record (and optionally set lxp_id if free).
        // - Else if `lxp_id` is already taken by some other user -> SKIP creating/updating.
        // - Else -> create the user with the desired lxp_id.
        $upsertDemoUser = function (array $u, string $plainPassword, string $defaultRole) {
            $email = $u['email'];
            $desiredLxpId = $u['lxp_id'] ?? null;

            $existingByEmail = User::where('email', $email)->first();
            if ($existingByEmail) {
                $attributes = [
                    'name' => $u['name'] ?? $existingByEmail->name,
                    'password' => Hash::make($plainPassword),
                    'role' => $u['role'] ?? $defaultRole,
                    'email_verified_at' => now(),
                    'balance' => $u['balance'] ?? $existingByEmail->balance,
                    'total_profit' => $u['total_profit'] ?? $existingByEmail->total_profit,
                    'total_invested' => $u['total_invested'] ?? $existingByEmail->total_invested,
                ];

                if ($desiredLxpId) {
                    // Only set/overwrite lxp_id if it's free OR it's the same record.
                    $otherWithSameLxp = User::where('lxp_id', $desiredLxpId)
                        ->where('id', '!=', $existingByEmail->id)
                        ->exists();

                    if (!$otherWithSameLxp) {
                        $attributes['lxp_id'] = $desiredLxpId;
                    }
                }

                $existingByEmail->update($attributes);
                return;
            }

            if ($desiredLxpId) {
                // lxp_id is unique: if it is already taken by another email, skip.
                $alreadyTaken = User::where('lxp_id', $desiredLxpId)->exists();
                if ($alreadyTaken) {
                    return; // SKIP creating to avoid UNIQUE constraint failure
                }
            }

            User::create([
                'name' => $u['name'],
                'email' => $u['email'],
                'password' => Hash::make($plainPassword),
                'role' => $u['role'] ?? $defaultRole,
                'email_verified_at' => now(),
                'balance' => $u['balance'] ?? 0.00,
                'total_profit' => $u['total_profit'] ?? 0.00,
                'total_invested' => $u['total_invested'] ?? 0.00,
                'lxp_id' => $desiredLxpId,
            ]);
        };

        // Admin
        $upsertDemoUser(
            [
                'name' => 'Admin User',
                'email' => 'admin@support-Ally-b-enterpise.lexicron.org',
                'lxp_id' => 'LXP7476',
                'balance' => 0.00,
                'total_profit' => 0.00,
                'total_invested' => 0.00,
                'role' => 'admin',
            ],
            $adminPassword,
            'admin'
        );

        // Base user
        $upsertDemoUser(
            [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'lxp_id' => 'LXP9618',
                'balance' => 0.00,
                'total_profit' => 0.00,
                'total_invested' => 0.00,
                'role' => 'user',
            ],
            $userPassword,
            'user'
        );


        // Extra demo users for UI testing (investments/withdrawals/recent activity etc.)
        // These keep relations optional; the user dashboard pages should still render.
        $demoUsers = [
            [
                'name' => 'Demo User One',
                'email' => 'demo1@example.com',
                'lxp_id' => 'LXP2001',
                'balance' => 250.00,
                'total_profit' => 40.00,
                'total_invested' => 250.00,
            ],
            [
                'name' => 'Demo User Two',
                'email' => 'demo2@example.com',
                'lxp_id' => 'LXP2002',
                'balance' => 80.00,
                'total_profit' => 15.00,
                'total_invested' => 200.00,
            ],
            [
                'name' => 'Demo User Three',
                'email' => 'demo3@example.com',
                'lxp_id' => 'LXP2003',
                'balance' => 10.00,
                'total_profit' => 2.00,
                'total_invested' => 100.00,
            ],
        ];

        foreach ($demoUsers as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make($userPassword),
                    'role' => 'user',
                    'email_verified_at' => now(),
                    'balance' => $u['balance'],
                    'total_profit' => $u['total_profit'],
                    'total_invested' => $u['total_invested'],
                    'lxp_id' => $u['lxp_id'],
                ]
            );
        }
    }
}

