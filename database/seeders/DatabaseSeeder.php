<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserRoleSeeder::class,
            SubjectSeeder::class,
        ]);

        // Create admin user
        $adminRole = \App\Models\UserRole::where('name', 'admin')->first();
        \App\Models\User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@school.com',
            'password' => bcrypt('password'),
            'role_id' => $adminRole->id,
        ]);

        // Create sample teacher
        $teacherRole = \App\Models\UserRole::where('name', 'teacher')->first();
        $teacher = \App\Models\User::factory()->create([
            'name' => 'Budi Santoso',
            'email' => 'teacher@school.com',
            'password' => bcrypt('password'),
            'role_id' => $teacherRole->id,
        ]);

        // Create teacher profile
        \App\Models\Teacher::create([
            'user_id' => $teacher->id,
            'nip' => '198501012009031001',
            'employee_id' => 'EMP001',
            'qualification' => 'S1 Pendidikan Matematika',
            'hire_date' => '2009-03-01',
            'status' => 'active',
        ]);

        // Create sample classes
        $class1 = \App\Models\SchoolClass::create([
            'name' => 'X IPA 1',
            'grade_level' => 'X',
            'program' => 'IPA',
            'homeroom_teacher_id' => $teacher->id,
            'capacity' => 32,
        ]);

        // Create sample student
        $studentRole = \App\Models\UserRole::where('name', 'student')->first();
        $student = \App\Models\User::factory()->create([
            'name' => 'Sari Dewi',
            'email' => 'student@school.com',
            'password' => bcrypt('password'),
            'role_id' => $studentRole->id,
        ]);

        // Create student profile
        \App\Models\Student::create([
            'user_id' => $student->id,
            'nisn' => '0051234567',
            'student_id_number' => 'STD001',
            'class_id' => $class1->id,
            'parent_name' => 'Bapak Dewi',
            'parent_phone' => '08123456789',
            'barcode' => 'STD001BC',
        ]);
    }
}
