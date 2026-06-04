<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'customer_id',
    'therapist_id',
    'start_at',
    'service_end_at',
    'buffer_minutes',
    'blocked_until_at',
    'service_total_price',
    'transport_fee',
    'total_price',
    'dp_amount',
    'remaining_payment',
    'status',
    'payment_status',
    'payment_method',
    'xendit_external_id',
    'xendit_invoice_id',
    'xendit_invoice_url',
    'paid_at',
    'invoice_expired_at',
    'approved_at',
    'rejected_at',
    'approval_expired_at',
    'rejection_reason',
    'approval_token',
    'customer_address_snapshot',
    'customer_latitude_snapshot',
    'customer_longitude_snapshot',
    'customer_maps_url_snapshot',
    'customer_location_note_snapshot',
    'customer_note',
    'admin_note',
])]
class Appointment extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'service_end_at' => 'datetime',
            'blocked_until_at' => 'datetime',
            'paid_at' => 'datetime',
            'invoice_expired_at' => 'datetime',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'approval_expired_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function therapist(): BelongsTo
    {
        return $this->belongsTo(Therapist::class);
    }

    public function appointmentServices(): HasMany
    {
        return $this->hasMany(AppointmentService::class);
    }
}
