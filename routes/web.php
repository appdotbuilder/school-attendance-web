<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\AttendanceController::class, 'index'])->name('dashboard');
    
    // Attendance routes
    Route::get('attendance/create/{schedule}', [App\Http\Controllers\AttendanceController::class, 'create'])->name('attendance.create');
    Route::post('attendance', [App\Http\Controllers\AttendanceController::class, 'store'])->name('attendance.store');

    Route::get('reports', [App\Http\Controllers\ReportController::class, 'index'])->name('attendance.reports');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
