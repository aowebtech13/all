<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AdminWebController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\InvestmentController;
use App\Http\Controllers\WithdrawalController;
use App\Http\Controllers\Api\DepositController;
use App\Http\Controllers\Api\ExchangeController;
use App\Http\Controllers\Api\RecipientsController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\MyCardController;
use App\Http\Controllers\Api\DevicesController;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

/*
|--------------------------------------------------------------------------
| Backwards-compatible API auth endpoints
|--------------------------------------------------------------------------
*/
Route::middleware(['api', 'throttle:api'])
    ->withoutMiddleware([
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
    ])
    ->group(function () {
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
    Route::post('/reset-password', [NewPasswordController::class, 'store']);
    Route::post('/forgot-password-otp', [PasswordResetController::class, 'sendOTP']);
    Route::post('/verify-otp', [PasswordResetController::class, 'verifyOTP']);
    Route::post('/reset-password-with-otp', [PasswordResetController::class, 'resetPassword']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->middleware('auth:sanctum');
});

/*
|--------------------------------------------------------------------------
| Backwards-compatible API endpoints for the Next.js frontend
|--------------------------------------------------------------------------
*/
Route::middleware(['api', 'throttle:api', 'auth:sanctum'])
    ->withoutMiddleware([
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
    ])
    ->group(function () {
    // Investment endpoints
    Route::post('/invest/level-1', [InvestmentController::class, 'invest'])
        ->middleware(['throttle:transactions', 'ensure.email.verified']);
    Route::post('/invest/level-2', [InvestmentController::class, 'invest'])
        ->middleware(['throttle:transactions', 'ensure.email.verified']);
    Route::post('/invest/level-3', [InvestmentController::class, 'invest'])
        ->middleware(['throttle:transactions', 'ensure.email.verified']);
    Route::post('/invest/withdraw', [InvestmentController::class, 'withdraw'])
        ->middleware(['throttle:transactions', 'ensure.email.verified']);

    // Withdrawal + Deposit endpoints intentionally NOT registered here.
    // They are handled in `routes/api.php` to keep these requests fully stateless
    // (this prevents "Session store not set on request" when session middleware is stripped).

    // Withdrawal endpoints
    // Route::post('/withdraw', [WithdrawalController::class, 'store'])
    //     ->middleware(['auth:sanctum', 'throttle:transactions']);

    // Deposit endpoints
    Route::get('/deposit-balance', [DepositController::class, 'depositBalance']);
    // Route::post('/deposit', [DepositController::class, 'store'])
    //     ->middleware('throttle:transactions');


    // Exchange/Loans endpoints
    // Kept here intentionally as stateless API-style endpoints.
    // NOTE: Frontend is calling these as `/loans/*` (not `/api/loans/*`).
    // Therefore, `web.php` must continue to define the routes to avoid 404.
    Route::get('/loans/rates', [ExchangeController::class, 'getRates']);
    Route::post('/loans', [ExchangeController::class, 'exchange'])
        ->middleware('throttle:transactions');

    // Recipients endpoints
    Route::get('/recipients', [RecipientsController::class, 'index'])
        ->middleware('ensure.email.verified');
    Route::post('/recipients', [RecipientsController::class, 'store'])
        ->middleware('ensure.email.verified');

    // User/Profile endpoints
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    })->middleware('ensure.email.verified');
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/withdrawal-details', [ProfileController::class, 'updateWithdrawalDetails']);

    // My Cards endpoints
    Route::get('/my-cards', [MyCardController::class, 'index'])
        ->middleware('ensure.email.verified');

    // Devices endpoints
    Route::get('/devices', [DevicesController::class, 'index']);
    Route::post('/devices/logout', [DevicesController::class, 'logoutDevice']);
    Route::post('/devices/logout-all', [DevicesController::class, 'logoutAll']);

    // Transactions endpoints
    Route::get('/transactions', [InvestmentController::class, 'getTransactions'])
        ->middleware('ensure.email.verified');

    // Investments endpoints
    Route::get('/investments', [InvestmentController::class, 'getInvestments'])
        ->middleware('ensure.email.verified');
    Route::post('/investments/{id}/cancel', [InvestmentController::class, 'cancelInvestment'])
        ->middleware(['throttle:transactions', 'ensure.email.verified']);

    // Withdrawals endpoints
    Route::get('/withdrawals', [WithdrawalController::class, 'index']);

    // Deposits endpoints
    Route::get('/deposits', [DepositController::class, 'index']);

    // Payment Requests endpoints
    Route::post('/payment-requests', [App\Http\Controllers\Api\PaymentRequestController::class, 'store'])
        ->middleware('ensure.email.verified');
});

