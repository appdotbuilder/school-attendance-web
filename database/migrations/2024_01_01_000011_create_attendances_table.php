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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('schedules');
            $table->foreignId('student_id')->constrained('students');
            $table->date('attendance_date')->comment('Date of attendance');
            $table->enum('status', ['present', 'absent', 'sick', 'permission'])->comment('Attendance status');
            $table->time('check_in_time')->nullable()->comment('Time of check-in');
            $table->enum('method', ['manual', 'barcode', 'fingerprint'])->default('manual')->comment('Attendance method');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->string('proof_file')->nullable()->comment('Proof file for sick/permission');
            $table->foreignId('recorded_by')->constrained('users');
            $table->timestamps();
            
            $table->unique(['schedule_id', 'student_id', 'attendance_date']);
            $table->index(['schedule_id']);
            $table->index(['student_id']);
            $table->index(['attendance_date']);
            $table->index(['status']);
            $table->index(['method']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};