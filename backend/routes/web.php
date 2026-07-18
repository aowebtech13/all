<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AdminWebController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Api\PasswordResetController;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

/*
 * Backwards-compatible API auth endpoints.
 *
 * Some deployed frontend builds call these routes WITHOUT the `/api` prefix
 * (e.g. `auth/login`), which previously returned a 404. These mirror the
 * routes defined in routes/auth.php but are served from the web router using
 * the stateless `api` middleware so they behave identically to the API.
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
 * Some deployed frontend builds call auth endpoints under an `/auth` prefix
 * (e.g. `auth/login`), which previously returned a 404. Mirror the same
 * endpoints under `/auth` for backwards compatibility.
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

// Public Admin Auth Routes
// Route alias required because Laravel's default auth redirects to route name `login`.
Route::get('/login', function () {
    return redirect()->route('admin.login');
})->name('login');

Route::prefix('geyfdv')->group(function () {
    Route::get('/password/forgot', [AdminWebController::class, 'showForgotForm'])->name('admin.password.forgot');

    Route::post('/password/forgot', [AdminWebController::class, 'sendResetToken']);
    Route::get('/password/reset', [AdminWebController::class, 'showResetForm'])->name('admin.password.reset');
    Route::post('/password/reset', [AdminWebController::class, 'resetPassword']);
    
    // Add a simple login view for the admin blade panel
    Route::get('/login', [AdminWebController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AdminWebController::class, 'login'])->withoutMiddleware([
        \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class
    ]);
});

Route::middleware(['auth', 'admin'])->prefix('geyfdv')->group(function () {
    Route::get('/dashboard', [AdminWebController::class, 'dashboard'])->name('admin.dashboard');
    
    Route::get('/users', [AdminWebController::class, 'users'])->name('admin.users');
    Route::get('/users/{id}', [AdminWebController::class, 'showUser'])->name('admin.users.show');
    Route::post('/users/{id}', [AdminWebController::class, 'updateUser'])->name('admin.users.update');
    Route::post('/users/{id}/fund', [AdminWebController::class, 'fundUser'])->name('admin.users.fund');
    Route::delete('/users/{id}', [AdminWebController::class, 'deleteUser'])->name('admin.users.delete');
    
    Route::get('/investments', [AdminWebController::class, 'investments'])->name('admin.investments');
    Route::post('/investments/{id}/cancel', [AdminWebController::class, 'cancelInvestment'])->name('admin.investments.cancel');
    Route::post('/investments/{id}/extend', [AdminWebController::class, 'extendInvestment'])->name('admin.investments.extend');

    Route::get('/groups', [AdminWebController::class, 'investmentGroups'])->name('admin.groups');
    Route::post('/groups', [AdminWebController::class, 'createInvestmentGroup'])->name('admin.groups.create');
    Route::post('/groups/assign', [AdminWebController::class, 'assignToGroup'])->name('admin.groups.assign');
    Route::post('/groups/{id}/add-user', [AdminWebController::class, 'addUserToGroup'])->name('admin.groups.add_user');
    Route::post('/groups/{id}/mature', [AdminWebController::class, 'matureGroup'])->name('admin.groups.mature');
    Route::get('/profit-sharing', [AdminWebController::class, 'profitSharing'])->name('admin.profit_sharing');
    Route::post('/investments/{id}/join-group', [AdminWebController::class, 'joinGroup'])->name('admin.investments.join_group');
    
    Route::get('/withdrawals', [AdminWebController::class, 'withdrawals'])->name('admin.withdrawals');
    Route::post('/withdrawals/{id}/update', [AdminWebController::class, 'updateWithdrawal'])->name('admin.withdrawals.update');
    
    Route::get('/deposits', [AdminWebController::class, 'deposits'])->name('admin.deposits');
    Route::post('/deposits/{id}/update', [AdminWebController::class, 'updateDeposit'])->name('admin.deposits.update');
    
    Route::get('/transactions', [AdminWebController::class, 'transactions'])->name('admin.transactions');
    
    Route::post('/logout', [AdminWebController::class, 'logout'])->name('admin.logout');
});
