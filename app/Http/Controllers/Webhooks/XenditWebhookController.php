<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\XenditPaymentService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class XenditWebhookController extends Controller
{
    public function handle(Request $request, XenditPaymentService $paymentService): JsonResponse
    {
        $token = $request->header('x-callback-token');

        if (!$token || !$paymentService->verifyCallbackToken($token)) {
            Log::warning('Xendit webhook received with invalid token', [
                'token' => $token,
            ]);
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $payload = $request->all();
        $externalId = $payload['external_id'] ?? null;
        $invoiceId = $payload['id'] ?? null;
        $status = strtolower($payload['status'] ?? '');

        Log::info('Xendit webhook received', [
            'external_id' => $externalId,
            'invoice_id' => $invoiceId,
            'status' => $status,
        ]);

        if (!$externalId && !$invoiceId) {
            return response()->json(['message' => 'Missing identifiers'], 400);
        }

        // Find the payment record
        $payment = Payment::where(function ($query) use ($externalId, $invoiceId) {
            if ($externalId) {
                $query->where('provider_reference_id', $externalId);
            }
            if ($invoiceId) {
                $query->orWhere('provider_invoice_id', $invoiceId);
            }
        })->first();

        if (!$payment) {
            Log::warning('Payment record not found for webhook', [
                'external_id' => $externalId,
                'invoice_id' => $invoiceId,
            ]);
            return response()->json(['message' => 'Payment not found'], 404);
        }

        // Idempotency: check if already processed
        if ($payment->status === 'paid') {
            return response()->json(['message' => 'Payment already marked as paid'], 200);
        }

        // Map Xendit status to database payment status
        $targetStatus = 'pending';
        if ($status === 'paid') {
            $targetStatus = 'paid';
        } elseif ($status === 'expired') {
            $targetStatus = 'expired';
        } elseif ($status === 'failed') {
            $targetStatus = 'failed';
        }

        DB::transaction(function () use ($payment, $targetStatus, $payload) {
            $paidAt = null;
            if ($targetStatus === 'paid') {
                $paidAtStr = $payload['paid_at'] ?? $payload['updated'] ?? null;
                $paidAt = $paidAtStr ? Carbon::parse($paidAtStr) : Carbon::now();
            }

            // Update payment record
            $payment->update([
                'status' => $targetStatus,
                'paid_at' => $paidAt,
                'raw_payload' => $payload,
            ]);

            // Update appointment record
            $appointment = $payment->appointment;
            if ($appointment) {
                $appointmentUpdate = [];

                if ($targetStatus === 'paid') {
                    $appointmentUpdate['payment_status'] = 'paid';
                    $appointmentUpdate['paid_at'] = $paidAt;
                } elseif ($targetStatus === 'expired') {
                    $appointmentUpdate['payment_status'] = 'unpaid';
                }

                if (!empty($appointmentUpdate)) {
                    $appointment->update($appointmentUpdate);
                }
            }
        });

        return response()->json(['message' => 'Webhook processed successfully'], 200);
    }
}
