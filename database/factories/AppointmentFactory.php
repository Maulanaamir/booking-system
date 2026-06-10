<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Therapist;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startAt = fake()->dateTimeBetween('+1 day', '+30 days');
        $serviceEndAt = (clone $startAt)->modify('+60 minutes');
        $bufferMinutes = 60;
        $blockedUntilAt = (clone $serviceEndAt)->modify("+{$bufferMinutes} minutes");
        $serviceTotal = fake()->numberBetween(100000, 500000);
        $transportFee = fake()->randomElement([0, 20000, 30000, 50000]);
        $total = $serviceTotal + $transportFee;
        $dp = 50000;

        return [
            'customer_id' => Customer::factory(),
            'therapist_id' => Therapist::factory(),
            'start_at' => $startAt,
            'service_end_at' => $serviceEndAt,
            'buffer_minutes' => $bufferMinutes,
            'blocked_until_at' => $blockedUntilAt,
            'service_total_price' => $serviceTotal,
            'transport_fee' => $transportFee,
            'total_price' => $total,
            'dp_amount' => $dp,
            'remaining_payment' => $total - $dp,
            'status' => 'pending_dp',
            'payment_status' => 'unpaid',
            'payment_method' => null,
            'xendit_external_id' => null,
            'xendit_invoice_id' => null,
            'xendit_invoice_url' => null,
            'paid_at' => null,
            'invoice_expired_at' => null,
            'approved_at' => null,
            'rejected_at' => null,
            'approval_expired_at' => null,
            'rejection_reason' => null,
            'approval_token' => null,
            'customer_address_snapshot' => fake()->address(),
            'customer_latitude_snapshot' => null,
            'customer_longitude_snapshot' => null,
            'customer_maps_url_snapshot' => null,
            'customer_location_note_snapshot' => null,
            'customer_note' => null,
            'admin_note' => null,
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
            'payment_status' => 'dp_paid',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'payment_status' => 'fully_paid',
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    public function withMapsUrl(): static
    {
        return $this->state(fn (array $attributes) => [
            'customer_maps_url_snapshot' => 'https://maps.google.com/?q=-6.2088,106.8456',
        ]);
    }
}
