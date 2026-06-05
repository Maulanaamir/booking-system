<?php

namespace Tests\Feature\Admin;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_service_pages()
    {
        $this->get(route('admin.services.index'))->assertRedirect(route('login'));
        $this->get(route('admin.services.create'))->assertRedirect(route('login'));
        $this->post(route('admin.services.store'))->assertRedirect(route('login'));
    }

    public function test_guest_cannot_access_service_detail_pages()
    {
        $service = Service::create([
            'name' => 'Temp Service',
            'duration_minutes' => 60,
            'price' => 100000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 0,
        ]);

        $this->get(route('admin.services.edit', $service))->assertRedirect(route('login'));
        $this->patch(route('admin.services.update', $service))->assertRedirect(route('login'));
        $this->patch(route('admin.services.toggle-active', $service))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_service_list()
    {
        $user = User::factory()->create();

        Service::create([
            'name' => 'Test Massage',
            'description' => 'A relaxing test massage',
            'duration_minutes' => 60,
            'price' => 150000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $this->actingAs($user)
            ->get(route('admin.services.index'))
            ->assertOk()
            ->assertSee('Test Massage')
            ->assertSee('150000');
    }

    public function test_authenticated_user_can_view_create_form()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.services.create'))
            ->assertOk();
    }

    public function test_authenticated_user_can_create_service()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('admin.services.store'), [
                'name' => 'New Service',
                'description' => 'Service description',
                'duration_minutes' => 45,
                'price' => 100000,
                'is_main_service' => true,
                'sort_order' => 5,
            ])
            ->assertRedirect(route('admin.services.index'));

        $this->assertDatabaseHas('services', [
            'name' => 'New Service',
            'duration_minutes' => 45,
            'price' => 100000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 5,
        ]);
    }

    public function test_create_service_requires_name()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('admin.services.store'), [
                'name' => '',
                'duration_minutes' => 60,
                'price' => 100000,
                'is_main_service' => true,
            ])
            ->assertSessionHasErrors('name');
    }

    public function test_create_service_requires_valid_duration()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('admin.services.store'), [
                'name' => 'Test',
                'duration_minutes' => 0,
                'price' => 100000,
                'is_main_service' => true,
            ])
            ->assertSessionHasErrors('duration_minutes');
    }

    public function test_create_service_requires_positive_price()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('admin.services.store'), [
                'name' => 'Test',
                'duration_minutes' => 60,
                'price' => -1,
                'is_main_service' => true,
            ])
            ->assertSessionHasErrors('price');
    }

    public function test_authenticated_user_can_view_edit_form()
    {
        $user = User::factory()->create();
        $service = Service::create([
            'name' => 'Edit Me',
            'duration_minutes' => 60,
            'price' => 200000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $this->actingAs($user)
            ->get(route('admin.services.edit', $service))
            ->assertOk()
            ->assertSee('Edit Me');
    }

    public function test_authenticated_user_can_update_service()
    {
        $user = User::factory()->create();
        $service = Service::create([
            'name' => 'Original Name',
            'duration_minutes' => 60,
            'price' => 200000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        $this->actingAs($user)
            ->patch(route('admin.services.update', $service), [
                'name' => 'Updated Name',
                'description' => 'Updated description',
                'duration_minutes' => 90,
                'price' => 250000,
                'is_main_service' => false,
                'is_active' => false,
                'sort_order' => 10,
            ])
            ->assertRedirect(route('admin.services.index'));

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'duration_minutes' => 90,
            'price' => 250000,
            'is_main_service' => false,
            'is_active' => false,
            'sort_order' => 10,
        ]);
    }

    public function test_authenticated_user_can_toggle_service_active()
    {
        $user = User::factory()->create();
        $service = Service::create([
            'name' => 'Togglable',
            'duration_minutes' => 60,
            'price' => 100000,
            'is_main_service' => true,
            'is_active' => true,
            'sort_order' => 4,
        ]);

        $this->actingAs($user)
            ->patch(route('admin.services.toggle-active', $service))
            ->assertRedirect();

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'is_active' => false,
        ]);
    }

    public function test_toggle_active_reverts_on_second_call()
    {
        $user = User::factory()->create();
        $service = Service::create([
            'name' => 'Toggle Twice',
            'duration_minutes' => 60,
            'price' => 100000,
            'is_main_service' => true,
            'is_active' => false,
            'sort_order' => 5,
        ]);

        $this->actingAs($user)
            ->patch(route('admin.services.toggle-active', $service));
        $this->assertDatabaseHas('services', ['id' => $service->id, 'is_active' => true]);

        $this->actingAs($user)
            ->patch(route('admin.services.toggle-active', $service));
        $this->assertDatabaseHas('services', ['id' => $service->id, 'is_active' => false]);
    }
}
