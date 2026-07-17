<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AccountVerifiedAndFunded extends Notification
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'title' => 'Account Fully Verified',
            'message' => 'Congratulations! Your email has been verified and your 5000 deposit has been confirmed. Your account is now fully active.',
            'type' => 'account_verified_and_funded',
        ];
    }
}
