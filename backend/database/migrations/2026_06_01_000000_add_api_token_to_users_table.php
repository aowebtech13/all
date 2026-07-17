<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Backward compatibility: some legacy auth code expects users.api_token
        // (deployment error: Unknown column 'api_token' in 'WHERE').
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'api_token')) {
                $table->string('api_token', 255)->nullable()->index();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'api_token')) {
                $table->dropColumn('api_token');
            }
        });
    }
};

