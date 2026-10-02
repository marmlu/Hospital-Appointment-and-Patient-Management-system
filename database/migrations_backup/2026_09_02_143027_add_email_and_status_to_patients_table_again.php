<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->string('email', 150)
                ->nullable()
                ->after('phone');

            $table->enum('status', [
                'Check-up',
                'Admitted',
                'Discharged'
            ])
                ->default('Check-up')
                ->after('emergency_contact');
        });
    }

    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn(['email', 'status']);
        });
    }
};