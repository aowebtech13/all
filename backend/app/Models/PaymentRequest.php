<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'description',
        'requested_as',
        'status',
    ];

    public function documents()
    {
        return $this->hasMany(PaymentRequestDocument::class);
    }
}

