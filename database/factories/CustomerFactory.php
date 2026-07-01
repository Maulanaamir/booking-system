<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'phone_number' => fake()->unique()->numerify('+628##########'),
            'email' => fake()->unique()->safeEmail(),
            'default_address' => fake()->address(),
            'default_latitude' => null,
            'default_longitude' => null,
            'default_maps_url' => null,
            'default_location_note' => null,
        ];
    }
}
