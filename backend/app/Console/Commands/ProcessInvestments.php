<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\Investment;
use App\Models\InvestmentGroup;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ProcessInvestments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'investments:process';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process investment profits and maturity daily';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting investment processing...');

        // 1. Process Daily Profits (for visualization in dashboard)
        $this->processDailyProfits();

        // 2. Process Matured Groups (Batches)
        $this->processMaturedGroups();

        // 3. Process Matured Individual Investments (those not in a group)
        $this->processMaturedIndividualInvestments();

        $this->info('Investment processing completed.');
    }

    private function processDailyProfits()
    {
        // Get active investments that haven't had profit added in the last 23 hours
        $activeInvestments = Investment::where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('last_profit_at')
                    ->orWhere('last_profit_at', '<=', Carbon::now()->subHours(23));
            })
            ->with('plan')
            ->get();

        foreach ($activeInvestments as $investment) {
            if (!$investment->plan) continue;

            DB::transaction(function () use ($investment) {
                // Calculate daily profit based on interest rate
                // If interest_rate is 1.5%, we add 1.5% of principal daily
                $dailyProfit = $investment->amount * ($investment->plan->interest_rate / 100);

                $investment->increment('profit', $dailyProfit);
                $investment->update(['last_profit_at' => now()]);

                Log::info("Daily profit added for investment #{$investment->id}: +${$dailyProfit}");
            });
        }
    }

    private function processMaturedGroups()
    {
        // A group is matured if its associated plan duration has passed since the group was created
        // Or if all its investments have reached their end_date
        $openGroups = InvestmentGroup::where('status', 'open')
            ->with(['plan', 'investments'])
            ->get();

        foreach ($openGroups as $group) {
            // Check if any investment in the group has reached maturity
            // Usually, all investments in a group have similar end dates
            $maturedInvestment = $group->investments()
                ->where('status', 'active')
                ->where('end_date', '<=', now())
                ->first();

            if ($maturedInvestment) {
                $this->info("Maturing Group: {$group->name}");
                
                // Calculate total profit for the group
                // Total profit for group should be such that users get their interest_rate share (70%)
                // Total User Profit = Sum of (Principal * Rate% * Duration)
                $totalUserProfit = 0;
                foreach ($group->investments as $inv) {
                    $totalUserProfit += $inv->amount * ($group->plan->interest_rate / 100) * $group->plan->duration_days;
                }

                // Total Declared Profit (100%) = User Share (70%) / 0.7
                $totalDeclaredProfit = $totalUserProfit / 0.7;

                try {
                    $group->distributeProfit($totalDeclaredProfit);
                    Log::info("Group #{$group->id} matured automatically via cron.");
                } catch (\Exception $e) {
                    Log::error("Failed to mature group #{$group->id}: " . $e->getMessage());
                }
            }
        }
    }

    private function processMaturedIndividualInvestments()
    {
        $maturedInvestments = Investment::where('status', 'active')
            ->whereNull('investment_group_id')
            ->where('end_date', '<=', now())
            ->with(['user', 'plan'])
            ->get();

        foreach ($maturedInvestments as $investment) {
            DB::transaction(function () use ($investment) {
                $user = $investment->user;
                
                // Final profit calculation if it wasn't fully accrued
                $totalExpectedProfit = $investment->amount * ($investment->plan->interest_rate / 100) * $investment->plan->duration_days;
                
                $user->increment('balance', $investment->amount + $totalExpectedProfit);
                $user->increment('total_profit', $totalExpectedProfit);

                $investment->update([
                    'status' => 'completed',
                    'profit' => $totalExpectedProfit
                ]);

                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'principal_return',
                    'amount' => $investment->amount,
                    'status' => 'completed',
                    'description' => "Investment #{$investment->id} matured. Principal returned.",
                ]);

                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'profit',
                    'amount' => $totalExpectedProfit,
                    'status' => 'completed',
                    'description' => "Investment #{$investment->id} matured. Total profit added.",
                ]);

                Log::info("Individual Investment #{$investment->id} matured automatically.");
            });
        }
    }
}
