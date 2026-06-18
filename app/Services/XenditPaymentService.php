<?php

namespace App\Services;

use App\Models\Appointment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class XenditPaymentService
{
    protected string $secretKey;
    protected ?string $callbackToken;

    public function __construct()
    {
        $this->secretKey = config('services.xendit.secret_key') ?? '';
        $this->callbackToken = config('services.xendit.callback_token') ?? '';
    }

    /**
     * Create a Xendit payment link/invoice for the appointment's DP amount.
     */
    public function createDpPaymentLink(Appointment $appointment): ?array
    {
        if (empty($this->secretKey)) {
            Log::warning('Xendit Secret Key is not configured.');
            return null;
        }

        $timestamp = time();
        $externalId = "appointment_{$appointment->id}_{$timestamp}";
        $amount = $appointment->dp_amount;

        try {
            $response = Http::withBasicAuth($this->secretKey, '')
                ->timeout(10)
                ->post('https://api.xendit.co/v2/invoices', [
                    'external_id' => $externalId,
                    'amount' => $amount,
                    'description' => "DP Booking Sesi Terapi - Ref: " . substr($appointment->id, 0, 8),
                    'success_redirect_url' => route('booking.success', $appointment->id),
                    'failure_redirect_url' => route('booking.show'),
                    'currency' => 'IDR',
                ]);

            if ($response->failed()) {
                Log::error('Xendit Invoice creation failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            $data = $response->json();

            return [
                'invoice_url' => $data['invoice_url'] ?? null,
                'invoice_id' => $data['id'] ?? null,
                'external_id' => $externalId,
                'expired_at' => isset($data['expiry_date']) ? $data['expiry_date'] : null,
            ];
        } catch (\Exception $e) {
            Log::error('Xendit Connection error', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Validate incoming callback token.
     */
    public function verifyCallbackToken(string $receivedToken): bool
    {
        if (empty($this->callbackToken)) {
            return false;
        }

        return hash_equals($this->callbackToken, $receivedToken);
    }
}
