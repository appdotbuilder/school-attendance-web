<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Schedule;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Http\Requests\StoreAttendanceRequest;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display the attendance dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today();

        if ($user->isAdmin()) {
            // Admin dashboard - show overall statistics
            $totalStudents = Student::count();
            $todayAttendances = Attendance::whereDate('attendance_date', $today)->count();
            $presentToday = Attendance::whereDate('attendance_date', $today)
                ->where('status', 'present')->count();
            $absentToday = Attendance::whereDate('attendance_date', $today)
                ->whereIn('status', ['absent', 'sick', 'permission'])->count();

            $recentAttendances = Attendance::with(['student.user', 'schedule.subject', 'schedule.schoolClass'])
                ->whereDate('attendance_date', $today)
                ->latest()
                ->limit(10)
                ->get();

            return Inertia::render('dashboard', [
                'stats' => [
                    'totalStudents' => $totalStudents,
                    'todayAttendances' => $todayAttendances,
                    'presentToday' => $presentToday,
                    'absentToday' => $absentToday,
                ],
                'recentAttendances' => $recentAttendances,
            ]);
        }

        if ($user->isTeacher()) {
            // Teacher dashboard - show classes and schedules
            $teacher = $user->teacher;
            $todaySchedules = Schedule::with(['subject', 'schoolClass'])
                ->where('teacher_id', $teacher->id)
                ->where('day_of_week', strtolower($today->format('l')))
                ->where('status', 'active')
                ->orderBy('start_time')
                ->get();

            $homeroomClasses = $teacher->homeroomClasses()
                ->with(['students.user'])
                ->get();

            return Inertia::render('dashboard', [
                'todaySchedules' => $todaySchedules,
                'homeroomClasses' => $homeroomClasses,
                'teacher' => $teacher,
            ]);
        }

        if ($user->isStudent()) {
            // Student dashboard - show personal attendance
            $student = $user->student;
            $myAttendances = Attendance::with(['schedule.subject'])
                ->where('student_id', $student->id)
                ->whereDate('attendance_date', '>=', $today->subDays(7))
                ->orderBy('attendance_date', 'desc')
                ->get();

            $todaySchedules = Schedule::with(['subject', 'teacher.user'])
                ->where('class_id', $student->class_id)
                ->where('day_of_week', strtolower($today->format('l')))
                ->where('status', 'active')
                ->orderBy('start_time')
                ->get();

            return Inertia::render('dashboard', [
                'student' => $student->load(['user', 'schoolClass']),
                'myAttendances' => $myAttendances,
                'todaySchedules' => $todaySchedules,
            ]);
        }

        // Default dashboard for users without specific roles
        return Inertia::render('dashboard');
    }

    /**
     * Show attendance form for a specific schedule.
     */
    public function create(Request $request, Schedule $schedule)
    {
        $user = $request->user();
        
        if (!$user->isTeacher() && !$user->isAdmin()) {
            abort(403, 'Unauthorized to record attendance');
        }

        $students = Student::with('user')
            ->where('class_id', $schedule->class_id)
            ->get();

        $today = Carbon::today();
        $existingAttendances = Attendance::where('schedule_id', $schedule->id)
            ->whereDate('attendance_date', $today)
            ->with('student.user')
            ->get()
            ->keyBy('student_id');

        return Inertia::render('attendance/create', [
            'schedule' => $schedule->load(['subject', 'schoolClass', 'teacher.user']),
            'students' => $students,
            'existingAttendances' => $existingAttendances,
            'attendanceDate' => $today->format('Y-m-d'),
        ]);
    }

    /**
     * Store attendance records.
     */
    public function store(StoreAttendanceRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        foreach ($validated['attendances'] as $attendanceData) {
            Attendance::updateOrCreate(
                [
                    'schedule_id' => $validated['schedule_id'],
                    'student_id' => $attendanceData['student_id'],
                    'attendance_date' => $validated['attendance_date'],
                ],
                [
                    'status' => $attendanceData['status'],
                    'method' => $attendanceData['method'] ?? 'manual',
                    'notes' => $attendanceData['notes'] ?? null,
                    'check_in_time' => $attendanceData['status'] === 'present' ? now()->format('H:i') : null,
                    'recorded_by' => $user->id,
                ]
            );
        }

        return redirect()->route('dashboard')
            ->with('success', 'Attendance recorded successfully');
    }




}