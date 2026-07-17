<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('my_cards', function (Blueprint $table) {
            // Transfer limit for this linked card
            $table->decimal('transfer_limit', 18, 2)->default(0)->after('routing_number');
        });
    }

    public function down(): void
    {
        Schema::table('my_cards', function (Blueprint $table) {
            $table->dropColumn('transfer_limit');
        });
    }
};

