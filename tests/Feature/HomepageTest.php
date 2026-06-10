<?php

namespace Tests\Feature;

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomepageTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_loads_successfully(): void
    {
        $this->get(route('home'))->assertOk();
    }

    public function test_active_main_services_are_shown(): void
    {
        Service::factory()->create([
            'name' => 'Pijat Relaksasi',
            'is_active' => true,
            'is_main_service' => true,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertSee('Pijat Relaksasi');
    }

    public function test_inactive_services_are_not_shown(): void
    {
        Service::factory()->create([
            'name' => 'Inactive Service',
            'is_active' => false,
            'is_main_service' => true,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertDontSee('Inactive Service');
    }

    public function test_addon_services_are_not_shown(): void
    {
        Service::factory()->create([
            'name' => 'Ekstra Waktu',
            'is_active' => true,
            'is_main_service' => false,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertDontSee('Ekstra Waktu');
    }

    public function test_booking_cta_link_to_booking_page_exists(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertSee('/booking');
    }
}
