<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MyCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MyCardController extends Controller
{
    public function index()
    {
        $cards = Auth::user()->myCards()->latest()->get();
        return response()->json([
            'cards' => $cards
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:visa,mastercard,paypal,bank',
            'account_name' => 'required|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'account_number' => 'required|string|max:50',
            'routing_number' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        if ($request->is_default) {
            Auth::user()->myCards()->update(['is_default' => false]);
        }

        $card = Auth::user()->myCards()->create($request->all());

        return response()->json([
            'message' => 'Card added successfully',
            'card' => $card
        ]);
    }

    public function update(Request $request, MyCard $myCard)
    {
        if ($myCard->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'type' => 'sometimes|string|in:visa,mastercard,paypal,bank',
            'account_name' => 'sometimes|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'account_number' => 'sometimes|string|max:50',
            'routing_number' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        if ($request->is_default) {
            Auth::user()->myCards()->where('id', '!=', $myCard->id)->update(['is_default' => false]);
        }

        $myCard->update($request->all());

        return response()->json([
            'message' => 'Card updated successfully',
            'card' => $myCard
        ]);
    }

    public function destroy(MyCard $myCard)
    {
        if ($myCard->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $myCard->delete();

        return response()->json([
            'message' => 'Card deleted successfully'
        ]);
    }
}
