<?php

namespace App\Http\Controllers;

use App\Actions\StoreBookingAction;
use App\Http\Requests\BookingRequest;
use App\Models\Appointment;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
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
        \App\Services\XenditPaymentService $paymentService
    ): RedirectResponse {
        $appointment = $action->handle($request);

        $paymentData = $paymentService->createDpPaymentLink($appointment);

        if ($paymentData) {
            \Illuminate\Support\Facades\DB::transaction(function () use ($appointment, $paymentData) {
                $appointment->update([
                    'xendit_external_id' => $paymentData['external_id'],
                    'xendit_invoice_id' => $paymentData['invoice_id'],
                    'xendit_invoice_url' => $paymentData['invoice_url'],
                    'invoice_expired_at' => $paymentData['expired_at'],
                ]);

                $appointment->payments()->create([
                    'provider' => 'xendit',
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
        return Inertia::render('booking/success', [
            'appointment' => $appointment->only([
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
        ]);
    }
}
