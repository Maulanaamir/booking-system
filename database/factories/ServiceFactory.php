<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'description' => fake()->optional()->sentence(),
            'duration_minutes' => fake()->randomElement([60, 90, 120]),
            'price' => fake()->numberBetween(80000, 300000),
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }

    public function addon(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_main_service' => false,
        ]);
    }
}
