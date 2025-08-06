<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display attendance reports.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->isStudent()) {
            // Students can only see their own reports
            $student = $user->student;
            $attendances = Attendance::with(['schedule.subject', 'schedule.schoolClass'])
                ->where('student_id', $student->id)
                ->when($request->date_from, function ($query, $dateFrom) {
                    return $query->whereDate('attendance_date', '>=', $dateFrom);
                })
                ->when($request->date_to, function ($query, $dateTo) {
                    return $query->whereDate('attendance_date', '<=', $dateTo);
                })
                ->orderBy('attendance_date', 'desc')
                ->paginate(20);

            return Inertia::render('attendance/student-report', [
                'attendances' => $attendances,
                'student' => $student->load(['user', 'schoolClass']),
                'filters' => $request->only(['date_from', 'date_to']),
            ]);
        }

        // Teachers and admins can see class reports
        $attendances = Attendance::with(['student.user', 'schedule.subject', 'schedule.schoolClass', 'recordedBy'])
            ->when($user->isTeacher(), function ($query) use ($user) {
                return $query->whereHas('schedule', function ($scheduleQuery) use ($user) {
                    $scheduleQuery->where('teacher_id', $user->teacher->id);
                });
            })
            ->when($request->class_id, function ($query, $classId) {
                return $query->whereHas('schedule', function ($scheduleQuery) use ($classId) {
                    $scheduleQuery->where('class_id', $classId);
                });
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                return $query->whereDate('attendance_date', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                return $query->whereDate('attendance_date', '<=', $dateTo);
            })
            ->orderBy('attendance_date', 'desc')
            ->paginate(20);

        $classes = $user->isAdmin() 
            ? \App\Models\SchoolClass::all()
            : \App\Models\SchoolClass::whereHas('schedules', function ($query) use ($user) {
                $query->where('teacher_id', $user->teacher->id);
            })->get();

        return Inertia::render('attendance/reports', [
            'attendances' => $attendances,
            'classes' => $classes,
            'filters' => $request->only(['class_id', 'date_from', 'date_to']),
        ]);
    }
}