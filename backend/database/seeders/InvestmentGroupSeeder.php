<?php

namespace Database\Seeders;

use App\Models\InvestmentGroup;
use App\Models\InvestmentPlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

// In case IDE is strict about EOF formatting, keep file ending clean.


class InvestmentGroupSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Create 4 groups mapped to the seeded plans (by name)
        // so the invest UI can pull open batches.
        $plans = InvestmentPlan::query()->get()->keyBy('name');

        $groupDefs = [
            [
                'name' => 'Batch Doveman - 1',
                'plan' => 'Doveman',
                'status' => 'open',
                'total_profit' => 0,
                'maturity_date' => null,
                'created_offset_days' => 1,
            ],
            [
                'name' => 'Batch Mr Roy - 1',
                'plan' => 'Mr Roy',
                'status' => 'open',
                'total_profit' => 0,
                'maturity_date' => null,
                'created_offset_days' => 2,
            ],
            [
                'name' => 'Batch Leximan - 1',
                'plan' => 'Leximan',
                'status' => 'maturing',
                'total_profit' => 0,
                // keep maturity date around now so UI can show maturity
                'maturity_date' => now()->addDays(1),
                'created_offset_days' => 27,
            ],
            [
                'name' => 'Batch Xman - 1',
                'plan' => 'Xman',
                'status' => 'matured',
                // declared profit is for profit-distribution visualization
                'total_profit' => 300,
                'maturity_date' => now()->subDay(1),
                'created_offset_days' => 29,
            ],
        ];

        foreach ($groupDefs as $def) {
            $plan = $plans->get($def['plan']);
            if (!$plan) {
                // If plans aren't seeded yet, just skip.
                continue;
            }

            InvestmentGroup::updateOrCreate(
                ['name' => $def['name']],
                [
                    'investment_plan_id' => $plan->id,
                    'status' => $def['status'],
                    'total_profit' => $def['total_profit'],
                    'maturity_date' => $def['maturity_date'],
                ]
            );

            // Note: created_at backdating is optional; investment group controller only filters by created_at
            // for open batches newer than 5 days.
            $group = InvestmentGroup::where('name', $def['name'])->first();
            if ($group) {
                $createdAt = now()->subDays((int) $def['created_offset_days']);
                $group->forceFill(['created_at' => $createdAt, 'updated_at' => now()])->save();
            }
        }
    }
}

