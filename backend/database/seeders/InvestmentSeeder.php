<?php

namespace Database\Seeders;

use App\Models\Investment;
use App\Models\InvestmentGroup;
use App\Models\InvestmentPlan;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InvestmentSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $users = User::query()->where('role', 'user')->get();
        $plans = InvestmentPlan::query()->get();
        $groups = InvestmentGroup::query()->get();

        if ($users->isEmpty() || $plans->isEmpty() || $groups->isEmpty()) {
            // Nothing to seed yet.
            return;
        }

        // Create deterministic investments for up to 3 demo users.
        $targetUsers = $users->take(3)->values();

        DB::transaction(function () use ($targetUsers, $plans, $groups) {
            // Clean previous investment rows to avoid duplicates.
            Investment::query()->delete();

            // Prefer open groups for active investments.
            $openGroups = $groups->where('status', 'open')->values();
            $maturingGroups = $groups->where('status', 'maturing')->values();
            $maturedGroups = $groups->where('status', 'matured')->values();

            foreach ($targetUsers as $idx => $user) {
                // Active investment
                $plan = $plans->values()[$idx % $plans->count()];
                $group = $openGroups->count() ? $openGroups[$idx % $openGroups->count()] : $groups[0];

                // Ensure group-plan compatibility; if mismatch, fall back to first matching group.
                if ((int) $group->investment_plan_id !== (int) $plan->id) {
                    $matching = $groups->where('investment_plan_id', $plan->id)->values();
                    if ($matching->count()) {
                        $group = $matching[0];
                    }
                }

                $amount = min(max($plan->min_amount + ($idx * 10), $plan->min_amount), $plan->max_amount);

                $start = now()->subDays(2 + $idx); // started recently
                $end = now()->subDays(2 + $idx)->addDays($plan->duration_days);

                $investment = Investment::create([
                    'user_id' => $user->id,
                    'investment_plan_id' => $plan->id,
                    'investment_group_id' => $group->id,
                    'amount' => $amount,
                    'profit' => 0,
                    'start_date' => $start,
                    'end_date' => $end,
                    'last_profit_at' => null,
                    'status' => 'active',
                ]);

                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'investment',
                    'amount' => -$amount,
                    'status' => 'completed',
                    'description' => "Seed investment in {$plan->name}" . " (Batch: {$group->name})",
                ]);
            }

            // Add one matured investment for the first user if possible.
            if ($maturedGroups->count() && $plans->count()) {
                $firstUser = $targetUsers[0];
                $maturedGroup = $maturedGroups[0];
                $plan = $plans->firstWhere('id', $maturedGroup->investment_plan_id) ?? $plans[0];

                $amount = $plan->min_amount;

                $start = now()->subDays($plan->duration_days + 5);
                $end = now()->subDays(5);

                $investment = Investment::create([
                    'user_id' => $firstUser->id,
                    'investment_plan_id' => $plan->id,
                    'investment_group_id' => $maturedGroup->id,
                    'amount' => $amount,
                    'profit' => 0,
                    'start_date' => $start,
                    'end_date' => $end,
                    'last_profit_at' => now()->subDay(),
                    'status' => 'completed',
                ]);

                Transaction::create([
                    'user_id' => $firstUser->id,
                    'type' => 'investment',
                    'amount' => -$amount,
                    'status' => 'completed',
                    'description' => "Seed matured investment in {$plan->name}" . " (Batch: {$maturedGroup->name})",
                ]);
            }
        });
    }
}

