<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WithdrawalSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $users = User::query()->where('role', 'user')->get();
        if ($users->isEmpty()) {
            return;
        }

        DB::transaction(function () use ($users) {
            Withdrawal::query()->delete();

            $target = $users->take(3)->values();

            foreach ($target as $idx => $user) {
                $method = $idx % 2 === 0 ? 'Bank Transfer' : 'USDT Wallet';
                $amount = [50, 100, 150][$idx] ?? 75;

                $withdrawal = Withdrawal::create([
                    'user_id' => $user->id,
                    'amount' => $amount,
                    'method' => $method,
                    'status' => $idx === 0 ? 'pending' : ($idx === 1 ? 'approved' : 'rejected'),
                    'details' => $method === 'Bank Transfer' ? 'DEMO - Routing: 000000, Account: 123456789' : 'DEMO - TRC20 USDT wallet',
                    'rejection_reason' => $idx === 2 ? 'Demo rejection: insufficient verification' : null,
                    'created_at' => now()->subDays(10 - $idx),
                    'updated_at' => now()->subDays(10 - $idx),
                ]);

                // Create a corresponding transaction audit row.
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'withdrawal_request',
                    'amount' => -$amount,
                    'status' => $withdrawal->status === 'pending' ? 'pending' : 'completed',
                    'method' => $method,
                    'description' => "Seed withdrawal request (#{$withdrawal->id})",
                ]);

                if ($withdrawal->status === 'approved') {
                    // For approved withdrawals, credit back to balance in demo.
                    $user->increment('balance', $amount);
                }
            }
        });
    }
}

