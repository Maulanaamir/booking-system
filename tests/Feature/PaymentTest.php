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

class PaymentTest extends TestCase
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

    private function pendingPayment(Appointment $appointment, array $overrides = []): Payment
    {
        return Payment::create(array_merge([
            'id' => Str::uuid()->toString(),
            'appointment_id' => $appointment->id,
            'provider' => 'xendit',
            'provider_reference_id' => 'appointment_ref_123',
            'provider_invoice_id' => 'xendit_inv_123',
            'payment_url' => 'https://checkout.xendit.co/web/xendit_inv_123',
            'amount' => 50000,
            'status' => 'pending',
        ], $overrides));
    }

    // ─── Booking store → dp_pending ──────────────────────────────────────────

    /**
     * When Xendit invoice is created successfully, the appointment's
     * payment_status must be set to "dp_pending" (not "unpaid"),
     * and a Payment record with status "pending" must be created.
     */
    public function test_booking_store_creates_appointment_with_dp_pending_when_payment_link_is_created(): void
    {
        $this->therapist();
        $service = $this->mainService();

        Config::set('services.payment.provider', 'xendit');
        Config::set('services.xendit.secret_key', 'test_secret_key');

        Http::fake([
            'https://api.xendit.co/v2/invoices' => Http::response([
                'id' => 'xendit_inv_123',
                'invoice_url' => 'https://checkout.xendit.co/web/xendit_inv_123',
                'expiry_date' => now()->addDay()->toIso8601String(),
            ], 200),
        ]);

        $response = $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$service->id],
        ]));

        $appointment = Appointment::first();
        $response->assertRedirect(route('booking.success', $appointment));

        $this->assertNotNull($appointment);
        $this->assertEquals('pending_dp', $appointment->status);
        $this->assertEquals('dp_pending', $appointment->payment_status,
            'payment_status should be dp_pending after Xendit link is created');
        $this->assertEquals('xendit_inv_123', $appointment->xendit_invoice_id);
        $this->assertNotNull($appointment->xendit_external_id);
        $this->assertNotNull($appointment->invoice_expired_at);

        $this->assertDatabaseHas('payments', [
            'appointment_id' => $appointment->id,
            'provider' => 'xendit',
            'provider_invoice_id' => 'xendit_inv_123',
            'status' => 'pending',
            'amount' => 50000,
        ]);
    }

    /**
     * When Xendit API fails, appointment is still saved with status "unpaid"
     * (no payment link was issued, so payment_status stays "unpaid").
     */
    public function test_booking_store_keeps_unpaid_when_xendit_api_fails(): void
    {
        $this->therapist();
        $service = $this->mainService();

        Config::set('services.payment.provider', 'xendit');
        Config::set('services.xendit.secret_key', 'test_secret_key');

        Http::fake([
            'https://api.xendit.co/v2/invoices' => Http::response([], 500),
        ]);

        $response = $this->post(route('booking.store'), $this->validPayload([
            'service_ids' => [$service->id],
        ]));

        $appointment = Appointment::first();
        $response->assertRedirect(route('booking.success', $appointment));

        $this->assertEquals('pending_dp', $appointment->status);
        $this->assertEquals('unpaid', $appointment->payment_status,
            'payment_status should remain unpaid when no payment link was created');
        $this->assertNull($appointment->xendit_invoice_url);
        $this->assertEquals(0, Payment::count());
    }

    // ─── Webhook paid → dp_paid + pending_approval ───────────────────────────

    /**
     * Xendit paid webhook marks Payment.status = "paid",
     * Appointment.payment_status = "dp_paid", and
     * Appointment.status = "pending_approval".
     */
    public function test_xendit_webhook_paid_marks_payment_paid_and_appointment_dp_paid_and_pending_approval(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'pending_dp',
            'payment_status' => 'dp_pending',
        ]);

        $payment = $this->pendingPayment($appointment);

        Config::set('services.xendit.callback_token', 'valid_token');

        $paidAt = now()->toIso8601String();

        $response = $this->withHeaders(['x-callback-token' => 'valid_token'])
            ->postJson(route('webhooks.xendit'), [
                'id' => 'xendit_inv_123',
                'external_id' => 'appointment_ref_123',
                'status' => 'PAID',
                'paid_amount' => 50000,
                'paid_at' => $paidAt,
            ]);

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

        // paid_at must be persisted on appointment
        $this->assertNotNull($appointment->fresh()->paid_at);
    }

    // ─── Idempotency ─────────────────────────────────────────────────────────

    /**
     * A duplicate paid webhook for an already-paid Payment must return 200
     * and not corrupt any data.
     */
    public function test_duplicate_paid_webhook_returns_200_and_does_not_corrupt_data(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'pending_approval',
            'payment_status' => 'dp_paid',
        ]);

        $payment = $this->pendingPayment($appointment, ['status' => 'paid']);

        Config::set('services.xendit.callback_token', 'valid_token');

        $response = $this->withHeaders(['x-callback-token' => 'valid_token'])
            ->postJson(route('webhooks.xendit'), [
                'id' => 'xendit_inv_123',
                'external_id' => 'appointment_ref_123',
                'status' => 'PAID',
                'paid_amount' => 50000,
            ]);

        $response->assertOk();
        $response->assertJsonPath('message', 'Payment already marked as paid');

        // Data must remain intact
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'pending_approval',
            'payment_status' => 'dp_paid',
        ]);
    }

    // ─── Invalid token → 401 ─────────────────────────────────────────────────

    /**
     * A webhook with a wrong callback token must be rejected with 401.
     */
    public function test_webhook_with_invalid_callback_token_returns_401(): void
    {
        Config::set('services.xendit.callback_token', 'valid_token');

        $response = $this->withHeaders(['x-callback-token' => 'wrong_token'])
            ->postJson(route('webhooks.xendit'), [
                'id' => 'xendit_inv_123',
                'external_id' => 'appointment_ref_123',
                'status' => 'PAID',
            ]);

        $response->assertStatus(401);
    }

    // ─── Amount mismatch → 422 ───────────────────────────────────────────────

    /**
     * When the webhook paid_amount does not match Payment.amount,
     * the request is rejected with 422 and the payment is NOT marked paid.
     */
    public function test_webhook_with_mismatched_amount_does_not_mark_payment_as_paid(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'payment_status' => 'dp_pending',
        ]);

        $payment = $this->pendingPayment($appointment); // amount = 50000

        Config::set('services.xendit.callback_token', 'valid_token');

        $response = $this->withHeaders(['x-callback-token' => 'valid_token'])
            ->postJson(route('webhooks.xendit'), [
                'id' => 'xendit_inv_123',
                'external_id' => 'appointment_ref_123',
                'status' => 'PAID',
                'paid_amount' => 1, // tampered amount
            ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Amount mismatch');

        // Payment must remain pending
        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'pending',
        ]);

        // Appointment must remain unchanged
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'payment_status' => 'dp_pending',
        ]);
    }

    /**
     * When the webhook payload has no amount field at all,
     * the payment should still be marked paid (amount check is skipped gracefully).
     */
    public function test_webhook_without_amount_field_still_marks_paid(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'payment_status' => 'dp_pending',
        ]);

        $payment = $this->pendingPayment($appointment);

        Config::set('services.xendit.callback_token', 'valid_token');

        $response = $this->withHeaders(['x-callback-token' => 'valid_token'])
            ->postJson(route('webhooks.xendit'), [
                'id' => 'xendit_inv_123',
                'external_id' => 'appointment_ref_123',
                'status' => 'PAID',
                // no paid_amount or amount field
            ]);

        $response->assertOk();

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'paid',
        ]);
    }

    // ─── Expired webhook ─────────────────────────────────────────────────────

    /**
     * Xendit expired webhook marks Payment.status = "expired" and
     * Appointment.payment_status = "expired".
     * Appointment.status must stay "pending_dp" (not downgraded further).
     */
    public function test_xendit_webhook_expired_marks_payment_expired_and_appointment_expired(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'pending_dp',
            'payment_status' => 'dp_pending',
        ]);

        $payment = $this->pendingPayment($appointment);

        Config::set('services.xendit.callback_token', 'valid_token');

        $response = $this->withHeaders(['x-callback-token' => 'valid_token'])
            ->postJson(route('webhooks.xendit'), [
                'id' => 'xendit_inv_123',
                'external_id' => 'appointment_ref_123',
                'status' => 'EXPIRED',
            ]);

        $response->assertOk();

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'expired',
        ]);

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'payment_status' => 'expired',
            'status' => 'pending_dp', // appointment.status is preserved
        ]);
    }

    // ─── Provider isolation ──────────────────────────────────────────────────

    /**
     * A payment belonging to a different provider (e.g. "mayar") must not be
     * matched by the Xendit webhook handler, even if the reference IDs match.
     */
    public function test_xendit_webhook_does_not_match_other_provider_payments(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'payment_status' => 'dp_pending',
        ]);

        // Create a payment belonging to a future provider
        Payment::create([
            'id' => Str::uuid()->toString(),
            'appointment_id' => $appointment->id,
            'provider' => 'mayar',
            'provider_reference_id' => 'appointment_ref_123',
            'provider_invoice_id' => 'xendit_inv_123',
            'payment_url' => 'https://pay.mayar.id/inv_123',
            'amount' => 50000,
            'status' => 'pending',
        ]);

        Config::set('services.xendit.callback_token', 'valid_token');

        $response = $this->withHeaders(['x-callback-token' => 'valid_token'])
            ->postJson(route('webhooks.xendit'), [
                'id' => 'xendit_inv_123',
                'external_id' => 'appointment_ref_123',
                'status' => 'PAID',
                'paid_amount' => 50000,
            ]);

        $response->assertStatus(404);
    }

    // ─── Backward-compatible: existing success-page test ─────────────────────

    public function test_success_page_receives_payment_url(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'xendit_invoice_url' => 'https://checkout.xendit.co/web/xendit_inv_123',
            'payment_status' => 'dp_pending',
        ]);

        // Create a payment record to provide the generic payment_url
        Payment::create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'appointment_id' => $appointment->id,
            'provider' => 'xendit',
            'provider_reference_id' => 'appointment_ref_123',
            'provider_invoice_id' => 'xendit_inv_123',
            'payment_url' => 'https://checkout.xendit.co/web/xendit_inv_123',
            'amount' => 50000,
            'status' => 'pending',
        ]);

        $response = $this->get(route('booking.success', $appointment));
        $response->assertOk();

        // Verify generic payment_url is served from the payments table
        $response->assertSee('payment_url', false);
        $response->assertSee('xendit_inv_123', false);
    }
}
