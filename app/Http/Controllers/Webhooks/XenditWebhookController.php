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

        if (! $token || ! $paymentService->verifyCallbackToken($token)) {
            Log::warning('Xendit webhook received with invalid token', [
                'token' => $token,
            ]);

            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $payload = $request->all();
        $externalId = $payload['external_id'] ?? null;
        $invoiceId = $payload['id'] ?? null;
        $rawStatus = $payload['status'] ?? '';
        $status = strtolower($rawStatus);

        Log::info('Xendit webhook received', [
            'external_id' => $externalId,
            'invoice_id' => $invoiceId,
            'status' => $status,
        ]);

        if (! $externalId && ! $invoiceId) {
            return response()->json(['message' => 'Missing identifiers'], 400);
        }

        // Find the payment record – scoped to Xendit provider only
        $payment = Payment::where('provider', 'xendit')
            ->where(function ($query) use ($externalId, $invoiceId) {
                if ($externalId) {
                    $query->where('provider_reference_id', $externalId);
                }
                if ($invoiceId) {
                    $query->orWhere('provider_invoice_id', $invoiceId);
                }
            })
            ->first();

        if (! $payment) {
            Log::warning('Xendit webhook: payment record not found', [
                'external_id' => $externalId,
                'invoice_id' => $invoiceId,
            ]);

            return response()->json(['message' => 'Payment not found'], 404);
        }

        // Idempotency: if already paid, do nothing
        if ($payment->status === 'paid') {
            return response()->json(['message' => 'Payment already marked as paid'], 200);
        }

        // --- Amount validation for paid events ---
        if ($status === 'paid') {
            // Xendit may send amount as `paid_amount`, `amount`, or not at all
            $incomingAmount = $payload['paid_amount'] ?? $payload['amount'] ?? null;

            if ($incomingAmount === null) {
                Log::info('Xendit webhook: amount field not provided in payload', [
                    'external_id' => $externalId,
                    'invoice_id' => $invoiceId,
                ]);
            } elseif ((int) $incomingAmount !== (int) $payment->amount) {
                Log::warning('Xendit webhook: amount mismatch — not marking paid', [
                    'external_id' => $externalId,
                    'invoice_id' => $invoiceId,
                    'expected' => $payment->amount,
                    'received' => $incomingAmount,
                ]);

                return response()->json(['message' => 'Amount mismatch'], 422);
            }
        }

        // Map incoming Xendit status to Payment.status
        $targetStatus = match ($status) {
            'paid' => 'paid',
            'expired' => 'expired',
            'failed' => 'failed',
            default => 'pending',
        };

        DB::transaction(function () use ($payment, $targetStatus, $payload) {
            $paidAt = null;
            if ($targetStatus === 'paid') {
                $paidAtStr = $payload['paid_at'] ?? $payload['updated'] ?? null;
                $paidAt = $paidAtStr ? Carbon::parse($paidAtStr) : Carbon::now();
            }

            // Always save raw payload for auditing
            $payment->update([
                'status' => $targetStatus,
                'paid_at' => $paidAt,
                'raw_payload' => $payload,
            ]);

            $appointment = $payment->appointment;
            if (! $appointment) {
                return;
            }

            if ($targetStatus === 'paid') {
                $appointment->update([
                    'payment_status' => 'dp_paid',
                    'status' => 'pending_approval',
                    'paid_at' => $paidAt,
                ]);
            } elseif ($targetStatus === 'expired') {
                $appointment->update([
                    'payment_status' => 'expired',
                    // Only revert to pending_dp if appointment hasn't moved past that status yet
                    // (i.e. do not downgrade an already approved/confirmed appointment)
                ]);
            } elseif ($targetStatus === 'failed') {
                $appointment->update([
                    'payment_status' => 'failed',
                ]);
            }
        });

        return response()->json(['message' => 'Webhook processed successfully'], 200);
    }
}
