<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecipientsController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $recipients = Recipient::query()
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['recipients' => $recipients]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $data = $request->validate([
            'type' => 'nullable|string|max:50',
            'company_name' => 'nullable|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'image' => 'nullable|string|max:255',
        ]);

        $fullName = trim((($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? '')));

        // Name the way the UI expects
        $name = $data['company_name'] ? $data['company_name'] : $fullName;

        $recipient = Recipient::create([
            'user_id' => $user->id,
            'type' => $data['type'] ?? null,
            'company_name' => $data['company_name'] ?? null,
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'image' => $data['image'] ?? null,
            // UI placeholders
            'status' => 'Added',
            'amount' => null,
            'last_transfer_date' => null,
            'last_transfer_time' => null,
        ]);

        // Match existing frontend fields shape where possible
        return response()->json(
            [
                'message' => 'Recipient added successfully',
                'recipient' => [
                    'id' => $recipient->id,
                    'name' => $name ?: null,
                    'email' => $recipient->email,
                    'phone' => $recipient->phone,
                    'image' => $recipient->image ?: '/images/recipients-1.png',
                    'lastTransferDate' => $recipient->last_transfer_date,
                    'lastTransferTime' => $recipient->last_transfer_time,
                    'amount' => $recipient->amount,
                    'type' => $recipient->type,
                    'status' => $recipient->status,
                ],
            ],
            201
        );
    }
}


