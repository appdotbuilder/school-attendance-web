<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['present', 'absent', 'sick', 'permission']);
        
        return [
            'schedule_id' => Schedule::factory(),
            'student_id' => Student::factory(),
            'attendance_date' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'status' => $status,
            'check_in_time' => $status === 'present' ? fake()->time('H:i:s') : null,
            'method' => fake()->randomElement(['manual', 'barcode', 'fingerprint']),
            'notes' => $status !== 'present' ? fake()->optional()->sentence() : null,
            'proof_file' => null,
            'recorded_by' => User::factory(),
        ];
    }
}