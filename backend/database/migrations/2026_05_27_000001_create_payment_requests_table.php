<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payment_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');

            $table->decimal('amount', 14, 2);
            $table->string('description')->nullable();
            $table->string('requested_as')->nullable();

            $table->string('status')->default('pending');

            $table->timestamps();

            $table->index('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });


    }

    public function down(): void
    {
        Schema::dropIfExists('payment_requests');
    }
};

