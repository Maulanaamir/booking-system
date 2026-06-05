<?php

namespace Tests\Feature\Admin;

use App\Models\Therapist;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class TherapistTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_therapist_pages()
    {
        $this->get(route('admin.therapists.index'))->assertRedirect(route('login'));
        $this->get(route('admin.therapists.create'))->assertRedirect(route('login'));
        $this->post(route('admin.therapists.store'))->assertRedirect(route('login'));
    }

    public function test_guest_cannot_access_therapist_detail_pages()
    {
        $therapist = Therapist::create([
            'name' => 'Temp Therapist',
            'phone_number' => '+62 812 0000 0000',
            'is_active' => true,
        ]);

        $this->get(route('admin.therapists.edit', $therapist))->assertRedirect(route('login'));
        $this->patch(route('admin.therapists.update', $therapist))->assertRedirect(route('login'));
        $this->patch(route('admin.therapists.toggle-active', $therapist))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_therapist_list()
    {
        $user = User::factory()->create();

        Therapist::create([
            'name' => 'Siti Aminah',
            'phone_number' => '+62 812 1234 5678',
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->get(route('admin.therapists.index'))
            ->assertOk()
            ->assertSee('Siti Aminah');
    }

    public function test_authenticated_user_can_view_create_form()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.therapists.create'))
            ->assertOk();
    }

    public function test_authenticated_user_can_create_therapist()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('admin.therapists.store'), [
                'name' => 'Budi Santoso',
                'phone_number' => '+62 811 9999 8888',
            ])
            ->assertRedirect(route('admin.therapists.index'));

        $this->assertDatabaseHas('therapists', [
            'name' => 'Budi Santoso',
            'phone_number' => '+62 811 9999 8888',
            'is_active' => true,
        ]);
    }

    public function test_create_therapist_requires_name()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('admin.therapists.store'), [
                'name' => '',
                'phone_number' => '+62 812 0000 0000',
            ])
            ->assertSessionHasErrors('name');
    }

    public function test_create_therapist_requires_phone_number()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('admin.therapists.store'), [
                'name' => 'Test Therapist',
                'phone_number' => '',
            ])
            ->assertSessionHasErrors('phone_number');
    }

    public function test_authenticated_user_can_view_edit_form()
    {
        $user = User::factory()->create();
        $therapist = Therapist::create([
            'name' => 'Edit Me',
            'phone_number' => '+62 813 5555 6666',
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->get(route('admin.therapists.edit', $therapist))
            ->assertOk()
            ->assertSee('Edit Me');
    }

    public function test_authenticated_user_can_update_therapist()
    {
        $user = User::factory()->create();
        $therapist = Therapist::create([
            'name' => 'Original Name',
            'phone_number' => '+62 814 1111 2222',
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->patch(route('admin.therapists.update', $therapist), [
                'name' => 'Updated Name',
                'phone_number' => '+62 814 3333 4444',
                'is_active' => false,
            ])
            ->assertRedirect(route('admin.therapists.index'));

        $this->assertDatabaseHas('therapists', [
            'id' => $therapist->id,
            'name' => 'Updated Name',
            'phone_number' => '+62 814 3333 4444',
            'is_active' => false,
        ]);
    }

    public function test_authenticated_user_can_toggle_therapist_active()
    {
        $user = User::factory()->create();
        $therapist = Therapist::create([
            'name' => 'Togglable',
            'phone_number' => '+62 815 7777 8888',
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->patch(route('admin.therapists.toggle-active', $therapist))
            ->assertRedirect();

        $this->assertDatabaseHas('therapists', [
            'id' => $therapist->id,
            'is_active' => false,
        ]);
    }

    public function test_toggle_active_reverts_on_second_call()
    {
        $user = User::factory()->create();
        $therapist = Therapist::create([
            'name' => 'Toggle Twice',
            'phone_number' => '+62 816 0000 1111',
            'is_active' => false,
        ]);

        $this->actingAs($user)
            ->patch(route('admin.therapists.toggle-active', $therapist));
        $this->assertDatabaseHas('therapists', ['id' => $therapist->id, 'is_active' => true]);

        $this->actingAs($user)
            ->patch(route('admin.therapists.toggle-active', $therapist));
        $this->assertDatabaseHas('therapists', ['id' => $therapist->id, 'is_active' => false]);
    }

    public function test_therapist_is_not_hard_deleted()
    {
        $this->assertFalse(
            Route::has('admin.therapists.destroy'),
            'The destroy route must not exist — therapists should not be hard deleted.'
        );
    }
}
