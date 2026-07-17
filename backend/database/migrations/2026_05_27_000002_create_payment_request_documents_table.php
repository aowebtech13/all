<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payment_request_documents', function (Blueprint $table) {

            $table->id();
            $table->unsignedBigInteger('payment_request_id');

            $table->string('file_path');
            $table->string('original_name');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->nullable();

            $table->timestamps();

            $table->index('payment_request_id');
            $table->foreign('payment_request_id')
                ->references('id')
                ->on('payment_requests')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_request_documents');
    }
};

