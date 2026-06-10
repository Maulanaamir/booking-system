<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AppointmentStatusRequest;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function index(): Response
    {
        $appointments = Appointment::with(['customer', 'therapist'])
            ->orderBy('start_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/appointments/index', [
            'appointments' => $appointments,
        ]);
    }

    public function show(Appointment $appointment): Response
    {
        $appointment->load(['customer', 'therapist', 'appointmentServices']);

        return Inertia::render('admin/appointments/show', [
            'appointment' => $appointment,
        ]);
    }

    public function updateStatus(AppointmentStatusRequest $request, Appointment $appointment): RedirectResponse
    {
        $appointment->update(['status' => $request->validated('status')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Appointment status updated.')]);

        return to_route('admin.appointments.show', $appointment);
    }
}
