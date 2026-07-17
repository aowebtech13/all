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

        // Admin
        User::updateOrCreate(
            ['email' => 'admin@support-leacent-enterpise.lexicron.org'],
            [
                'name' => 'Admin User',
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
                'email_verified_at' => now(),
                'balance' => 0.00,
                'total_profit' => 0.00,
                'total_invested' => 0.00,
                'lxp_id' => 'LXP7476',
            ]
        );

        // Base user
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make($userPassword),
                'role' => 'user',
                'email_verified_at' => now(),
                'balance' => 0.00,
                'total_profit' => 0.00,
                'total_invested' => 0.00,
                'lxp_id' => 'LXP9618',
            ]
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

