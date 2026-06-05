## Project-Specific Rules

This project is a web-based homecare therapist booking system.

### Current MVP Focus

The current focus is building the web core first:

1. Database foundation
2. Admin Services CRUD
3. Admin Therapists CRUD
4. Admin Appointments list/detail
5. Customer booking flow
6. Location picker
7. Payment placeholder / Xendit later
8. WhatsApp notification later

Do not jump ahead to payment, WhatsApp notification, or customer booking flow unless explicitly requested.

### Business Rules

- Customers use guest checkout. Do not require customer registration or login.
- Admin authentication is handled by Laravel Fortify.
- Do not create manual auth controllers.
- Services and therapists must not be hard deleted.
- Use `is_active` to activate/deactivate services and therapists.
- Appointment history must be preserved.
- Do not use cascade delete from customers, therapists, or services into appointments.
- Only child rows like `appointment_services` may cascade when an appointment is deleted.
- Money fields are stored as integers in Indonesian Rupiah, not decimal.
- Status fields are stored as strings, not database enums, for SQLite test compatibility.
- Do not add extra tables or fields unless explicitly approved.

### Services Rules

Services have:

- `name`
- `description`
- `duration_minutes`
- `price`
- `is_main_service`
- `is_active`
- `sort_order`

Rules:

- `is_main_service = true` means the service can be booked by itself.
- `is_main_service = false` means the service is an add-on and cannot be booked alone.
- Services are deactivated using `is_active`, not deleted.

### Therapists Rules

Therapists have:

- `name`
- `phone_number`
- `is_active`

Rules:

- Therapists are deactivated using `is_active`, not deleted.
- Do not add unique database constraints to `therapists.phone_number` unless explicitly requested.
- Do not add therapist email, bio, or extra profile fields unless explicitly requested.

### Appointments Rules

Appointments use UUID primary keys.

Important appointment fields include:

- `start_at`
- `service_end_at`
- `buffer_minutes`
- `blocked_until_at`
- `service_total_price`
- `transport_fee`
- `total_price`
- `dp_amount`
- `remaining_payment`
- `status`
- `payment_status`
- location snapshot fields
- payment placeholder fields
- approval placeholder fields

Rules:

- `start_at` is the start time of the service.
- `service_end_at` is the real service end time before buffer.
- `blocked_until_at` is the time slot blocked until after service + buffer.
- Do not replace these with generic `start_time` / `end_time`.
- Store customer address and location as snapshots on the appointment.
- Do not rely only on the customers table for appointment location history.

### Location Rules

Customer booking will later include:

- address text
- latitude
- longitude
- Google Maps URL
- location note / landmark

The worker should be able to open the customer location in Google Maps from the admin appointment detail page.

Do not implement advanced maps or geocoding until requested.

### Payment Rules

Payment integration is not implemented yet.

For now:

- Keep payment-related columns in the database.
- Do not call Xendit API.
- Do not create Xendit webhook routes.
- Do not create payment controllers unless explicitly requested.

Planned payment concept:

- Customer pays fixed DP.
- Remaining payment is paid manually to the therapist.
- No automatic refund system in the MVP.

### WhatsApp Rules

WhatsApp notification is not implemented yet.

Do not integrate Fonnte, Wablas, WhatsApp API, or magic links unless explicitly requested.

### AI Coding Workflow Rules

When working with AI agents:

1. Plan first.
2. Wait for approval.
3. Implement only the approved small scope.
4. Run tests, typecheck, lint, and formatting.
5. Summarize changed files.
6. Commit after each successful milestone.

Never implement multiple large modules in one step.