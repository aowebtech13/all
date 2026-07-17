<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

use App\Services\CurrencyService;

class ExchangeController extends Controller
{
    protected $currencyService;

    public function __construct(CurrencyService $currencyService)
    {
        $this->currencyService = $currencyService;
    }

    public function getRates()
    {
        $rates = $this->currencyService->getRates();

        return response()->json([
            'rates' => $rates,
            'fee_percentage' => 2.5, // 2.5% fee
        ]);
    }

    public function exchange(Request $request)
    {
        $request->validate([
            'from_currency' => 'required|string',
            'to_currency' => 'required|string',
            'from_amount' => 'required|numeric|min:1',
            'to_amount' => 'required|numeric',
            'rate' => 'required|numeric',
            'fee' => 'required|numeric',
            'recipient_name' => 'required|string',
            'recipient_email' => 'required|string|email',
            'bank_name' => 'nullable|string',
            'account_number' => 'nullable|string',
        ]);

        $user = $request->user();

        // Check if user has enough balance (Assuming balance is in USD for now)
        // If from_currency is not USD, we should convert it to USD to check balance
        // For simplicity, let's assume the user's balance is in the 'from_currency' they selected
        // or just check against the 'balance' column which we'll treat as the primary currency balance.
        
        if ($user->balance < $request->from_amount) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }

        return DB::transaction(function () use ($request, $user) {
            // Deduct from balance
            $user->decrement('balance', $request->from_amount);

            // Record transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'exchange',
                'amount' => $request->from_amount,
                'status' => 'completed',
                'method' => 'Wallet Exchange',
                'reference' => 'EXC-' . strtoupper(Str::random(10)),
                'description' => "Exchanged {$request->from_amount} {$request->from_currency} to {$request->to_amount} {$request->to_currency} for {$request->recipient_name}",
            ]);

            Log::info("Exchange successful for User ID: {$user->id}, Amount: {$request->from_amount} {$request->from_currency}");

            return response()->json([
                'message' => 'Exchange successful',
                'transaction' => $transaction,
                'new_balance' => $user->fresh()->balance
            ]);
        });
    }
}
