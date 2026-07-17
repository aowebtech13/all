<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\PageDataController;
use App\Http\Controllers\InvestmentController;
use App\Http\Controllers\WithdrawalController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ExchangeController;
use App\Http\Controllers\Api\RecipientsController;
use App\Http\Controllers\Api\PaymentRequestController;
use App\Http\Controllers\Api\MyCardController;
use App\Http\Controllers\Api\DevicesController;
use App\Http\Controllers\Api\DepositController;
use App\Http\Controllers\Api\PasswordResetController;

use App\Http\Middleware\CorsForApi;

use App\Mail\AdminNotificationMail;
use Illuminate\Support\Facades\Mail;

Route::middleware(['throttle:api'])->group(function () {
    Route::get('/services', [PageDataController::class, 'services']);
    Route::get('/investment-plans', [InvestmentController::class, 'getPlans']);
    Route::get('/partnerships', [\App\Http\Controllers\PartnershipController::class, 'index']);
    Route::get('/partnerships/{id}', [\App\Http\Controllers\PartnershipController::class, 'show']);

    // IMPORTANT: Ensure CORS headers (including preflight OPTIONS) for both public and private SPA calls.
    Route::middleware([CorsForApi::class])->group(function () {
        // Public auth endpoints (login/register/forgot-password)
        require __DIR__ . '/auth.php';

        // Authenticated API routes
        Route::middleware(['auth:sanctum'])->group(function () {
            Route::get('/user', function (Request $request) {
                return $request->user();
            })->middleware('ensure.email.verified');

            Route::get('/dashboard-data', [InvestmentController::class, 'getDashboardData'])
                ->middleware(['ensure.email.verified', 'ensure.verification.deposit']);

            Route::get('/available-groups', [InvestmentController::class, 'getAvailableGroups'])
                ->middleware(['ensure.email.verified', 'ensure.verification.deposit']);

            Route::get('/transactions', [InvestmentController::class, 'getTransactions'])
                ->middleware(['ensure.email.verified', 'ensure.verification.deposit']);

            Route::get('/investments', [InvestmentController::class, 'getInvestments'])
                ->middleware(['ensure.email.verified', 'ensure.verification.deposit']);

            Route::post('/investments/{id}/cancel', [InvestmentController::class, 'cancelInvestment'])
                ->middleware(['throttle:transactions', 'ensure.email.verified']);

            Route::post('/invest', [InvestmentController::class, 'invest'])
                ->middleware(['throttle:transactions', 'ensure.email.verified']);

            Route::get('/withdrawals', [WithdrawalController::class, 'index'])
                ->middleware('ensure.verification.deposit');

            Route::post('/withdraw', [WithdrawalController::class, 'store'])
                ->middleware(['throttle:transactions', 'ensure.verification.deposit']);

            Route::get('/deposits', [DepositController::class, 'index']);
            Route::post('/deposit', [DepositController::class, 'store'])
                ->middleware('throttle:transactions');
            Route::post('/deposit/paystack/verify', [DepositController::class, 'verifyPaystack'])
                ->middleware('throttle:transactions');

            Route::get('/loans/rates', [ExchangeController::class, 'getRates']);
            Route::post('/loans', [ExchangeController::class, 'exchange'])
                ->middleware('throttle:transactions');

            Route::get('/profile', [ProfileController::class, 'show'])
                ->middleware('ensure.verification.deposit');
            Route::post('/profile', [ProfileController::class, 'update'])
                ->middleware('ensure.verification.deposit');
            Route::post('/profile/password', [ProfileController::class, 'updatePassword'])
                ->middleware('ensure.verification.deposit');
            Route::post('/profile/withdrawal-details', [ProfileController::class, 'updateWithdrawalDetails'])
                ->middleware('ensure.verification.deposit');

            Route::get('/notifications', [ProfileController::class, 'getNotifications'])
                ->middleware(['ensure.email.verified', 'ensure.verification.deposit']);
            Route::post('/notifications/mark-as-read', [ProfileController::class, 'markNotificationsAsRead'])
                ->middleware(['ensure.email.verified', 'ensure.verification.deposit']);

            Route::get('/recipients', [RecipientsController::class, 'index'])
                ->middleware(['ensure.email.verified', 'ensure.verification.deposit']);
            Route::post('/recipients', [RecipientsController::class, 'store'])
                ->middleware(['ensure.email.verified', 'ensure.verification.deposit']);

            Route::post('/payment-requests', [PaymentRequestController::class, 'store'])
                ->middleware(['ensure.email.verified', 'ensure.verification.deposit']);

            Route::get('/my-cards', [MyCardController::class, 'index'])
                ->middleware(['ensure.email.verified', 'ensure.verification.deposit']);

            Route::get('/devices', [DevicesController::class, 'index']);
            Route::post('/devices/logout', [DevicesController::class, 'logoutDevice']);
            Route::post('/devices/logout-all', [DevicesController::class, 'logoutAll']);
        });

        // Public Paystack Webhook (CORS headers included by CorsForApi group)
        Route::post('/deposit/paystack/webhook', [DepositController::class, 'handleWebhook']);
    });
});

// Public API health endpoint
require __DIR__ . '/health.php';

// Password reset endpoints for the Next.js frontend (also CORS-enabled)
Route::middleware(['throttle:api', CorsForApi::class])->group(function () {
    Route::post('/forgot-password', [PasswordResetController::class, 'sendOTP']);
    Route::post('/auth/verify-otp', [PasswordResetController::class, 'resetPassword']);
    Route::post('/verify-otp', [PasswordResetController::class, 'resetPassword']);
});

Route::middleware(['throttle:api', 'auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index']);
    Route::get('/users', [AdminController::class, 'getAllUsers']);
    Route::post('/users/{id}/add-money', [AdminController::class, 'addUserMoney']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

    Route::get('/investments', [AdminController::class, 'getAllInvestments']);
    Route::post('/investments/{id}/cancel', [AdminController::class, 'cancelInvestment']);
    Route::post('/investments/{id}/extend', [AdminController::class, 'extendInvestmentDate']);

    Route::get('/withdrawals', [AdminController::class, 'getAllWithdrawals']);
    Route::post('/withdrawals/{id}/status', [AdminController::class, 'updateWithdrawalStatus']);

    Route::get('/deposits', [AdminController::class, 'getAllDeposits']);
    Route::post('/deposits/{id}/status', [AdminController::class, 'updateDepositStatus']);

    Route::post('/send-test-email', function (Request $request) {
        $user = $request->user();
        Mail::to($user->email)->send(new AdminNotificationMail(
            $user,
            'Test Notification',
            'This is a test notification from the admin area.',
            config('app.url') . '/admin/dashboard'
        ));

        return response()->json(['message' => 'Test email sent successfully.']);
    });
});

