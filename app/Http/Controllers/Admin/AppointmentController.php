<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AppointmentStatusRequest;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Appointment::with(['customer', 'therapist']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('customer', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('phone_number', 'like', "%{$search}%");
                })->orWhereHas('therapist', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('date')) {
            $query->whereDate('start_at', $request->input('date'));
        }

        $appointments = $query->orderBy('start_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/appointments/index', [
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'status', 'date']),
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
