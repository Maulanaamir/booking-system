<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('customer_id')->constrained()->restrictOnDelete();
            $table->foreignId('therapist_id')->constrained()->restrictOnDelete();
            $table->dateTime('start_at');
            $table->dateTime('service_end_at');
            $table->integer('buffer_minutes')->default(60);
            $table->dateTime('blocked_until_at');
            $table->integer('service_total_price');
            $table->integer('transport_fee')->default(0);
            $table->integer('total_price');
            $table->integer('dp_amount')->default(50000);
            $table->integer('remaining_payment');
            $table->string('status')->default('pending_dp');
            $table->string('payment_status')->default('unpaid');
            $table->string('payment_method')->nullable();
            $table->string('xendit_external_id')->nullable();
            $table->string('xendit_invoice_id')->nullable();
            $table->string('xendit_invoice_url')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('invoice_expired_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamp('approval_expired_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->string('approval_token')->nullable();
            $table->text('customer_address_snapshot');
            $table->decimal('customer_latitude_snapshot', 10, 7)->nullable();
            $table->decimal('customer_longitude_snapshot', 10, 7)->nullable();
            $table->string('customer_maps_url_snapshot')->nullable();
            $table->text('customer_location_note_snapshot')->nullable();
            $table->text('customer_note')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('payment_status');
            $table->index('start_at');
            $table->index(['therapist_id', 'start_at']);
            $table->index('customer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
