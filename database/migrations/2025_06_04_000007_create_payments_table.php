<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('appointment_id')->constrained()->cascadeOnDelete();
            $table->string('provider')->default('xendit');
            $table->string('provider_reference_id');
            $table->string('provider_invoice_id')->nullable();
            $table->text('payment_url')->nullable();
            $table->integer('amount');
            $table->string('currency')->default('IDR');
            $table->string('status')->default('pending'); // pending, paid, expired, failed, cancelled
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->json('raw_payload')->nullable();
            $table->timestamps();

            $table->unique(['provider', 'provider_reference_id']);
            $table->index('provider_invoice_id');
            $table->index('appointment_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
