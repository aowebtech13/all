<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory;

    protected static function booted()
    {
        static::creating(function ($user) {
            if (!$user->lxp_id) {
                do {
                    $id = 'LXP' . str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
                } while (static::where('lxp_id', $id)->exists());
                $user->lxp_id = $id;
            }
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'lxp_id',
        'referred_by', // Restored from earlier model if needed for referral links
        'name',
        'email',
        'phone',
        'password',
        'google_id',
        'apple_id',
        'avatar',
        'age',
        'role',
        'source',
        'balance',
        'total_profit',
        'total_invested',
        'withdrawal_date',
        'bank_name',
        'bank_account_holder',
        'bank_account_number',
        'bank_routing_number',
        'account_type',
        'email_verification_code',
        'email_verification_expires_at',
        'password_reset_otp',
        'otp_expires_at',
    ];

    /**
     * The attributes that should be appended to the model's array form.
     *
     * @var array
     */
    protected $appends = ['avatar_url'];

    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) {
            return null;
        }

        if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
            return $this->avatar;
        }

        return asset('storage/' . $this->avatar);
    }

    public function investments()
    {
        return $this->hasMany(Investment::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function myCards()
    {
        return $this->hasMany(MyCard::class);
    }

    // Optional: Keep referral helpers active if you are still utilizing your referral system
    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function referrals()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'email_verification_expires_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'password' => 'hashed',
            // FIX: Restored database math float casting rules
            'balance' => 'float',
            'total_profit' => 'float',
            'total_invested' => 'float',
        ];
    }
}