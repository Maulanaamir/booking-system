<?php

use App\Http\Controllers\Admin\AppointmentController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\TherapistController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('services', [ServiceController::class, 'index'])->name('services.index');
    Route::get('services/create', [ServiceController::class, 'create'])->name('services.create');
    Route::post('services', [ServiceController::class, 'store'])->name('services.store');
    Route::get('services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit');
    Route::patch('services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::patch('services/{service}/toggle-active', [ServiceController::class, 'toggleActive'])->name('services.toggle-active');

    Route::get('therapists', [TherapistController::class, 'index'])->name('therapists.index');
    Route::get('therapists/create', [TherapistController::class, 'create'])->name('therapists.create');
    Route::post('therapists', [TherapistController::class, 'store'])->name('therapists.store');
    Route::get('therapists/{therapist}/edit', [TherapistController::class, 'edit'])->name('therapists.edit');
    Route::patch('therapists/{therapist}', [TherapistController::class, 'update'])->name('therapists.update');
    Route::patch('therapists/{therapist}/toggle-active', [TherapistController::class, 'toggleActive'])->name('therapists.toggle-active');

    Route::get('appointments', [AppointmentController::class, 'index'])->name('appointments.index');
    Route::get('appointments/{appointment}', [AppointmentController::class, 'show'])->name('appointments.show');
    Route::patch('appointments/{appointment}/status', [AppointmentController::class, 'updateStatus'])->name('appointments.update-status');
});
