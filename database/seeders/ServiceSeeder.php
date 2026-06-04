<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        Service::create([
            'name' => 'Pijat Relaksasi',
            'description' => 'Pijat relaksasi seluruh tubuh untuk mengurangi stres dan ketegangan otot',
            'duration_minutes' => 60,
            'price' => 120000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Service::create([
            'name' => 'Pijat Tradisional Indonesia',
            'description' => 'Pijat tradisional khas Indonesia dengan teknik khusus',
            'duration_minutes' => 90,
            'price' => 180000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Service::create([
            'name' => 'Fisioterapi',
            'description' => 'Terapi fisik untuk pemulihan cedera dan nyeri otot',
            'duration_minutes' => 60,
            'price' => 150000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        Service::create([
            'name' => 'Perawatan Ibu Nifas',
            'description' => 'Perawatan khusus untuk ibu setelah melahirkan',
            'duration_minutes' => 120,
            'price' => 250000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 4,
        ]);

        Service::create([
            'name' => 'Bekam',
            'description' => 'Terapi bekam untuk melancarkan peredaran darah',
            'duration_minutes' => 45,
            'price' => 100000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 5,
        ]);

        Service::create([
            'name' => 'Ekstra Waktu 30 Menit',
            'description' => 'Tambahan waktu 30 menit untuk sesi pijat',
            'duration_minutes' => 30,
            'price' => 50000,
            'is_main_service' => false,
            'is_active' => true,
            'sort_order' => 6,
        ]);

        Service::create([
            'name' => 'Perawatan Lansia',
            'description' => 'Perawatan khusus untuk lanjut usia',
            'duration_minutes' => 60,
            'price' => 130000,
            'is_main_service' => false,
            'is_active' => true,
            'sort_order' => 7,
        ]);
    }
}
