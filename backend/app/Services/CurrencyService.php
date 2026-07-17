<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CurrencyService
{
    public function getRates()
    {
        return Cache::remember('exchange_rates', 3600, function () {
            try {
                $response = Http::get('https://open.er-api.com/v6/latest/USD');
                if ($response->successful()) {
                    $data = $response->json();
                    return [
                        'USD' => [
                            'NGN' => $data['rates']['NGN'] ?? 1400.00,
                        ],
                        'NGN' => [
                            'USD' => 1 / ($data['rates']['NGN'] ?? 1400.00),
                        ]
                    ];
                }
            } catch (\Exception $e) {
                Log::error("Failed to fetch exchange rates: " . $e->getMessage());
            }

            return [
                'USD' => [
                    'NGN' => 1400.00,
                ],
                'NGN' => [
                    'USD' => 0.000714,
                ]
            ];
        });
    }

    public function getUsdToNgnRate()
    {
        $rates = $this->getRates();
        return $rates['USD']['NGN'] ?? 1400.00;
    }
}
