<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentRequest;
use App\Models\PaymentRequestDocument;
use App\Http\Requests\PaymentRequestStoreRequest;

class PaymentRequestController extends Controller
{
    public function store(PaymentRequestStoreRequest $request)
    {
        $paymentRequest = PaymentRequest::create([
            'user_id' => $request->user()->id,
            'amount' => $request->amount,
            'description' => $request->description,
            'requested_as' => $request->requested_as,
            'status' => 'pending',
        ]);

        foreach ($request->file('documents', []) as $doc) {
            $path = $doc->store('payment_request_documents', 'public');

            PaymentRequestDocument::create([
                'payment_request_id' => $paymentRequest->id,
                'file_path' => $path,
                'original_name' => $doc->getClientOriginalName(),
                'mime_type' => $doc->getClientMimeType(),
                'size' => $doc->getSize(),
            ]);
        }

        return response()->json([
            'message' => 'Payment request submitted successfully',
            'payment_request' => $paymentRequest->load('documents'),
        ]);
    }
}

