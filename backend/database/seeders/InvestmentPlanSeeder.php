<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InvestmentPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete all existing plans to avoid duplicates
        \App\Models\InvestmentPlan::query()->delete();

        \App\Models\InvestmentPlan::create([
            'name' => 'Doveman',
            'description' => 'Perfect for beginners starting their journey.',
            'min_amount' => 75,
            'max_amount' => 100,
            'interest_rate' => 1.0,
            'duration_days' => 30,
            'return_type' => 'daily',
            'is_active' => true,
        ]);

        \App\Models\InvestmentPlan::create([
            'name' => 'Mr Roy',
            'description' => 'For serious investors looking for stable returns.',
            'min_amount' => 275,
            'max_amount' => 300,
            'interest_rate' => 1.5,
            'duration_days' => 30,
            'return_type' => 'daily',
            'is_active' => true,
        ]);

        \App\Models\InvestmentPlan::create([
            'name' => 'Leximan',
            'description' => 'Premium returns for dedicated partners.',
            'min_amount' => 975,
            'max_amount' => 1000,
            'interest_rate' => 2.0,
            'duration_days' => 30,
            'return_type' => 'daily',
            'is_active' => true,
        ]);

        \App\Models\InvestmentPlan::create([
            'name' => 'Xman',
            'description' => 'Exclusive elite plan for top-tier partners.',
            'min_amount' => 475,
            'max_amount' => 500,
            'interest_rate' => 3.0,
            'duration_days' => 30,
            'return_type' => 'daily',
            'is_active' => true,
        ]);
    }
}
