<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $services = Service::where('is_active', true)
            ->where('is_main_service', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'name_en', 'description', 'description_en', 'duration_minutes', 'price']);

        return Inertia::render('welcome', [
            'services' => $services,
        ]);
    }
}
