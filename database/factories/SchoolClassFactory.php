<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SchoolClass>
 */
class SchoolClassFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gradeLevel = fake()->randomElement(['X', 'XI', 'XII']);
        $program = fake()->randomElement(['IPA', 'IPS', 'Bahasa']);
        $number = fake()->numberBetween(1, 3);
        
        return [
            'name' => "{$gradeLevel} {$program} {$number}",
            'grade_level' => $gradeLevel,
            'program' => $program,
            'homeroom_teacher_id' => null,
            'capacity' => fake()->numberBetween(25, 35),
        ];
    }
}