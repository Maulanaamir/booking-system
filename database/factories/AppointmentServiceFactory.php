<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\AppointmentService;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AppointmentService>
 */
class AppointmentServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'appointment_id' => Appointment::factory(),
            'service_id' => Service::factory(),
            'service_name_snapshot' => fake()->words(3, true),
            'duration_minutes_snapshot' => fake()->randomElement([60, 90, 120]),
            'price_snapshot' => fake()->numberBetween(80000, 300000),
            'is_main_service_snapshot' => true,
        ];
    }

    public function addon(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_main_service_snapshot' => false,
        ]);
    }
}
