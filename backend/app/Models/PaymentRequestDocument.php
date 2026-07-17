<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentRequestDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_request_id',
        'file_path',
        'original_name',
        'mime_type',
        'size',
    ];

    public function paymentRequest()
    {
        return $this->belongsTo(PaymentRequest::class);
    }
}

