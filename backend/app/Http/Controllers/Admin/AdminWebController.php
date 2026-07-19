<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Investment;
use App\Models\Withdrawal;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Mail\AdminResetToken;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

use App\Models\InvestmentGroup;

use Illuminate\Support\Str;

class AdminWebController extends Controller
{
    public function profitSharing()
    {
        $groups = InvestmentGroup::with(['investments.user', 'investments.plan'])
            ->withCount('investments')
            ->latest()
            ->get();
            
        return view('admin.profit_sharing', compact('groups'));
    }

    public function investmentGroups()
    {
        $groups = InvestmentGroup::withCount('investments')->latest()->get();
        $ungroupedInvestments = Investment::whereNull('investment_group_id')->where('status', 'active')->with('user', 'plan')->get();
        $plans = \App\Models\InvestmentPlan::where('is_active', true)->get();
        $users = User::where('role', '!=', 'admin')->orderBy('name')->get();
        return view('admin.groups', compact('groups', 'ungroupedInvestments', 'plans', 'users'));
    }

    public function createInvestmentGroup(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:investment_plans,id',
        ]);

        $plan = \App\Models\InvestmentPlan::findOrFail($request->plan_id);

        // Check if there is already an open group for this plan that is NOT full AND is less than 5 days old
        $existingOpenGroup = InvestmentGroup::where('investment_plan_id', $plan->id)
            ->where('status', 'open')
            ->where('created_at', '>=', now()->subDays(5))
            ->withCount('investments')
            ->get()
            ->filter(function($group) {
                return $group->investments_count < 20;
            })->first();

        if ($existingOpenGroup) {
            return back()->with('error', "Cannot create new batch. The existing batch '{$existingOpenGroup->name}' for this plan is still active and must be filled (20/20) or reach 5 days of age first.");
        }

        $randomSuffix = strtoupper(Str::random(3));
        $groupName = $plan->name . ' ' . $randomSuffix;

        InvestmentGroup::create([
            'name' => $groupName,
            'investment_plan_id' => $plan->id,
            'status' => 'open',
        ]);

        return back()->with('success', "Investment group '{$groupName}' created successfully.");
    }

    public function joinGroup(Request $request, $id)
    {
        $investment = Investment::with('plan')->findOrFail($id);
        
        $request->validate([
            'group_option' => 'required|string|in:new,existing',
            'group_id' => 'required_if:group_option,existing|exists:investment_groups,id',
        ]);

        if ($request->group_option === 'new') {
            // Check if there is already an open group for this plan that is NOT full AND is less than 5 days old
            $existingOpenGroup = InvestmentGroup::where('investment_plan_id', $investment->investment_plan_id)
                ->where('status', 'open')
                ->where('created_at', '>=', now()->subDays(5))
                ->withCount('investments')
                ->get()
                ->filter(function($group) {
                    return $group->investments_count < 20;
                })->first();

            if ($existingOpenGroup) {
                return back()->with('error', "You cannot create a new batch yet. Please join the existing active batch: {$existingOpenGroup->name}");
            }

            $randomSuffix = strtoupper(Str::random(3));
            $groupName = $investment->plan->name . ' ' . $randomSuffix;
            
            $group = InvestmentGroup::create([
                'name' => $groupName,
                'investment_plan_id' => $investment->investment_plan_id,
                'status' => 'open',
            ]);
        } else {
            $group = InvestmentGroup::withCount('investments')->findOrFail($request->group_id);
            
            if ($group->investments_count >= 20) {
                return back()->with('error', 'This group has reached its maximum capacity of 20 people.');
            }

            if ($group->created_at->lt(now()->subDays(5))) {
                return back()->with('error', 'This batch is older than 5 days and is no longer accepting new members.');
            }

            if ($group->status === 'matured') {
                return back()->with('error', 'Cannot add investors to a matured group.');
            }
        }

        $investment->update(['investment_group_id' => $group->id]);

        return back()->with('success', "Investor successfully added to batch: {$group->name}");
    }

    public function assignToGroup(Request $request)
    {
        $request->validate([
            'investment_ids' => 'required|array',
            'investment_ids.*' => 'exists:investments,id',
            'group_id' => 'required|exists:investment_groups,id',
        ]);

        Investment::whereIn('id', $request->investment_ids)->update([
            'investment_group_id' => $request->group_id
        ]);

        return back()->with('success', 'Investments assigned to group successfully.');
    }

    public function addUserToGroup(Request $request, $groupId)
    {
        $group = InvestmentGroup::with(['plan'])->withCount('investments')->findOrFail($groupId);
        
        if ($group->investments_count >= 20) {
            return back()->with('error', 'This group has reached its maximum capacity of 20 people.');
        }

        if ($group->created_at->lt(now()->subDays(5))) {
            return back()->with('error', 'This batch is older than 5 days and is no longer accepting new members.');
        }

        if ($group->status === 'matured') {
            return back()->with('error', 'Cannot add investors to a matured group.');
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:1',
        ]);

        $user = User::findOrFail($request->user_id);
        $plan = $group->plan;

        if ($user->balance < $request->amount) {
            return back()->with('error', "User '{$user->name}' has insufficient balance ($" . number_format($user->balance, 2) . ").");
        }

        DB::transaction(function () use ($user, $plan, $group, $request) {
            // Deduct from balance
            $user->decrement('balance', $request->amount);
            $user->increment('total_invested', $request->amount);

            // Create investment
            Investment::create([
                'user_id' => $user->id,
                'investment_plan_id' => $plan->id,
                'investment_group_id' => $group->id,
                'amount' => $request->amount,
                'start_date' => now(),
                'end_date' => now()->addDays($plan->duration_days),
                'status' => 'active',
            ]);

            // Create transaction
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'investment',
                'amount' => -$request->amount,
                'status' => 'completed',
                'description' => "Invested in {$plan->name} via admin and joined batch: {$group->name}",
            ]);
        });

        return back()->with('success', "User '{$user->name}' successfully added to batch: {$group->name}");
    }

    public function matureGroup(Request $request, $id)
    {
        $group = InvestmentGroup::findOrFail($id);
        
        $request->validate([
            'total_profit' => 'required|numeric|min:0',
        ]);

        try {
            $result = $group->distributeProfit($request->total_profit);
            return back()->with('success', "Group matured. Profit distributed. Company: \${$result['company_share']}, Users Share: \${$result['users_total_share']}");
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_investments' => Investment::count(),
            'total_invested_amount' => Investment::sum('amount'),
            'pending_withdrawals' => Withdrawal::where('status', 'pending')->count(),
        ];
        return view('admin.dashboard', compact('stats'));
    }

    public function showLoginForm()
    {
        return view('admin.auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            if (Auth::user()->role !== 'admin') {
                Auth::logout();
                return back()->with('error', 'Unauthorized access.');
            }
            $request->session()->regenerate();
            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->with('error', 'The provided credentials do not match our records.');
    }

    public function showForgotForm()
    {
        return view('admin.auth.forgot');
    }

    public function sendResetToken(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);
        
        $user = User::where('email', $request->email)->where('role', 'admin')->first();
        if (!$user) {
            return back()->with('error', 'Admin user not found.');
        }

        $token = sprintf("%06d", mt_rand(1, 999999));
        
        DB::table('admin_password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'expires_at' => now()->addMinutes(15),
                'created_at' => now()
            ]
        );

        // SMTP/email delivery intentionally disabled for admin password reset.
        // Token generation and persistence remain enabled so the admin can still reset using the stored token.

        return redirect()->route('admin.password.reset')->with('success', 'A 6-digit reset token has been generated for verification (email delivery disabled).');

    }

    public function showResetForm()
    {
        return view('admin.auth.reset');
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $reset = DB::table('admin_password_resets')->where('email', $request->email)->first();

        if (!$reset || now()->greaterThan($reset->expires_at) || !Hash::check($request->token, $reset->token)) {
            return back()->with('error', 'Invalid or expired token.');
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('admin_password_resets')->where('email', $request->email)->delete();

        return redirect()->route('admin.dashboard')->with('success', 'Password reset successful.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login');
    }

    public function users(Request $request)
    {
        $search = $request->input('search');
        
        $users = User::where('role', '!=', 'admin')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('lxp_id', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(50);

        return view('admin.users', compact('users', 'search'));
    }

    public function showUser($id)
    {
        $user = User::with(['transactions' => function($query) {
            $query->latest();
        }, 'investments.plan', 'investments.group'])->findOrFail($id);
        
        $groups = InvestmentGroup::where('status', 'open')->withCount('investments')->get();
        
        return view('admin.user_show', compact('user', 'groups'));
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'balance' => 'required|numeric|min:0',
            'total_profit' => 'nullable|numeric|min:0',
            'total_invested' => 'nullable|numeric|min:0',
            'withdrawal_date' => 'nullable|date',
            'description' => 'nullable|string|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $oldBalance = (float) $user->balance;
        $newBalance = (float) $request->balance;

        $oldProfit = (float) $user->total_profit;
        $newProfit = (float) ($request->total_profit ?? 0);

        $oldInvested = (float) $user->total_invested;
        $newInvested = (float) ($request->total_invested ?? 0);

        $financialChanged = ($oldBalance != $newBalance)
            || ($oldProfit != $newProfit)
            || ($oldInvested != $newInvested);

        if ($financialChanged && !$request->description) {
            return back()->with('error', 'A description is required when manually adjusting the account balance, profit, or invested amounts.');
        }

        DB::transaction(function () use ($user, $request, $oldBalance, $newBalance, $oldProfit, $newProfit, $oldInvested, $newInvested) {
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'balance' => $request->balance,
                'total_profit' => $request->total_profit ?? 0,
                'total_invested' => $request->total_invested ?? 0,
                'withdrawal_date' => $request->withdrawal_date,
            ];

            if ($request->hasFile('avatar')) {
                // Delete old avatar if exists
                if ($user->avatar && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->avatar)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
                }

                $path = $request->file('avatar')->store('avatars', 'public');
                $updateData['avatar'] = $path;
            }

            $user->update($updateData);

            if ($oldBalance != $newBalance) {
                $diff = $newBalance - $oldBalance;
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => $diff > 0 ? 'admin_credit' : 'admin_debit',
                    'amount' => $diff,
                    'status' => 'completed',
                    'description' => $request->description ?? "Balance manually adjusted by administrator. (" . ($diff > 0 ? "+" : "") . "$diff)",
                ]);
            }

            if ($oldProfit != $newProfit) {
                $diff = $newProfit - $oldProfit;
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'admin_profit_adjustment',
                    'amount' => $diff,
                    'status' => 'completed',
                    'description' => $request->description ?? "Profit manually adjusted by administrator. (" . ($diff > 0 ? "+" : "") . "$diff)",
                ]);
            }

            if ($oldInvested != $newInvested) {
                $diff = $newInvested - $oldInvested;
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'admin_invested_adjustment',
                    'amount' => $diff,
                    'status' => 'completed',
                    'description' => $request->description ?? "Invested amount manually adjusted by administrator. (" . ($diff > 0 ? "+" : "") . "$diff)",
                ]);
            }
        });

        return back()->with('success', 'User details updated successfully.');
    }

    public function transactions()
    {
        $transactions = Transaction::with('user')->latest()->paginate(50);
        return view('admin.transactions', compact('transactions'));
    }

    public function fundUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:credit,debit',
            'description' => 'required|string|max:255',
        ]);

        $amount = $request->type === 'credit' ? $request->amount : -$request->amount;

        DB::transaction(function () use ($user, $amount, $request) {
            $user->increment('balance', $amount);
            
            Transaction::create([
                'user_id' => $user->id,
                'type' => $request->type === 'credit' ? 'admin_credit' : 'admin_debit',
                'amount' => $amount,
                'status' => 'completed',
                'description' => $request->description,
            ]);
        });

        return back()->with('success', 'User wallet updated successfully.');
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return back()->with('error', 'Cannot delete admin user.');
        }
        $user->delete();
        return back()->with('success', 'User deleted successfully.');
    }

    public function investments()
    {
        $investments = Investment::with(['user', 'plan'])->latest()->get();
        return view('admin.investments', compact('investments'));
    }

    public function cancelInvestment($id)
    {
        $investment = Investment::findOrFail($id);
        if ($investment->status !== 'active') {
            return back()->with('error', 'Only active investments can be cancelled.');
        }

        DB::transaction(function () use ($investment) {
            $investment->status = 'cancelled';
            $investment->profit = 0; // No profit share for leaving before maturity
            $investment->save();

            $refundAmount = $investment->amount * 0.9;
            $penaltyAmount = $investment->amount * 0.1;

            $investment->user->increment('balance', $refundAmount);

            Transaction::create([
                'user_id' => $investment->user_id,
                'type' => 'cancellation_refund',
                'amount' => $refundAmount,
                'status' => 'completed',
                'description' => "Refund from cancelled investment #{$investment->id} (10% penalty applied: -\${$penaltyAmount})",
            ]);
        });

        return back()->with('success', 'Investment cancelled. 90% of principal refunded to user.');
    }

    public function extendInvestment(Request $request, $id)
    {
        $request->validate(['end_date' => 'required|date|after:today']);
        $investment = Investment::findOrFail($id);
        $investment->end_date = $request->end_date;
        $investment->save();

        return back()->with('success', 'Investment end date extended.');
    }

    public function withdrawals(Request $request)
    {
        $status = $request->query('status', 'pending');
        $query = Withdrawal::with('user')->latest();
        
        if (in_array($status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $status);
        }
        
        $withdrawals = $query->paginate(50);
        return view('admin.withdrawals', compact('withdrawals', 'status'));
    }

    public function deposits(Request $request)
    {
        $status = $request->query('status', 'pending');
        $query = Transaction::where('type', 'deposit')->with('user')->latest();

        if (in_array($status, ['pending', 'completed', 'failed'])) {
            $query->where('status', $status);
        }

        $deposits = $query->paginate(50);
        return view('admin.deposits', compact('deposits', 'status'));
    }

    public function updateDeposit(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:completed,failed',
            'admin_note' => 'nullable|string',
        ]);

        $transaction = Transaction::findOrFail($id);
        if ($transaction->type !== 'deposit' || $transaction->status !== 'pending') {
            return back()->with('error', 'Only pending deposits can be updated.');
        }

        DB::transaction(function () use ($transaction, $request) {
            $transaction->status = $request->status;
            if ($request->admin_note) {
                $transaction->description = ($transaction->description ? $transaction->description . " | " : "")
                    . "Admin Note: " . $request->admin_note;
            }

            if ($request->status === 'completed') {
                // Accept: credit the user's balance
                $transaction->user->increment('balance', $transaction->amount);
            }
            // Declined (failed): no balance change, just record the decision.
            $transaction->save();
        });

        $message = $request->status === 'completed'
            ? 'Deposit approved and funds added to user balance.'
            : 'Deposit declined.';

        return back()->with('success', $message);
    }

    public function updateWithdrawal(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected',
        ]);

        $withdrawal = Withdrawal::findOrFail($id);
        if ($withdrawal->status !== 'pending') {
            return back()->with('error', 'Only pending withdrawals can be updated.');
        }

        DB::transaction(function () use ($withdrawal, $request) {
            $withdrawal->status = $request->status;
            if ($request->status === 'rejected') {
                $withdrawal->rejection_reason = $request->rejection_reason;
                $withdrawal->user->increment('balance', $withdrawal->amount);
            }
            $withdrawal->save();

            Transaction::create([
                'user_id' => $withdrawal->user_id,
                'type' => 'withdrawal_' . $request->status,
                'amount' => $request->status === 'approved' ? -$withdrawal->amount : $withdrawal->amount,
                'status' => 'completed',
                'description' => "Withdrawal request #{$withdrawal->id} was {$request->status}",
            ]);
        });

        return back()->with('success', "Withdrawal {$request->status} successfully.");
    }
}
