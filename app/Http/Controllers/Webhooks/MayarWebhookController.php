<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MayarWebhookController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        // --- Token verification via query parameter ---
        $expectedToken = config('services.mayar.webhook_secret');
        $receivedToken = $request->query('token');

        if (empty($expectedToken) || ! $receivedToken || ! hash_equals($expectedToken, $receivedToken)) {
            Log::warning('Mayar webhook received with invalid token', [
                'received_token' => $receivedToken,
            ]);

            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $payload = $request->all();
        $event = $payload['event'] ?? $payload['event.received'] ?? $payload['type'] ?? null;
        $data = $payload['data'] ?? $payload;

        Log::info('Mayar webhook received', [
            'event' => $event,
            'data_id' => $data['id'] ?? null,
            'transaction_id' => $data['transactionId'] ?? null,
        ]);

        // --- Find payment record, scoped to Mayar provider ---
        $payment = $this->findPayment($data, $payload);

        if (! $payment) {
            Log::warning('Mayar webhook: payment record not found', [
                'event' => $event,
                'data_id' => $data['id'] ?? null,
                'transaction_id' => $data['transactionId'] ?? null,
                'extra_appointment_id' => $data['extraData']['appointmentId'] ?? $payload['extraData']['appointmentId'] ?? null,
            ]);

            return response()->json(['message' => 'Payment not found'], 404);
        }

        // Always save raw payload for audit
        $payment->update(['raw_payload' => $payload]);

        // --- Idempotency: if already paid, do nothing ---
        if ($payment->status === 'paid') {
            return response()->json(['message' => 'Payment already marked as paid'], 200);
        }

        // --- Handle paid event ---
        $isPaidEvent = $event === 'payment.received';

        if ($isPaidEvent) {
            return $this->handlePaid($payment, $data, $payload);
        }

        // For unknown/non-paid events, just log and return 200
        Log::info('Mayar webhook: non-paid event received', [
            'event' => $event,
            'payment_id' => $payment->id,
        ]);

        return response()->json(['message' => 'Webhook received'], 200);
    }

    /**
     * Attempt to find the Payment record using multiple identifier strategies.
     */
    private function findPayment(array $data, array $payload = []): ?Payment
    {
        // Strategy 1: extraData.appointmentId → find latest pending Mayar payment for that appointment
        $appointmentId = $data['extraData']['appointmentId'] ?? $payload['extraData']['appointmentId'] ?? null;
        if ($appointmentId) {
            $payment = Payment::where('provider', 'mayar')
                ->where('appointment_id', $appointmentId)
                ->whereIn('status', ['pending', 'paid'])
                ->latest()
                ->first();
            if ($payment) {
                return $payment;
            }
        }

        // Strategy 2: data.transactionId → match provider_reference_id
        $transactionId = $data['transactionId'] ?? null;
        if ($transactionId) {
            $payment = Payment::where('provider', 'mayar')
                ->where('provider_reference_id', $transactionId)
                ->first();
            if ($payment) {
                return $payment;
            }
        }

        // Strategy 3: data.id → match provider_invoice_id or provider_reference_id
        $dataId = $data['id'] ?? null;
        if ($dataId) {
            $payment = Payment::where('provider', 'mayar')
                ->where(function ($q) use ($dataId) {
                    $q->where('provider_invoice_id', $dataId)
                        ->orWhere('provider_reference_id', $dataId);
                })
                ->first();
            if ($payment) {
                return $payment;
            }
        }

        // Strategy 4: paymentLinkId or productId → match provider_invoice_id
        $linkId = $data['paymentLinkId'] ?? $data['productId'] ?? null;
        if ($linkId) {
            $payment = Payment::where('provider', 'mayar')
                ->where('provider_invoice_id', $linkId)
                ->first();
            if ($payment) {
                return $payment;
            }
        }

        return null;
    }

    /**
     * Handle a confirmed paid event.
     */
    private function handlePaid(Payment $payment, array $data, array $payload): JsonResponse
    {
        // Amount validation
        $incomingAmount = $data['amount'] ?? null;

        if ($incomingAmount === null) {
            Log::info('Mayar webhook: amount field not provided in payload', [
                'payment_id' => $payment->id,
            ]);
        } elseif ((int) $incomingAmount !== (int) $payment->amount) {
            Log::warning('Mayar webhook: amount mismatch — not marking paid', [
                'payment_id' => $payment->id,
                'expected' => $payment->amount,
                'received' => $incomingAmount,
            ]);

            return response()->json(['message' => 'Amount mismatch'], 422);
        }

        $paidAtStr = $data['updatedAt'] ?? $data['paidAt'] ?? null;
        $paidAt = $paidAtStr ? Carbon::parse($paidAtStr) : Carbon::now();

        DB::transaction(function () use ($payment, $paidAt, $payload) {
            $payment->update([
                'status' => 'paid',
                'paid_at' => $paidAt,
                'raw_payload' => $payload,
            ]);

            $appointment = $payment->appointment;
            if (! $appointment) {
                return;
            }

            $appointment->update([
                'payment_status' => 'dp_paid',
                'status' => 'pending_approval',
                'paid_at' => $paidAt,
            ]);
        });

        return response()->json(['message' => 'Webhook processed successfully'], 200);
    }
}
