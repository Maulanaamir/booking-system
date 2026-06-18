<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/booking', [BookingController::class, 'show'])->name('booking.show');
Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');
Route::get('/booking/success/{appointment}', [BookingController::class, 'success'])->name('booking.success');
Route::post('/webhooks/xendit', [\App\Http\Controllers\Webhooks\XenditWebhookController::class, 'handle'])->name('webhooks.xendit');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $stats = [
            'total_appointments' => \App\Models\Appointment::count(),
            'pending_approval_count' => \App\Models\Appointment::where('status', 'pending_approval')->count(),
            'pending_dp_count' => \App\Models\Appointment::where('status', 'pending_dp')->count(),
            'confirmed_count' => \App\Models\Appointment::where('status', 'confirmed')->count(),
            'completed_count' => \App\Models\Appointment::where('status', 'completed')->count(),
        ];

        $upcoming = \App\Models\Appointment::with(['customer', 'therapist'])
            ->whereIn('status', ['pending_approval', 'pending_dp', 'confirmed'])
            ->orderBy('start_at', 'asc')
            ->take(5)
            ->get();

        return \Inertia\Inertia::render('dashboard', [
            'stats' => $stats,
            'upcomingAppointments' => $upcoming,
        ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
