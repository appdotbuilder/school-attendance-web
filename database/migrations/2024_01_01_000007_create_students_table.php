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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nisn')->unique()->comment('Nomor Induk Siswa Nasional');
            $table->string('student_id_number')->unique()->comment('School student ID');
            $table->foreignId('class_id')->constrained('classes');
            $table->string('parent_name')->nullable()->comment('Parent/Guardian name');
            $table->string('parent_phone')->nullable()->comment('Parent/Guardian phone');
            $table->text('medical_notes')->nullable()->comment('Medical conditions');
            $table->string('barcode')->nullable()->unique()->comment('Student barcode for attendance');
            $table->timestamps();
            
            $table->index(['nisn']);
            $table->index(['student_id_number']);
            $table->index(['class_id']);
            $table->index(['barcode']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};