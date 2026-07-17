<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequestStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:1000',
            'requested_as' => 'nullable|string|max:255',
            'documents' => 'required|array|max:5',
            'documents.*' => 'file|mimes:jpg,jpeg,png,gif,pdf|max:5120',
        ];
    }
}

