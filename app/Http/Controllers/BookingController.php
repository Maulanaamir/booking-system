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
            ->get(['id', 'name', 'description', 'duration_minutes', 'price', 'is_main_service']);

        return Inertia::render('booking/show', [
            'services' => $services,
        ]);
    }

    public function store(BookingRequest $request, StoreBookingAction $action): RedirectResponse
    {
        $appointment = $action->handle($request);

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
            ]),
        ]);
    }
}
