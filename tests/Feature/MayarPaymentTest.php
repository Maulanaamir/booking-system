<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\Service;
use App\Models\Therapist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

class MayarPaymentTest extends TestCase
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

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'service_ids' => [],
            'date' => now()->addDay()->format('Y-m-d'),
            'time' => '09:00',
            'name' => 'Budi Santoso',
            'phone_number' => '081234567890',
            'email' => 'budi@example.com',
            'address' => 'Jl. Melati No. 10, Jakarta Selatan',
            'maps_url' => null,
            'location_note' => null,
            'customer_note' => null,
            'latitude' => null,
            'longitude' => null,
        ], $overrides);
    }

    private function pendingMayarPayment(Appointment $appointment, array $overrides = []): Payment
    {
        return Payment::create(array_merge([
            'id' => Str::uuid()->toString(),
            'appointment_id' => $appointment->id,
            'provider' => 'mayar',
            'provider_reference_id' => 'mayar_txn_123',
            'provider_invoice_id' => 'mayar_inv_123',
            'payment_url' => 'https://pay.mayar.id/invoice/mayar_inv_123',
            'amount' => 50000,
            'status' => 'pending',
        ], $overrides));
    }

    // ─── Booking store with Mayar provider ────────────────────────────────────

    /**
     * When PAYMENT_PROVIDER=mayar and Mayar API succeeds,
     * the appointment gets payment_status=dp_pending and a Payment record with provider=mayar.
     */
    public function test_booking_with_mayar_provider_creates_dp_pending_and_mayar_payment_record(): void
    {
        $this->therapist();
        $service = $this->mainService();

        Config::set('services.payment.provider', 'mayar');
        Config::set('services.mayar.api_key', 'test_mayar_key');
        Config::set('services.mayar.base_url', 'https://api.mayar.id/hl/v1');

        Http::fake([
            'https://api.mayar.id/hl/v1/invoice/create' => Http::response([
                'statusCode' => 200,
                'data' => [
                    'id' => 'mayar_inv_123',
                    'transactionId' => 'mayar_txn_123',
                    'link' => 'https://pay.mayar.id/invoice/mayar_inv_123',
                    'expiredAt' => now()->addDay()->toIso8601String(),
                ],
            ], 200),
        ]);

        $response = $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$service->id],
        ]));

        $appointment = Appointment::first();
        $response->assertRedirect(route('booking.success', $appointment));

        $this->assertNotNull($appointment);
        $this->assertEquals('pending_dp', $appointment->status);
        $this->assertEquals('dp_pending', $appointment->payment_status);

        // Xendit-specific columns should be null for Mayar provider
        $this->assertNull($appointment->xendit_invoice_id);
        $this->assertNull($appointment->xendit_invoice_url);

        $this->assertDatabaseHas('payments', [
            'appointment_id' => $appointment->id,
            'provider' => 'mayar',
            'provider_invoice_id' => 'mayar_inv_123',
            'provider_reference_id' => 'mayar_txn_123',
            'payment_url' => 'https://pay.mayar.id/invoice/mayar_inv_123',
            'status' => 'pending',
            'amount' => 50000,
        ]);
    }

    /**
     * When Mayar API fails, appointment is saved with payment_status=unpaid
     * and no payment record is created.
     */
    public function test_booking_with_mayar_api_failure_keeps_unpaid(): void
    {
        $this->therapist();
        $service = $this->mainService();

        Config::set('services.payment.provider', 'mayar');
        Config::set('services.mayar.api_key', 'test_mayar_key');
        Config::set('services.mayar.base_url', 'https://api.mayar.id/hl/v1');

        Http::fake([
            'https://api.mayar.id/hl/v1/invoice/create' => Http::response([], 500),
        ]);

        $response = $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$service->id],
        ]));

        $appointment = Appointment::first();
        $response->assertRedirect(route('booking.success', $appointment));

        $this->assertEquals('pending_dp', $appointment->status);
        $this->assertEquals('unpaid', $appointment->payment_status);
        $this->assertEquals(0, Payment::count());
    }

    // ─── Email validation ────────────────────────────────────────────────────

    /**
     * Booking request requires email field.
     */
    public function test_booking_validation_requires_email(): void
    {
        $this->therapist();
        $service = $this->mainService();

        $payload = $this->validPayload([
            'service_ids' => [$service->id],
            'email' => '', // empty email
        ]);

        $response = $this->post(route('booking.store'), $payload);
        $response->assertSessionHasErrors('email');
    }

    /**
     * Invalid email format is rejected.
     */
    public function test_booking_validation_rejects_invalid_email(): void
    {
        $this->therapist();
        $service = $this->mainService();

        $payload = $this->validPayload([
            'service_ids' => [$service->id],
            'email' => 'not-an-email',
        ]);

        $response = $this->post(route('booking.store'), $payload);
        $response->assertSessionHasErrors('email');
    }

    /**
     * Customer email is stored when booking is created.
     */
    public function test_booking_stores_customer_email(): void
    {
        $this->therapist();
        $service = $this->mainService();

        Config::set('services.payment.provider', 'mayar');
        Config::set('services.mayar.api_key', '');

        $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$service->id],
            'email' => 'test@example.com',
        ]));

        $this->assertDatabaseHas('customers', [
            'phone_number' => '081234567890',
            'email' => 'test@example.com',
        ]);
    }

    // ─── Mayar webhook: token validation ─────────────────────────────────────

    /**
     * Mayar webhook with invalid token returns 401.
     */
    public function test_mayar_webhook_invalid_token_returns_401(): void
    {
        Config::set('services.mayar.webhook_secret', 'valid_secret');

        $response = $this->postJson(
            route('webhooks.mayar', ['token' => 'wrong_secret']),
            ['event' => 'payment.received', 'data' => ['id' => 'test']],
        );

        $response->assertStatus(401);
    }

    /**
     * Mayar webhook with missing token returns 401.
     */
    public function test_mayar_webhook_missing_token_returns_401(): void
    {
        Config::set('services.mayar.webhook_secret', 'valid_secret');

        $response = $this->postJson(
            route('webhooks.mayar'),
            ['event' => 'payment.received', 'data' => ['id' => 'test']],
        );

        $response->assertStatus(401);
    }

    // ─── Mayar webhook: payment.received marks paid ──────────────────────────

    /**
     * Mayar payment.received webhook marks Payment=paid, Appointment dp_paid + pending_approval.
     */
    public function test_mayar_webhook_payment_received_marks_paid_and_dp_paid(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'pending_dp',
            'payment_status' => 'dp_pending',
        ]);

        $payment = $this->pendingMayarPayment($appointment);

        Config::set('services.mayar.webhook_secret', 'valid_secret');

        $response = $this->postJson(
            route('webhooks.mayar', ['token' => 'valid_secret']),
            [
                'event' => 'payment.received',
                'data' => [
                    'id' => 'mayar_inv_123',
                    'transactionId' => 'mayar_txn_123',
                    'amount' => 50000,
                    'updatedAt' => now()->toIso8601String(),
                ],
            ],
        );

        $response->assertOk();
        $response->assertJsonPath('message', 'Webhook processed successfully');

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'paid',
        ]);

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'payment_status' => 'dp_paid',
            'status' => 'pending_approval',
        ]);

        $this->assertNotNull($appointment->fresh()->paid_at);
    }

    // ─── Mayar webhook: idempotency ──────────────────────────────────────────

    /**
     * Duplicate payment.received webhook returns 200 without corrupting data.
     */
    public function test_mayar_duplicate_paid_webhook_returns_200_without_corruption(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'pending_approval',
            'payment_status' => 'dp_paid',
        ]);

        $payment = $this->pendingMayarPayment($appointment, ['status' => 'paid']);

        Config::set('services.mayar.webhook_secret', 'valid_secret');

        $response = $this->postJson(
            route('webhooks.mayar', ['token' => 'valid_secret']),
            [
                'event' => 'payment.received',
                'data' => [
                    'id' => 'mayar_inv_123',
                    'transactionId' => 'mayar_txn_123',
                    'amount' => 50000,
                ],
            ],
        );

        $response->assertOk();
        $response->assertJsonPath('message', 'Payment already marked as paid');

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'pending_approval',
            'payment_status' => 'dp_paid',
        ]);
    }

    // ─── Mayar webhook: amount mismatch ──────────────────────────────────────

    /**
     * Amount mismatch returns 422 and does not mark payment as paid.
     */
    public function test_mayar_webhook_amount_mismatch_returns_422(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'payment_status' => 'dp_pending',
        ]);

        $payment = $this->pendingMayarPayment($appointment); // amount = 50000

        Config::set('services.mayar.webhook_secret', 'valid_secret');

        $response = $this->postJson(
            route('webhooks.mayar', ['token' => 'valid_secret']),
            [
                'event' => 'payment.received',
                'data' => [
                    'id' => 'mayar_inv_123',
                    'transactionId' => 'mayar_txn_123',
                    'amount' => 1, // tampered
                ],
            ],
        );

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Amount mismatch');

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'payment_status' => 'dp_pending',
        ]);
    }

    // ─── Mayar webhook: provider isolation ───────────────────────────────────

    /**
     * Mayar webhook does not match Xendit provider payments.
     */
    public function test_mayar_webhook_does_not_match_xendit_payments(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'payment_status' => 'dp_pending',
        ]);

        // Create a Xendit payment with same reference IDs
        Payment::create([
            'id' => Str::uuid()->toString(),
            'appointment_id' => $appointment->id,
            'provider' => 'xendit',
            'provider_reference_id' => 'mayar_txn_123',
            'provider_invoice_id' => 'mayar_inv_123',
            'payment_url' => 'https://checkout.xendit.co/web/test',
            'amount' => 50000,
            'status' => 'pending',
        ]);

        Config::set('services.mayar.webhook_secret', 'valid_secret');

        $response = $this->postJson(
            route('webhooks.mayar', ['token' => 'valid_secret']),
            [
                'event' => 'payment.received',
                'data' => [
                    'id' => 'mayar_inv_123',
                    'transactionId' => 'mayar_txn_123',
                    'amount' => 50000,
                ],
            ],
        );

        $response->assertStatus(404);
    }

    // ─── Success page: generic payment_url ───────────────────────────────────

    /**
     * Success page receives generic payment_url from the payments table,
     * not dependent on xendit_invoice_url.
     */
    public function test_success_page_receives_generic_payment_url(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'payment_status' => 'dp_pending',
        ]);

        Payment::create([
            'id' => Str::uuid()->toString(),
            'appointment_id' => $appointment->id,
            'provider' => 'mayar',
            'provider_reference_id' => 'mayar_txn_abc',
            'provider_invoice_id' => 'mayar_inv_abc',
            'payment_url' => 'https://pay.mayar.id/invoice/mayar_inv_abc',
            'amount' => 50000,
            'status' => 'pending',
        ]);

        $response = $this->get(route('booking.success', $appointment));
        $response->assertOk();

        // The payment URL should appear in the Inertia page data
        $response->assertSee('payment_url', false);
        $response->assertSee('mayar_inv_abc', false);
    }

    // ─── Mayar webhook: extraData.appointmentId matching ─────────────────────

    /**
     * Mayar webhook can find payment via extraData.appointmentId.
     */
    public function test_mayar_webhook_matches_by_appointment_id_in_extra_data(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'pending_dp',
            'payment_status' => 'dp_pending',
        ]);

        $payment = $this->pendingMayarPayment($appointment, [
            'provider_reference_id' => 'different_ref',
            'provider_invoice_id' => 'different_inv',
        ]);

        Config::set('services.mayar.webhook_secret', 'valid_secret');

        $response = $this->postJson(
            route('webhooks.mayar', ['token' => 'valid_secret']),
            [
                'event' => 'payment.received',
                'data' => [
                    'id' => 'some_random_id',
                    'amount' => 50000,
                    'extraData' => [
                        'appointmentId' => $appointment->id,
                    ],
                ],
            ],
        );

        $response->assertOk();
        $response->assertJsonPath('message', 'Webhook processed successfully');

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'paid',
        ]);
    }

    /**
     * Mayar webhook can find payment via top-level extraData.appointmentId.
     */
    public function test_mayar_webhook_matches_by_top_level_appointment_id_in_extra_data(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'pending_dp',
            'payment_status' => 'dp_pending',
        ]);

        $payment = $this->pendingMayarPayment($appointment, [
            'provider_reference_id' => 'different_ref',
            'provider_invoice_id' => 'different_inv',
        ]);

        Config::set('services.mayar.webhook_secret', 'valid_secret');

        $response = $this->postJson(
            route('webhooks.mayar', ['token' => 'valid_secret']),
            [
                'event' => 'payment.received',
                'extraData' => [
                    'appointmentId' => $appointment->id,
                ],
                'data' => [
                    'id' => 'some_random_id',
                    'amount' => 50000,
                ],
            ],
        );

        $response->assertOk();
        $response->assertJsonPath('message', 'Webhook processed successfully');

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'paid',
        ]);
    }
}
