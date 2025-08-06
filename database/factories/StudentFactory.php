<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\SchoolClass;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nisn' => fake()->unique()->numerify('00########'),
            'student_id_number' => fake()->unique()->bothify('STD###'),
            'class_id' => SchoolClass::factory(),
            'parent_name' => fake()->name(),
            'parent_phone' => fake()->phoneNumber(),
            'medical_notes' => fake()->optional()->sentence(),
            'barcode' => fake()->unique()->bothify('STD###BC'),
        ];
    }
}