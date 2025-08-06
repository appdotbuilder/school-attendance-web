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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Class name (e.g., X IPA 1)');
            $table->string('grade_level')->comment('Grade level (e.g., X, XI, XII)');
            $table->string('program')->nullable()->comment('Program (IPA, IPS, etc.)');
            $table->foreignId('homeroom_teacher_id')->nullable()->constrained('users');
            $table->integer('capacity')->default(30)->comment('Maximum students');
            $table->timestamps();
            
            $table->index(['grade_level']);
            $table->index(['homeroom_teacher_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};