<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestmentPlan extends Model
{
    protected $fillable = [
        'name',
        'description',
        'min_amount',
        'max_amount',
        'interest_rate',
        'duration_days',
        'return_type',
        'is_active',
    ];

    protected $casts = [
        'duration_days' => 'integer',
        'interest_rate' => 'float',
        'min_amount' => 'float',
        'max_amount' => 'float',
        'is_active' => 'boolean',
    ];

    public function investments()
    {
        return $this->hasMany(Investment::class);
    }
}
