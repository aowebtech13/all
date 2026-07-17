<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestmentGroup extends Model
{
    protected $fillable = [
        'name',
        'investment_plan_id',
        'total_profit',
        'status',
        'maturity_date',
    ];

    protected $casts = [
        'investment_plan_id' => 'integer',
        'maturity_date' => 'datetime',
        'total_profit' => 'float',
    ];

    public function plan()
    {
        return $this->belongsTo(InvestmentPlan::class, 'investment_plan_id');
    }

    public function investments()
    {
        return $this->hasMany(Investment::class);
    }

    public function users()
    {
        return $this->hasManyThrough(User::class, Investment::class, 'investment_group_id', 'id', 'id', 'user_id');
    }

    /**
     * Distribute profit to grouped users at maturity.
     * Logic:
     * 1. Only 'active' investments get a share.
     * 2. Cancelled/Left investments get ZERO share.
     * 3. 30% of declared profit goes to the company.
     * 4. 70% of declared profit is shared EQUALLY among the remaining active investors.
     */
    public function distributeProfit($declaredTotalProfit)
    {
        if ($this->status === 'matured') {
            throw new \Exception("Profit has already been distributed for this group.");
        }

        // Filter only active investments (those who stayed until the end)
        $activeInvestments = $this->investments()->where('status', 'active')->get();
        $investorCount = $activeInvestments->count();

        if ($investorCount === 0) {
            throw new \Exception("No active investors remaining in this group to share profit.");
        }

        // Calculate Splits
        $companyShare = $declaredTotalProfit * 0.30;
        $usersTotalShare = $declaredTotalProfit * 0.70;
        
        // Equal sharing among remaining active members
        $profitPerInvestor = $usersTotalShare / $investorCount;

        return \Illuminate\Support\Facades\DB::transaction(function () use ($activeInvestments, $profitPerInvestor, $declaredTotalProfit, $companyShare, $usersTotalShare) {
            foreach ($activeInvestments as $investment) {
                $user = $investment->user;
                
                // Final calculation: Principal + Equal Profit Share
                $totalReturn = $investment->amount + $profitPerInvestor;
                
                $user->increment('balance', $totalReturn);
                $user->increment('total_profit', $profitPerInvestor);

                $investment->update([
                    'profit' => $profitPerInvestor, // Final profit awarded
                    'status' => 'completed',
                    'last_profit_at' => now(),
                ]);

                // Record transactions for audit
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'profit',
                    'amount' => $profitPerInvestor,
                    'status' => 'completed',
                    'description' => "Profit share from matured Batch: {$this->name} (Shared equally among {$activeInvestments->count()} investors)",
                ]);

                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'principal_return',
                    'amount' => $investment->amount,
                    'status' => 'completed',
                    'description' => "Principal return from matured Batch: {$this->name}",
                ]);
            }

            // Update group status to matured
            $this->update([
                'total_profit' => $declaredTotalProfit,
                'status' => 'matured',
                'maturity_date' => now(),
            ]);

            return [
                'company_share' => $companyShare,
                'users_total_share' => $usersTotalShare,
                'profit_per_investor' => $profitPerInvestor,
                'investors_count' => $investorCount
            ];
        });
    }
}
