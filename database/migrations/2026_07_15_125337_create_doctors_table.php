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
        Schema::create('doctors', function (Blueprint $table) {
    $table->id();

    $table->foreignId('department_id')
          ->constrained('departments')
          ->cascadeOnDelete();

    $table->foreignId('user_id')
          ->constrained('users')
          ->cascadeOnDelete();

    $table->string('specialization', 150);
    $table->string('qualification');
    $table->integer('experience');
    $table->string('phone', 20);
    $table->string('working_days', 100);
    $table->time('start_time');
    $table->time('end_time');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
