<?php

namespace Tests\Feature\Admin;

use App\Models\Appointment;
use App\Models\AppointmentService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AppointmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_appointment_list(): void
    {
        $this->get(route('admin.appointments.index'))->assertRedirect(route('login'));
    }

    public function test_guest_cannot_access_appointment_show(): void
    {
        $appointment = Appointment::factory()->create();

        $this->get(route('admin.appointments.show', $appointment))->assertRedirect(route('login'));
        $this->patch(route('admin.appointments.update-status', $appointment))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_appointment_list(): void
    {
        $user = User::factory()->create();
        $appointment = Appointment::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.appointments.index'))
            ->assertOk()
            ->assertSee($appointment->customer->name);
    }

    public function test_appointment_list_is_paginated(): void
    {
        $user = User::factory()->create();
        Appointment::factory()->count(3)->create();

        $this->actingAs($user)
            ->get(route('admin.appointments.index'))
            ->assertOk();
    }

    public function test_authenticated_user_can_view_appointment_detail(): void
    {
        $user = User::factory()->create();
        $appointment = Appointment::factory()->create();
        AppointmentService::factory()->for($appointment)->create();

        $this->actingAs($user)
            ->get(route('admin.appointments.show', $appointment))
            ->assertOk()
            ->assertSee($appointment->customer->name)
            ->assertSee($appointment->therapist->name);
    }

    public function test_appointment_detail_shows_appointment_services(): void
    {
        $user = User::factory()->create();
        $appointment = Appointment::factory()->create();
        AppointmentService::factory()->for($appointment)->create([
            'service_name_snapshot' => 'Swedish Massage',
        ]);

        $this->actingAs($user)
            ->get(route('admin.appointments.show', $appointment))
            ->assertOk()
            ->assertSee('Swedish Massage');
    }

    public function test_authenticated_user_can_update_appointment_status(): void
    {
        $user = User::factory()->create();
        $appointment = Appointment::factory()->create(['status' => 'pending_dp']);

        $this->actingAs($user)
            ->patch(route('admin.appointments.update-status', $appointment), [
                'status' => 'confirmed',
            ])
            ->assertRedirect(route('admin.appointments.show', $appointment));

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_update_status_rejects_invalid_value(): void
    {
        $user = User::factory()->create();
        $appointment = Appointment::factory()->create();

        $this->actingAs($user)
            ->patch(route('admin.appointments.update-status', $appointment), [
                'status' => 'in_progress',
            ])
            ->assertSessionHasErrors('status');
    }

    public function test_update_status_rejects_empty_value(): void
    {
        $user = User::factory()->create();
        $appointment = Appointment::factory()->create();

        $this->actingAs($user)
            ->patch(route('admin.appointments.update-status', $appointment), [
                'status' => '',
            ])
            ->assertSessionHasErrors('status');
    }

    public function test_update_status_accepts_all_allowed_values(): void
    {
        $user = User::factory()->create();
        $allowedStatuses = [
            'pending_approval',
            'pending_dp',
            'confirmed',
            'completed',
            'cancelled',
            'expired',
        ];

        foreach ($allowedStatuses as $status) {
            $appointment = Appointment::factory()->create();

            $this->actingAs($user)
                ->patch(route('admin.appointments.update-status', $appointment), [
                    'status' => $status,
                ])
                ->assertRedirect();

            $this->assertDatabaseHas('appointments', [
                'id' => $appointment->id,
                'status' => $status,
            ]);
        }
    }

    public function test_update_status_does_not_change_payment_status(): void
    {
        $user = User::factory()->create();
        $appointment = Appointment::factory()->create([
            'status' => 'pending_dp',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAs($user)
            ->patch(route('admin.appointments.update-status', $appointment), [
                'status' => 'confirmed',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'confirmed',
            'payment_status' => 'unpaid',
        ]);
    }

    public function test_appointment_has_no_destroy_route(): void
    {
        $this->assertFalse(
            Route::has('admin.appointments.destroy'),
            'The destroy route must not exist — appointments should not be hard deleted.',
        );
    }
}
