<?php

namespace App\Services;

use App\Models\Appointment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MayarPaymentService
{
    protected string $apiKey;

    protected string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.mayar.api_key') ?? '';
        $this->baseUrl = config('services.mayar.base_url') ?? 'https://api.mayar.id/hl/v1';
    }

    /**
     * Create a Mayar payment link/invoice for the appointment's DP amount.
     */
    public function createDpPaymentLink(Appointment $appointment): ?array
    {
        if (empty($this->apiKey)) {
            Log::warning('Mayar API Key is not configured.');

            return null;
        }

        $appointment->loadMissing('customer');
        $customer = $appointment->customer;

        if (! $customer || empty($customer->email)) {
            Log::error('Mayar invoice requires customer email', [
                'appointment_id' => $appointment->id,
                'customer_id' => $customer?->id,
            ]);

            return null;
        }

        $timestamp = time();
        $providerReference = "appointment_{$appointment->id}_{$timestamp}";
        $amount = $appointment->dp_amount;
        $expiredAt = now()->addHours(24)->utc()->toIso8601String();

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(10)
                ->post($this->baseUrl.'/invoice/create', [
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'mobile' => $customer->phone_number,
                    'redirectUrl' => route('booking.success', $appointment->id),
                    'description' => 'DP Booking Home Care Therapy - Ref: '.substr($appointment->id, 0, 8),
                    'expiredAt' => $expiredAt,
                    'items' => [
                        [
                            'quantity' => 1,
                            'rate' => $amount,
                            'description' => 'DP Booking Home Care Therapy',
                        ],
                    ],
                    'extraData' => [
                        'appointmentId' => $appointment->id,
                        'paymentPurpose' => 'dp',
                        'providerReference' => $providerReference,
                    ],
                ]);

            if ($response->failed()) {
                Log::error('Mayar Invoice creation failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return null;
            }

            $data = $response->json('data') ?? [];

            $expiredAtParsed = null;
            if (! empty($data['expiredAt'])) {
                try {
                    $expiredAtParsed = \Carbon\Carbon::parse($data['expiredAt']);
                } catch (\Exception $e) {
                    Log::info('Mayar: could not parse expiredAt', ['raw' => $data['expiredAt']]);
                }
            }

            return [
                'invoice_url' => $data['link'] ?? null,
                'invoice_id' => $data['id'] ?? null,
                'external_id' => $data['transactionId'] ?? $data['id'] ?? $providerReference,
                'expired_at' => $expiredAtParsed,
            ];
        } catch (\Exception $e) {
            Log::error('Mayar Connection error', [
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }
}
