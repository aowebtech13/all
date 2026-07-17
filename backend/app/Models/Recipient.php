<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Recipient extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'company_name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'image',
        'status',
        'amount',
        'last_transfer_date',
        'last_transfer_time',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

