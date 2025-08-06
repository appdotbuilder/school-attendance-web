<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subjects = [
            ['code' => 'MTK', 'name' => 'Matematika'],
            ['code' => 'BIN', 'name' => 'Bahasa Indonesia'],
            ['code' => 'BING', 'name' => 'Bahasa Inggris'],
            ['code' => 'FIS', 'name' => 'Fisika'],
            ['code' => 'KIM', 'name' => 'Kimia'],
            ['code' => 'BIO', 'name' => 'Biologi'],
        ];
        
        $subject = fake()->randomElement($subjects);
        
        return [
            'code' => $subject['code'],
            'name' => $subject['name'],
            'description' => fake()->sentence(),
        ];
    }
}