<?php

namespace App\Http\Requests;

use App\Models\Service;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class BookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_ids' => ['required', 'array', 'min:1'],
            'service_ids.*' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('services', 'id')->where('is_active', true),
            ],
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'time' => ['required', 'date_format:H:i'],
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:1000'],
            'maps_url' => ['nullable', 'url', 'max:2048'],
            'location_note' => ['nullable', 'string', 'max:1000'],
            'customer_note' => ['nullable', 'string', 'max:1000'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }


    /**
     * Add the main-service rule as an after-validation hook.
     * Runs only after the base rules pass, so service IDs are already
     * confirmed to be valid active service IDs.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($validator->errors()->has('service_ids')) {
                return; // base rules already failed, no point checking further
            }

            $ids = $this->input('service_ids', []);

            $hasMain = Service::whereIn('id', $ids)
                ->where('is_active', true)
                ->where('is_main_service', true)
                ->exists();

            if (! $hasMain) {
                $validator->errors()->add(
                    'service_ids',
                    'Please select at least one main service. Add-on services cannot be booked alone.',
                );
            }
        });
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'service_ids.required' => 'Please select at least one service.',
            'service_ids.min' => 'Please select at least one service.',
            'service_ids.*.exists' => 'One or more selected services are unavailable.',
            'service_ids.*.distinct' => 'Duplicate services are not allowed.',
            'date.after_or_equal' => 'Booking date must be today or in the future.',
            'date.date_format' => 'Invalid date format.',
            'time.date_format' => 'Invalid time format.',
        ];
    }
}
