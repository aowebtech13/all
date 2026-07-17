<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\InvestmentPlan;
use App\Models\Investment;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InvestmentController extends Controller
{
    public function getPlans()
    {
        return response()->json(InvestmentPlan::where('is_active', true)->get());
    }

    public function getAvailableGroups()
    {
        $groups = \App\Models\InvestmentGroup::with('plan')
            ->where('status', 'open')
            ->where('created_at', '>=', now()->subDays(5))
            ->withCount('investments')
            ->get()
            ->filter(function($group) {
                return $group->investments_count < 20;
            })->values();

        return response()->json($groups);
    }

    public function invest(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:investment_plans,id',
            'amount' => 'required|numeric|min:0',
            'group_id' => 'required|exists:investment_groups,id',
        ]);

        $user = Auth::user();
        $plan = InvestmentPlan::findOrFail($request->plan_id);

        $group = \App\Models\InvestmentGroup::withCount('investments')->findOrFail($request->group_id);
        
        if ((int)$group->investment_plan_id !== (int)$plan->id) {
            return response()->json(['message' => 'The selected group does not match the investment plan.'], 422);
        }

        if ($group->status !== 'open') {
            return response()->json(['message' => 'The selected group is no longer open for investments.'], 422);
        }

        if ($group->created_at->lt(now()->subDays(5))) {
            return response()->json(['message' => 'This batch is older than 5 days and is no longer accepting new members.'], 422);
        }

        if ($group->investments_count >= 20) {
            return response()->json(['message' => 'The selected group has reached its maximum capacity.'], 422);
        }

        if ($request->amount < $plan->min_amount || $request->amount > $plan->max_amount) {
            return response()->json(['message' => "Amount must be between {$plan->min_amount} and {$plan->max_amount}"], 422);
        }

        if ($user->balance < $request->amount) {
            return response()->json(['message' => 'Insufficient balance'], 422);
        }

        return DB::transaction(function () use ($user, $plan, $request) {
            // Deduct from balance
            $user->decrement('balance', $request->amount);
            $user->increment('total_invested', $request->amount);

            // Create investment
            $investment = Investment::create([
                'user_id' => $user->id,
                'investment_plan_id' => $plan->id,
                'investment_group_id' => $request->group_id,
                'amount' => $request->amount,
                'start_date' => now(),
                'end_date' => now()->addDays($plan->duration_days),
                'status' => 'active',
            ]);

            // Create transaction
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'investment',
                'amount' => -$request->amount,
                'status' => 'completed',
                'description' => "Invested in {$plan->name}" . ($request->group_id ? " (Batch: " . \App\Models\InvestmentGroup::find($request->group_id)->name . ")" : ""),
            ]);

            return response()->json([
                'message' => 'Investment successful',
                'investment' => $investment->load('plan'),
                'user' => $user->fresh(),
            ]);
        });
    }

    public function getDashboardData()
    {
        $user = Auth::user();

        return response()->json([
            'stats' => [
                'balance' => $user->balance,
                'total_profit' => $user->total_profit,
                'total_invested' => $user->total_invested,
                'active_investments_count' => $user->investments()->where('status', 'active')->count(),
            ],
            'recent_transactions' => $user->transactions()->latest()->limit(10)->get(),
            'active_investments' => $user->investments()->where('status', 'active')->with('plan')->get(),
        ]);
    }

    public function getTransactions()
    {
        $user = Auth::user();
        return response()->json($user->transactions()->latest()->paginate(20));
    }

    public function getInvestments()
    {
        $user = Auth::user();
        return response()->json($user->investments()->with('plan')->latest()->get());
    }

    public function cancelInvestment(Request $request, $id)
    {
        $user = Auth::user();
        $investment = Investment::where('user_id', $user->id)->findOrFail($id);

        if ($investment->status !== 'active') {
            return response()->json(['message' => 'Only active investments can be cancelled.'], 422);
        }

        return DB::transaction(function () use ($investment, $user) {
            $investment->status = 'cancelled';
            $investment->profit = 0; // Explicitly zero out any accrued visualization profit
            $investment->save();

            // Return 90% of principal to user balance
            $refundAmount = $investment->amount * 0.9;
            $penaltyAmount = $investment->amount * 0.1;
            
            $user->increment('balance', $refundAmount);

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'cancellation_refund',
                'amount' => $refundAmount,
                'status' => 'completed',
                'description' => "User cancelled investment #{$investment->id} (10% penalty applied: -\${$penaltyAmount})",
            ]);

            return response()->json([
                'message' => "Investment cancelled successfully. 90% Refunded: \${$refundAmount}",
                'user' => $user->fresh()
            ]);
        });
    }
}
