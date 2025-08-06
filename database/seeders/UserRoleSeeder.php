<?php

namespace Database\Seeders;

use App\Models\UserRole;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
            ],
            [
                'name' => 'teacher',
                'display_name' => 'Guru',
            ],
            [
                'name' => 'student',
                'display_name' => 'Siswa',
            ],
        ];

        foreach ($roles as $role) {
            UserRole::firstOrCreate(['name' => $role['name']], $role);
        }
    }
}