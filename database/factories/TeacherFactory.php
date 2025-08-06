<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
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
            'nip' => fake()->unique()->numerify('##################'),
            'employee_id' => fake()->unique()->bothify('EMP###'),
            'qualification' => fake()->randomElement([
                'S1 Pendidikan Matematika',
                'S1 Pendidikan Bahasa Indonesia',
                'S1 Pendidikan Bahasa Inggris',
                'S1 Pendidikan Fisika',
                'S1 Pendidikan Kimia',
                'S1 Pendidikan Biologi',
            ]),
            'hire_date' => fake()->dateTimeBetween('-10 years', '-1 year'),
            'status' => 'active',
        ];
    }
}