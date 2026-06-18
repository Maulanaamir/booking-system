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
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

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
            'address' => 'Jl. Melati No. 10, Jakarta Selatan',
            'maps_url' => null,
            'location_note' => null,
            'customer_note' => null,
            'latitude' => null,
            'longitude' => null,
        ], $overrides);
    }

    /**
     * Test booking creates appointment as pending_dp/unpaid,
     * and a payment record is created when Xendit service succeeds.
     */
    public function test_booking_creates_appointment_and_payment_record_on_success(): void
    {
        $this->therapist();
        $service = $this->mainService();

        Config::set('services.xendit.secret_key', 'test_secret_key');

        Http::fake([
            'https://api.xendit.co/v2/invoices' => Http::response([
                'id' => 'xendit_inv_123',
                'invoice_url' => 'https://checkout.xendit.co/web/xendit_inv_123',
                'expiry_date' => now()->addDay()->toIso8601String(),
            ], 200),
        ]);

        $payload = $this->validPayload(['service_ids' => [$service->id]]);

        $response = $this->post(route('booking.store'), $payload);

        $appointment = Appointment::first();

        $response->assertRedirect(route('booking.success', $appointment));

        $this->assertNotNull($appointment);
        $this->assertEquals('pending_dp', $appointment->status);
        $this->assertEquals('unpaid', $appointment->payment_status);
        $this->assertEquals('xendit_inv_123', $appointment->xendit_invoice_id);
        $this->assertEquals('https://checkout.xendit.co/web/xendit_inv_123', $appointment->xendit_invoice_url);

        $this->assertDatabaseHas('payments', [
            'appointment_id' => $appointment->id,
            'provider' => 'xendit',
            'provider_invoice_id' => 'xendit_inv_123',
            'payment_url' => 'https://checkout.xendit.co/web/xendit_inv_123',
            'status' => 'pending',
            'amount' => 50000,
        ]);
    }

    /**
     * Test booking page success receives and shows payment URL.
     */
    public function test_success_page_receives_payment_url(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'xendit_invoice_url' => 'https://checkout.xendit.co/web/xendit_inv_123',
            'payment_status' => 'unpaid',
        ]);

        $response = $this->get(route('booking.success', $appointment));
        $response->assertOk();

        // Inertia page should contain the payment URL in properties
        $response->assertSee('https://checkout.xendit.co/web/xendit_inv_123');
    }

    /**
     * Test Xendit API failure does not crash appointment booking creation,
     * and shows fallback instructions on the success page.
     */
    public function test_xendit_api_failure_does_not_fail_booking_creation(): void
    {
        $this->therapist();
        $service = $this->mainService();

        Config::set('services.xendit.secret_key', 'test_secret_key');

        // Force a mock failure (status 500)
        Http::fake([
            'https://api.xendit.co/v2/invoices' => Http::response([], 500),
        ]);

        $payload = $this->validPayload(['service_ids' => [$service->id]]);

        $response = $this->post(route('booking.store'), $payload);

        $appointment = Appointment::first();
        $response->assertRedirect(route('booking.success', $appointment));

        // Appointment is still saved
        $this->assertNotNull($appointment);
        $this->assertEquals('pending_dp', $appointment->status);
        $this->assertEquals('unpaid', $appointment->payment_status);
        $this->assertNull($appointment->xendit_invoice_url);

        // No payment record created
        $this->assertEquals(0, Payment::count());

        // Get success page to verify fallback messages
        $successResponse = $this->get(route('booking.success', $appointment));
        $successResponse->assertOk();
        $successResponse->assertSee('Link pembayaran otomatis belum tersedia');
    }

    /**
     * Test webhook with valid token marks payment as paid.
     */
    public function test_webhook_with_valid_token_marks_payment_as_paid(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'payment_status' => 'unpaid',
        ]);

        $payment = Payment::create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'appointment_id' => $appointment->id,
            'provider' => 'xendit',
            'provider_reference_id' => 'appointment_ref_123',
            'provider_invoice_id' => 'xendit_inv_123',
            'payment_url' => 'https://checkout.xendit.co/web/xendit_inv_123',
            'amount' => 50000,
            'status' => 'pending',
        ]);

        Config::set('services.xendit.callback_token', 'valid_token');

        $payload = [
            'id' => 'xendit_inv_123',
            'external_id' => 'appointment_ref_123',
            'status' => 'PAID',
            'paid_amount' => 50000,
            'paid_at' => now()->toIso8601String(),
        ];

        $response = $this->withHeaders([
            'x-callback-token' => 'valid_token',
        ])->postJson(route('webhooks.xendit'), $payload);

        $response->assertOk();
        $response->assertJsonPath('message', 'Webhook processed successfully');

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'paid',
        ]);

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'payment_status' => 'paid',
            'status' => 'pending_dp', // Webhook must NOT confirm booking automatically
        ]);
    }

    /**
     * Test webhook with invalid token is rejected.
     */
    public function test_webhook_with_invalid_token_is_rejected(): void
    {
        Config::set('services.xendit.callback_token', 'valid_token');

        $response = $this->withHeaders([
            'x-callback-token' => 'wrong_token',
        ])->postJson(route('webhooks.xendit'), [
            'id' => 'xendit_inv_123',
            'external_id' => 'appointment_ref_123',
            'status' => 'PAID',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test duplicate webhooks are safe and handled idempotently.
     */
    public function test_webhook_duplicate_remains_safe(): void
    {
        $this->therapist();
        $customer = Customer::factory()->create();
        $appointment = Appointment::factory()->create([
            'customer_id' => $customer->id,
            'payment_status' => 'paid', // already paid
        ]);

        $payment = Payment::create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'appointment_id' => $appointment->id,
            'provider' => 'xendit',
            'provider_reference_id' => 'appointment_ref_123',
            'provider_invoice_id' => 'xendit_inv_123',
            'payment_url' => 'https://checkout.xendit.co/web/xendit_inv_123',
            'amount' => 50000,
            'status' => 'paid', // already marked paid
        ]);

        Config::set('services.xendit.callback_token', 'valid_token');

        $response = $this->withHeaders([
            'x-callback-token' => 'valid_token',
        ])->postJson(route('webhooks.xendit'), [
            'id' => 'xendit_inv_123',
            'external_id' => 'appointment_ref_123',
            'status' => 'PAID',
        ]);

        $response->assertOk();
        $response->assertJsonPath('message', 'Payment already marked as paid');
    }
}
