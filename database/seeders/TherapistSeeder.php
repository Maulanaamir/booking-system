<?php

namespace Database\Seeders;

use App\Models\Therapist;
use Illuminate\Database\Seeder;

class TherapistSeeder extends Seeder
{
    public function run(): void
    {
        Therapist::create([
            'name' => 'Terapis A',
            'phone_number' => '081111111111',
            'is_active' => true,
        ]);
    }
}
