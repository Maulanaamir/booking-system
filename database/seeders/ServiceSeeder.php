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
            'name_en' => 'Relaxing Massage',
            'description' => 'Pijat relaksasi seluruh tubuh untuk mengurangi stres dan ketegangan otot',
            'description_en' => 'Full body relaxation massage to reduce stress and muscle tension',
            'duration_minutes' => 60,
            'price' => 120000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Service::create([
            'name' => 'Pijat Tradisional Indonesia',
            'name_en' => 'Traditional Indonesian Massage',
            'description' => 'Pijat tradisional khas Indonesia dengan teknik khusus',
            'description_en' => 'Traditional Indonesian massage with specialized techniques',
            'duration_minutes' => 90,
            'price' => 180000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Service::create([
            'name' => 'Fisioterapi',
            'name_en' => 'Physiotherapy',
            'description' => 'Terapi fisik untuk pemulihan cedera dan nyeri otot',
            'description_en' => 'Physical therapy for injury recovery and muscle pain relief',
            'duration_minutes' => 60,
            'price' => 150000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        Service::create([
            'name' => 'Perawatan Ibu Nifas',
            'name_en' => 'Postnatal Care',
            'description' => 'Perawatan khusus untuk ibu setelah melahirkan',
            'description_en' => 'Specialized postpartum care for new mothers',
            'duration_minutes' => 120,
            'price' => 250000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 4,
        ]);

        Service::create([
            'name' => 'Bekam',
            'name_en' => 'Cupping Therapy',
            'description' => 'Terapi bekam untuk melancarkan peredaran darah',
            'description_en' => 'Cupping therapy to improve blood circulation',
            'duration_minutes' => 45,
            'price' => 100000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 5,
        ]);

        Service::create([
            'name' => 'Ekstra Waktu 30 Menit',
            'name_en' => 'Extra Time 30 Minutes',
            'description' => 'Tambahan waktu 30 menit untuk sesi pijat',
            'description_en' => 'Additional 30 minutes of time for massage session',
            'duration_minutes' => 30,
            'price' => 50000,
            'is_main_service' => false,
            'is_active' => true,
            'sort_order' => 6,
        ]);

        Service::create([
            'name' => 'Perawatan Lansia',
            'name_en' => 'Elderly Care',
            'description' => 'Perawatan khusus untuk lanjut usia',
            'description_en' => 'Specialized care for the elderly',
            'duration_minutes' => 60,
            'price' => 130000,
            'is_main_service' => false,
            'is_active' => true,
            'sort_order' => 7,
        ]);
    }
}