/*
|--------------------------------------------------------------------------
| Backwards-compatible auth endpoints under an `/auth` prefix
|--------------------------------------------------------------------------
*/
Route::middleware(['api', 'throttle:api'])
    ->withoutMiddleware([
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
    ])
    ->prefix('auth')->group(function () {
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
    Route::post('/reset-password', [NewPasswordController::class, 'store']);
    Route::post('/forgot-password-otp', [PasswordResetController::class, 'sendOTP']);
    Route::post('/verify-otp', [PasswordResetController::class, 'verifyOTP']);
    Route::post('/reset-password-with-otp', [PasswordResetController::class, 'resetPassword']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->middleware('auth:sanctum');
});

/*
|--------------------------------------------------------------------------
| Stateful Blade Administrative Routes (Web Infrastructure)
|--------------------------------------------------------------------------
*/

// Public Entry Redirector
Route::get('/login', function () {
    return redirect()->route('admin.login');
})->name('login');

// Administrative Guest Interface
Route::middleware(['web'])->prefix('geyfdv')->group(function () {
    Route::get('/login', [AdminWebController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AdminWebController::class, 'login'])->name('admin.login.submit');
    
    Route::get('/password/forgot', [AdminWebController::class, 'showForgotForm'])->name('admin.password.forgot');
    Route::post('/password/forgot', [AdminWebController::class, 'sendResetToken']);
    Route::get('/password/reset', [AdminWebController::class, 'showResetForm'])->name('admin.password.reset');
    Route::post('/password/reset', [AdminWebController::class, 'resetPassword']);
});

// Protected Administrative Internal Portal
Route::middleware(['web', 'auth', 'admin'])->prefix('geyfdv')->group(function () {
    Route::get('/dashboard', [AdminWebController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('/logout', [AdminWebController::class, 'logout'])->name('admin.logout');
    
    // Users Management Ledger
    Route::get('/users', [AdminWebController::class, 'users'])->name('admin.users');
    Route::get('/users/{id}', [AdminWebController::class, 'showUser'])->name('admin.users.show');
    Route::post('/users/{id}', [AdminWebController::class, 'updateUser'])->name('admin.users.update');
    Route::post('/users/{id}/fund', [AdminWebController::class, 'fundUser'])->name('admin.users.fund');
    Route::delete('/users/{id}', [AdminWebController::class, 'deleteUser'])->name('admin.users.delete');
    
    // Investment Operations
    Route::get('/investments', [AdminWebController::class, 'investments'])->name('admin.investments');
    Route::post('/investments/{id}/cancel', [AdminWebController::class, 'cancelInvestment'])->name('admin.investments.cancel');
    Route::post('/investments/{id}/extend', [AdminWebController::class, 'extendInvestment'])->name('admin.investments.extend');

    // Grouping & Micro-pooling Engines
    Route::get('/groups', [AdminWebController::class, 'investmentGroups'])->name('admin.groups');
    Route::post('/groups', [AdminWebController::class, 'createInvestmentGroup'])->name('admin.groups.create');
    Route::post('/groups/assign', [AdminWebController::class, 'assignToGroup'])->name('admin.groups.assign');
    Route::post('/groups/{id}/add-user', [AdminWebController::class, 'addUserToGroup'])->name('admin.groups.add_user');
    Route::post('/groups/{id}/mature', [AdminWebController::class, 'matureGroup'])->name('admin.groups.mature');
    Route::get('/profit-sharing', [AdminWebController::class, 'profitSharing'])->name('admin.profit_sharing');
    Route::post('/investments/{id}/join-group', [AdminWebController::class, 'joinGroup'])->name('admin.investments.join_group');
    
    // Balances & Flow Records
    Route::get('/withdrawals', [AdminWebController::class, 'withdrawals'])->name('admin.withdrawals');
    Route::post('/withdrawals/{id}/update', [AdminWebController::class, 'updateWithdrawal'])->name('admin.withdrawals.update');
    
    Route::get('/deposits', [AdminWebController::class, 'deposits'])->name('admin.deposits');
    Route::post('/deposits/{id}/update', [AdminWebController::class, 'updateDeposit'])->name('admin.deposits.update');
    
    Route::get('/transactions', [AdminWebController::class, 'transactions'])->name('admin.transactions');
});