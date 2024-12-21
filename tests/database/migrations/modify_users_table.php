<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->after('password', function (Blueprint $table) {
                $table->string('email_code_authentication_secret')->nullable();
                $table->string('google_two_factor_authentication_secret')->nullable();
                $table->text('google_two_factor_authentication_recovery_codes')->nullable();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'email_code_authentication_secret',
                'google_two_factor_authentication_secret',
                'google_two_factor_authentication_recovery_codes',
            ]);
        });
    }
};
