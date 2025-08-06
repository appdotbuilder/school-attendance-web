<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            ['code' => 'MTK', 'name' => 'Matematika', 'description' => 'Mata pelajaran Matematika'],
            ['code' => 'BIN', 'name' => 'Bahasa Indonesia', 'description' => 'Mata pelajaran Bahasa Indonesia'],
            ['code' => 'BING', 'name' => 'Bahasa Inggris', 'description' => 'Mata pelajaran Bahasa Inggris'],
            ['code' => 'FIS', 'name' => 'Fisika', 'description' => 'Mata pelajaran Fisika'],
            ['code' => 'KIM', 'name' => 'Kimia', 'description' => 'Mata pelajaran Kimia'],
            ['code' => 'BIO', 'name' => 'Biologi', 'description' => 'Mata pelajaran Biologi'],
            ['code' => 'SEJ', 'name' => 'Sejarah', 'description' => 'Mata pelajaran Sejarah'],
            ['code' => 'GEO', 'name' => 'Geografi', 'description' => 'Mata pelajaran Geografi'],
            ['code' => 'EKO', 'name' => 'Ekonomi', 'description' => 'Mata pelajaran Ekonomi'],
            ['code' => 'SOS', 'name' => 'Sosiologi', 'description' => 'Mata pelajaran Sosiologi'],
            ['code' => 'PKN', 'name' => 'PPKn', 'description' => 'Pendidikan Pancasila dan Kewarganegaraan'],
            ['code' => 'OR', 'name' => 'Pendidikan Jasmani', 'description' => 'Pendidikan Jasmani, Olahraga, dan Kesehatan'],
        ];

        foreach ($subjects as $subject) {
            Subject::firstOrCreate(['code' => $subject['code']], $subject);
        }
    }
}