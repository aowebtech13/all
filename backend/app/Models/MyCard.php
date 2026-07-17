<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'account_name',
        'bank_name',
        'account_number',
        'routing_number',
        'transfer_limit',
        'is_default',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
