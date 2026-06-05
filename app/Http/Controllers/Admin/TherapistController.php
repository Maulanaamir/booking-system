<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TherapistRequest;
use App\Models\Therapist;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TherapistController extends Controller
{
    public function index(): Response
    {
        $therapists = Therapist::orderBy('name')->get();

        return Inertia::render('admin/therapists/index', [
            'therapists' => $therapists,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/therapists/create');
    }

    public function store(TherapistRequest $request): RedirectResponse
    {
        Therapist::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Therapist created.')]);

        return to_route('admin.therapists.index');
    }

    public function edit(Therapist $therapist): Response
    {
        return Inertia::render('admin/therapists/edit', [
            'therapist' => $therapist,
        ]);
    }

    public function update(TherapistRequest $request, Therapist $therapist): RedirectResponse
    {
        $therapist->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Therapist updated.')]);

        return to_route('admin.therapists.index');
    }

    public function toggleActive(Therapist $therapist): RedirectResponse
    {
        $therapist->update([
            'is_active' => ! $therapist->is_active,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Therapist updated.')]);

        return back();
    }
}
