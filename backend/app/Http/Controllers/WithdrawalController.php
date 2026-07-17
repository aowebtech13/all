<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Withdrawal;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WithdrawalController extends Controller
{
    public function index()
    {
        return response()->json(Auth::user()->withdrawals()->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10', // Assuming min withdrawal is 10
            'method' => 'required|string',
            'details' => 'required|string',
        ]);

        $user = Auth::user();
        
        if ($user->withdrawal_date && now()->lt($user->withdrawal_date)) {
            return response()->json([
                'message' => 'You are not eligible for withdrawal until ' . \Carbon\Carbon::parse($user->withdrawal_date)->format('M d, Y') . '.'
            ], 422);
        }

        if ($user->balance < $request->amount) {
            return response()->json(['message' => 'Insufficient balance.'], 422);
        }

        return DB::transaction(function () use ($user, $request) {
            // Deduct from balance immediately to "lock" the funds
            $user->decrement('balance', $request->amount);

            $withdrawal = Withdrawal::create([
                'user_id' => $user->id,
                'amount' => $request->amount,
                'method' => $request->method,
                'details' => $request->details,
                'status' => 'pending',
            ]);

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'withdrawal_request',
                'amount' => -$request->amount,
                'status' => 'pending',
                'description' => "Withdrawal request via {$request->method}",
            ]);

            return response()->json([
                'message' => 'Withdrawal request submitted successfully.',
                'withdrawal' => $withdrawal,
                'user' => $user->fresh(),
            ]);
        });
    }
}
