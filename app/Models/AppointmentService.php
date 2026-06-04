<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'appointment_id',
    'service_id',
    'service_name_snapshot',
    'duration_minutes_snapshot',
    'price_snapshot',
    'is_main_service_snapshot',
])]
class AppointmentService extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_main_service_snapshot' => 'boolean',
        ];
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
