<?php

namespace App\Actions;

use App\Http\Requests\BookingRequest;
use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Service;
use App\Models\Therapist;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StoreBookingAction
{
    private const DP_AMOUNT = 50000;

    private const TRANSPORT_FEE = 0;

    private const BUFFER_MINUTES = 60;

    private const NON_CONFLICTING_STATUSES = ['cancelled', 'expired'];

    public function handle(BookingRequest $request): Appointment
    {
        return DB::transaction(function () use ($request) {
            // 1. Load the requested active services
            $serviceIds = $request->validated('service_ids');

            /** @var Collection<int, Service> $services */
            $services = Service::whereIn('id', $serviceIds)
                ->where('is_active', true)
                ->get();

            // 2. Resolve the first active therapist
            $therapist = Therapist::where('is_active', true)
                ->orderBy('id')
                ->firstOrFail();

            // 3. Parse the requested start time using app timezone
            $startAt = Carbon::createFromFormat(
                'Y-m-d H:i',
                $request->validated('date').' '.$request->validated('time'),
                config('app.timezone'),
            );

            // 4. Calculate service end and blocked-until times
            $totalDurationMinutes = $services->sum('duration_minutes');
            $serviceEndAt = $startAt->copy()->addMinutes($totalDurationMinutes);
            $blockedUntilAt = $serviceEndAt->copy()->addMinutes(self::BUFFER_MINUTES);

            // 5. Check for schedule conflicts on this therapist
            $this->checkConflict($therapist->id, $startAt, $blockedUntilAt);

            // 6. Calculate pricing
            $serviceTotal = $services->sum('price');
            $transportFee = self::TRANSPORT_FEE;
            $totalPrice = $serviceTotal + $transportFee;
            $dpAmount = self::DP_AMOUNT;
            $remainingPayment = $totalPrice - $dpAmount;

            // 7. Create or update customer
            $customer = Customer::updateOrCreate(
                ['phone_number' => $request->validated('phone_number')],
                [
                    'name' => $request->validated('name'),
                    'default_address' => $request->validated('address'),
                    'default_maps_url' => $request->validated('maps_url'),
                    'default_location_note' => $request->validated('location_note'),
                ],
            );

            // 8. Create the appointment
            $appointment = Appointment::create([
                'customer_id' => $customer->id,
                'therapist_id' => $therapist->id,
                'start_at' => $startAt,
                'service_end_at' => $serviceEndAt,
                'buffer_minutes' => self::BUFFER_MINUTES,
                'blocked_until_at' => $blockedUntilAt,
                'service_total_price' => $serviceTotal,
                'transport_fee' => $transportFee,
                'total_price' => $totalPrice,
                'dp_amount' => $dpAmount,
                'remaining_payment' => $remainingPayment,
                'status' => 'pending_dp',
                'payment_status' => 'unpaid',
                'customer_address_snapshot' => $request->validated('address'),
                'customer_maps_url_snapshot' => $request->validated('maps_url'),
                'customer_location_note_snapshot' => $request->validated('location_note'),
                'customer_note' => $request->validated('customer_note'),
            ]);

            // 9. Create appointment service snapshot rows
            foreach ($services as $service) {
                $appointment->appointmentServices()->create([
                    'service_id' => $service->id,
                    'service_name_snapshot' => $service->name,
                    'duration_minutes_snapshot' => $service->duration_minutes,
                    'price_snapshot' => $service->price,
                    'is_main_service_snapshot' => $service->is_main_service,
                ]);
            }

            return $appointment;
        });
    }

    /**
     * Throw a ValidationException if the therapist already has a booking
     * that overlaps with [startAt, blockedUntilAt).
     */
    private function checkConflict(int $therapistId, Carbon $startAt, Carbon $blockedUntilAt): void
    {
        $conflict = Appointment::where('therapist_id', $therapistId)
            ->whereNotIn('status', self::NON_CONFLICTING_STATUSES)
            ->where('start_at', '<', $blockedUntilAt)
            ->where('blocked_until_at', '>', $startAt)
            ->exists();

        if ($conflict) {
            throw ValidationException::withMessages([
                'date' => 'The selected time slot is already taken. Please choose a different date or time.',
            ]);
        }
    }
}
