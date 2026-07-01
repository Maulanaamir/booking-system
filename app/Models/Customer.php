<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'phone_number', 'email', 'default_address', 'default_latitude', 'default_longitude', 'default_maps_url', 'default_location_note'])]
class Customer extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'default_latitude' => 'decimal:7',
            'default_longitude' => 'decimal:7',
        ];
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
