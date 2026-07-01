<?php

namespace App\Http\Controllers;

use App\Actions\StoreBookingAction;
use App\Http\Requests\BookingRequest;
use App\Models\Appointment;
use App\Models\Service;
use App\Services\MayarPaymentService;
use App\Services\XenditPaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function show(): Response
    {
        $services = Service::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'name_en', 'description', 'description_en', 'duration_minutes', 'price', 'is_main_service']);

        return Inertia::render('booking/show', [
            'services' => $services,
        ]);
    }

    public function store(
        BookingRequest $request,
        StoreBookingAction $action,
        MayarPaymentService $mayarService,
        XenditPaymentService $xenditService
    ): RedirectResponse {
        $appointment = $action->handle($request);

        $provider = config('services.payment.provider', 'mayar');

        $paymentData = match ($provider) {
            'xendit' => $xenditService->createDpPaymentLink($appointment),
            default => $mayarService->createDpPaymentLink($appointment),
        };

        if ($paymentData) {
            DB::transaction(function () use ($appointment, $paymentData, $provider) {
                $updateData = [
                    'payment_status' => 'dp_pending',
                    'invoice_expired_at' => $paymentData['expired_at'],
                ];

                // Keep xendit-specific columns populated when using xendit
                if ($provider === 'xendit') {
                    $updateData['xendit_external_id'] = $paymentData['external_id'];
                    $updateData['xendit_invoice_id'] = $paymentData['invoice_id'];
                    $updateData['xendit_invoice_url'] = $paymentData['invoice_url'];
                }

                $appointment->update($updateData);

                $appointment->payments()->create([
                    'provider' => $provider,
                    'provider_reference_id' => $paymentData['external_id'],
                    'provider_invoice_id' => $paymentData['invoice_id'],
                    'payment_url' => $paymentData['invoice_url'],
                    'amount' => $appointment->dp_amount,
                    'currency' => 'IDR',
                    'status' => 'pending',
                    'expired_at' => $paymentData['expired_at'],
                ]);
            });
        }

        return to_route('booking.success', $appointment);
    }

    public function success(Appointment $appointment): Response
    {
        // Load latest pending/paid payment for the generic payment URL
        $latestPayment = $appointment->payments()
            ->whereIn('status', ['pending', 'paid'])
            ->latest()
            ->first();

        return Inertia::render('booking/success', [
            'appointment' => array_merge(
                $appointment->only([
                    'id',
                    'start_at',
                    'service_end_at',
                    'total_price',
                    'dp_amount',
                    'remaining_payment',
                    'status',
                    'payment_status',
                    'xendit_invoice_url',
                ]),
                [
                    'payment_url' => $latestPayment?->payment_url,
                    'payment_provider' => $latestPayment?->provider,
                    'payment_expired_at' => $latestPayment?->expired_at,
                ],
            ),
        ]);
    }
}
