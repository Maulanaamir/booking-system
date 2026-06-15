<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Service;
use App\Models\Therapist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    // ─── Shared helpers ──────────────────────────────────────────────────────

    private function therapist(): Therapist
    {
        return Therapist::factory()->create(['is_active' => true]);
    }

    private function mainService(array $overrides = []): Service
    {
        return Service::factory()->create(array_merge([
            'is_main_service' => true,
            'is_active' => true,
            'price' => 150000,
            'duration_minutes' => 60,
        ], $overrides));
    }

    private function addonService(array $overrides = []): Service
    {
        return Service::factory()->create(array_merge([
            'is_main_service' => false,
            'is_active' => true,
            'price' => 50000,
            'duration_minutes' => 30,
        ], $overrides));
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'service_ids' => [],
            'date' => now()->addDay()->format('Y-m-d'),
            'time' => '09:00',
            'name' => 'Budi Santoso',
            'phone_number' => '081234567890',
            'address' => 'Jl. Melati No. 10, Jakarta Selatan',
            'maps_url' => null,
            'location_note' => null,
            'customer_note' => null,
            'latitude' => null,
            'longitude' => null,
        ], $overrides);
    }

    // ─── Booking page ────────────────────────────────────────────────────────

    public function test_booking_page_loads(): void
    {
        $this->therapist();
        $service = $this->mainService(['name' => 'Pijat Relaksasi']);

        $this->get(route('booking.show'))
            ->assertOk()
            ->assertSee($service->name);
    }

    public function test_inactive_services_are_not_shown_on_booking_page(): void
    {
        $this->therapist();
        Service::factory()->create(['name' => 'Hidden Service', 'is_active' => false]);

        $this->get(route('booking.show'))
            ->assertOk()
            ->assertDontSee('Hidden Service');
    }

    // ─── Validation: services ────────────────────────────────────────────────

    public function test_booking_requires_at_least_one_service(): void
    {
        $this->therapist();
        $payload = $this->validPayload(['service_ids' => []]);

        $this->post(route('booking.store'), $payload)
            ->assertSessionHasErrors('service_ids');
    }

    public function test_booking_rejects_add_on_service_booked_alone(): void
    {
        $this->therapist();
        $addon = $this->addonService();
        $payload = $this->validPayload(['service_ids' => [$addon->id]]);

        $this->post(route('booking.store'), $payload)
            ->assertSessionHasErrors('service_ids');
    }

    public function test_booking_rejects_inactive_service_id(): void
    {
        $this->therapist();
        $inactive = Service::factory()->create(['is_active' => false, 'is_main_service' => true]);
        $payload = $this->validPayload(['service_ids' => [$inactive->id]]);

        $this->post(route('booking.store'), $payload)
            ->assertSessionHasErrors('service_ids.0');
    }

    public function test_booking_rejects_duplicate_service_ids(): void
    {
        $this->therapist();
        $service = $this->mainService();
        $payload = $this->validPayload(['service_ids' => [$service->id, $service->id]]);

        $this->post(route('booking.store'), $payload)
            ->assertSessionHasErrors('service_ids.1');
    }

    public function test_booking_accepts_main_service_alone(): void
    {
        $this->therapist();
        $main = $this->mainService();
        $payload = $this->validPayload(['service_ids' => [$main->id]]);

        $this->post(route('booking.store'), $payload)
            ->assertRedirect();

        $this->assertDatabaseHas('appointments', ['status' => 'pending_dp']);
    }

    public function test_booking_accepts_main_service_with_addon(): void
    {
        $this->therapist();
        $main = $this->mainService();
        $addon = $this->addonService();
        $payload = $this->validPayload(['service_ids' => [$main->id, $addon->id]]);

        $this->post(route('booking.store'), $payload)
            ->assertRedirect();

        $this->assertDatabaseCount('appointment_services', 2);
    }

    // ─── Validation: date/time ───────────────────────────────────────────────

    public function test_booking_rejects_past_date(): void
    {
        $this->therapist();
        $main = $this->mainService();
        $payload = $this->validPayload([
            'service_ids' => [$main->id],
            'date' => now()->subDay()->format('Y-m-d'),
        ]);

        $this->post(route('booking.store'), $payload)
            ->assertSessionHasErrors('date');
    }

    public function test_booking_requires_address(): void
    {
        $this->therapist();
        $main = $this->mainService();
        $payload = $this->validPayload(['service_ids' => [$main->id], 'address' => '']);

        $this->post(route('booking.store'), $payload)
            ->assertSessionHasErrors('address');
    }

    // ─── Appointment creation ────────────────────────────────────────────────

    public function test_booking_creates_appointment_with_correct_fields(): void
    {
        $this->therapist();
        $main = $this->mainService(['price' => 150000]);
        $payload = $this->validPayload(['service_ids' => [$main->id]]);

        $response = $this->post(route('booking.store'), $payload);
        $response->assertRedirect();

        $this->assertDatabaseHas('appointments', [
            'status' => 'pending_dp',
            'payment_status' => 'unpaid',
            'service_total_price' => 150000,
            'transport_fee' => 0,
            'total_price' => 150000,
            'dp_amount' => 50000,
            'remaining_payment' => 100000,
        ]);
    }

    public function test_booking_sets_pending_dp_status_and_unpaid_payment(): void
    {
        $this->therapist();
        $main = $this->mainService();
        $payload = $this->validPayload(['service_ids' => [$main->id]]);

        $this->post(route('booking.store'), $payload);

        $this->assertDatabaseHas('appointments', [
            'status' => 'pending_dp',
            'payment_status' => 'unpaid',
        ]);
    }

    public function test_booking_calculates_pricing_for_multiple_services(): void
    {
        $this->therapist();
        $main = $this->mainService(['price' => 150000]);
        $addon = $this->addonService(['price' => 50000]);
        $payload = $this->validPayload(['service_ids' => [$main->id, $addon->id]]);

        $this->post(route('booking.store'), $payload);

        $this->assertDatabaseHas('appointments', [
            'service_total_price' => 200000,
            'transport_fee' => 0,
            'total_price' => 200000,
            'dp_amount' => 50000,
            'remaining_payment' => 150000,
        ]);
    }

    // ─── Service snapshots ───────────────────────────────────────────────────

    public function test_booking_creates_appointment_service_snapshots(): void
    {
        $this->therapist();
        $main = $this->mainService([
            'name' => 'Pijat Relaksasi',
            'price' => 120000,
            'duration_minutes' => 60,
        ]);
        $payload = $this->validPayload(['service_ids' => [$main->id]]);

        $this->post(route('booking.store'), $payload);

        $this->assertDatabaseHas('appointment_services', [
            'service_name_snapshot' => 'Pijat Relaksasi',
            'price_snapshot' => 120000,
            'duration_minutes_snapshot' => 60,
            'is_main_service_snapshot' => true,
        ]);
    }

    public function test_snapshot_stores_service_data_at_booking_time(): void
    {
        $this->therapist();
        $main = $this->mainService(['name' => 'Original Name', 'price' => 100000]);
        $payload = $this->validPayload(['service_ids' => [$main->id]]);

        $this->post(route('booking.store'), $payload);

        // Update the service AFTER booking — snapshot must not change
        $main->update(['name' => 'Changed Name', 'price' => 999999]);

        $this->assertDatabaseHas('appointment_services', [
            'service_name_snapshot' => 'Original Name',
            'price_snapshot' => 100000,
        ]);
        $this->assertDatabaseMissing('appointment_services', [
            'service_name_snapshot' => 'Changed Name',
        ]);
    }

    // ─── Customer reuse ──────────────────────────────────────────────────────

    public function test_booking_creates_new_customer(): void
    {
        $this->therapist();
        $main = $this->mainService();
        $payload = $this->validPayload(['service_ids' => [$main->id], 'phone_number' => '081111111111']);

        $this->post(route('booking.store'), $payload);

        $this->assertDatabaseHas('customers', ['phone_number' => '081111111111']);
        $this->assertDatabaseCount('customers', 1);
    }

    public function test_booking_reuses_existing_customer_by_phone(): void
    {
        $this->therapist();
        $main = $this->mainService();
        $phone = '081222222222';

        // First booking
        $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$main->id],
            'phone_number' => $phone,
        ]));

        // Second booking — same phone
        $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$main->id],
            'phone_number' => $phone,
            'date' => now()->addDays(7)->format('Y-m-d'),
        ]));

        $this->assertDatabaseCount('customers', 1);
        $this->assertDatabaseCount('appointments', 2);
    }

    public function test_booking_updates_customer_name_on_rebook(): void
    {
        $this->therapist();
        $main = $this->mainService();
        $phone = '081333333333';

        $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$main->id],
            'phone_number' => $phone,
            'name' => 'Old Name',
        ]));

        $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$main->id],
            'phone_number' => $phone,
            'name' => 'New Name',
            'date' => now()->addDays(7)->format('Y-m-d'),
        ]));

        $this->assertDatabaseHas('customers', ['phone_number' => $phone, 'name' => 'New Name']);
        $this->assertDatabaseMissing('customers', ['name' => 'Old Name']);
    }

    // ─── Snapshots are independent of customer updates ───────────────────────

    public function test_location_snapshot_is_stored_on_appointment(): void
    {
        $this->therapist();
        $main = $this->mainService();
        $payload = $this->validPayload([
            'service_ids' => [$main->id],
            'address' => 'Jl. Mangga No. 5',
            'maps_url' => 'https://maps.google.com/?q=-6.2,106.8',
            'location_note' => 'Blue gate',
            'latitude' => -6.2111,
            'longitude' => 106.8111,
        ]);

        $this->post(route('booking.store'), $payload);

        $this->assertDatabaseHas('appointments', [
            'customer_address_snapshot' => 'Jl. Mangga No. 5',
            'customer_latitude_snapshot' => -6.2111,
            'customer_longitude_snapshot' => 106.8111,
            'customer_maps_url_snapshot' => 'https://www.google.com/maps?q=-6.2111,106.8111',
            'customer_location_note_snapshot' => 'Blue gate',
        ]);

        $this->assertDatabaseHas('customers', [
            'default_address' => 'Jl. Mangga No. 5',
            'default_latitude' => -6.2111,
            'default_longitude' => 106.8111,
            'default_maps_url' => 'https://www.google.com/maps?q=-6.2111,106.8111',
            'default_location_note' => 'Blue gate',
        ]);
    }

    public function test_location_snapshot_fallback_to_submitted_maps_url_if_no_coordinates(): void
    {
        $this->therapist();
        $main = $this->mainService();
        $payload = $this->validPayload([
            'service_ids' => [$main->id],
            'address' => 'Jl. Mangga No. 5',
            'maps_url' => 'https://maps.google.com/?q=-6.2,106.8',
            'latitude' => null,
            'longitude' => null,
        ]);

        $this->post(route('booking.store'), $payload);

        $this->assertDatabaseHas('appointments', [
            'customer_address_snapshot' => 'Jl. Mangga No. 5',
            'customer_latitude_snapshot' => null,
            'customer_longitude_snapshot' => null,
            'customer_maps_url_snapshot' => 'https://maps.google.com/?q=-6.2,106.8',
        ]);
    }

    // ─── Schedule conflict ───────────────────────────────────────────────────

    public function test_booking_rejects_conflicting_time_slot(): void
    {
        $therapist = $this->therapist();
        $main = $this->mainService(['duration_minutes' => 60]);

        $date = now()->addDay()->format('Y-m-d');

        // First booking at 09:00
        $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$main->id],
            'date' => $date,
            'time' => '09:00',
        ]))->assertRedirect();

        // Second booking at 09:30 — overlaps (first runs 09:00–10:00 + 60min buffer = blocked until 11:00)
        $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$main->id],
            'date' => $date,
            'time' => '09:30',
        ]))->assertSessionHasErrors('date');
    }

    public function test_booking_allows_non_conflicting_time_slot(): void
    {
        $therapist = $this->therapist();
        $main = $this->mainService(['duration_minutes' => 60]);

        $date = now()->addDay()->format('Y-m-d');

        // First booking at 09:00 → service 10:00 + buffer 60min → blocked until 11:00
        $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$main->id],
            'date' => $date,
            'time' => '09:00',
        ]))->assertRedirect();

        // Second booking at 11:00 → no overlap
        $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$main->id],
            'date' => $date,
            'time' => '11:00',
            'phone_number' => '081999999999',
        ]))->assertRedirect();

        $this->assertDatabaseCount('appointments', 2);
    }

    public function test_cancelled_appointment_does_not_block_slot(): void
    {
        $therapist = $this->therapist();
        $main = $this->mainService(['duration_minutes' => 60]);

        $date = now()->addDay()->format('Y-m-d');

        // Create a cancelled appointment directly
        $customer = Customer::factory()->create();
        Appointment::factory()->create([
            'therapist_id' => $therapist->id,
            'customer_id' => $customer->id,
            'status' => 'cancelled',
            'start_at' => now()->addDay()->setTimeFromTimeString('09:00'),
            'service_end_at' => now()->addDay()->setTimeFromTimeString('10:00'),
            'blocked_until_at' => now()->addDay()->setTimeFromTimeString('11:00'),
        ]);

        // New booking in same slot should succeed
        $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$main->id],
            'date' => $date,
            'time' => '09:30',
            'phone_number' => '081888888888',
        ]))->assertRedirect();
    }

    // ─── Success page ────────────────────────────────────────────────────────

    public function test_success_page_loads(): void
    {
        $therapist = $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'therapist_id' => $therapist->id,
            'customer_id' => $customer->id,
        ]);

        $this->get(route('booking.success', $appointment))
            ->assertOk();
    }
}
