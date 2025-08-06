import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Attendance {
    id: number;
    status: 'present' | 'absent' | 'sick' | 'permission';
    attendance_date: string;
    student: {
        user: {
            name: string;
        };
    };
    schedule: {
        subject: {
            name: string;
        };
        school_class: {
            name: string;
        };
    };
}

interface Schedule {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room?: string;
    subject: {
        name: string;
        code: string;
    };
    school_class?: {
        name: string;
    };
    teacher?: {
        user: {
            name: string;
        };
    };
}

interface AuthUser {
    name: string;
    role: {
        name: string;
        display_name: string;
    };
}

interface TeacherProfile {
    id: number;
    nip: string;
    employee_id: string;
}

interface StudentProfile {
    id: number;
    nisn: string;
    student_id_number: string;
    barcode?: string;
    parent_name?: string;
    parent_phone?: string;
    user: AuthUser;
    school_class: {
        name: string;
        grade_level: string;
        program?: string;
    };
}

interface Props {
    auth: {
        user: AuthUser;
    };
    stats?: {
        totalStudents: number;
        todayAttendances: number;
        presentToday: number;
        absentToday: number;
    };
    recentAttendances?: Attendance[];
    todaySchedules?: Schedule[];
    homeroomClasses?: Array<{
        id: number;
        name: string;
        grade_level: string;
        program?: string;
        students: Array<{ user: { name: string } }>;
    }>;
    teacher?: TeacherProfile;
    student?: StudentProfile;
    myAttendances?: Attendance[];
    [key: string]: unknown;
}

export default function Dashboard({
    auth,
    stats,
    recentAttendances,
    todaySchedules,
    homeroomClasses,

    student,
    myAttendances
}: Props) {
    const user = auth.user;
    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleTakeAttendance = (scheduleId: number) => {
        router.get(route('attendance.create', scheduleId));
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            present: 'bg-green-100 text-green-800',
            absent: 'bg-red-100 text-red-800',
            sick: 'bg-yellow-100 text-yellow-800',
            permission: 'bg-blue-100 text-blue-800'
        };
        const labels = {
            present: 'Hadir',
            absent: 'Alpha',
            sick: 'Sakit',
            permission: 'Izin'
        };
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status as keyof typeof labels] || status}
            </span>
        );
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Dashboard {user.role.display_name}
                    </h1>
                    <p className="text-gray-600">
                        Selamat datang, {user.name} • {today}
                    </p>
                </div>

                {/* Admin Dashboard */}
                {user.role.name === 'admin' && (
                    <>
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 text-sm font-medium">Total Siswa</p>
                                        <p className="text-3xl font-bold text-blue-700">{stats?.totalStudents || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 text-sm font-medium">Hadir Hari Ini</p>
                                        <p className="text-3xl font-bold text-green-700">{stats?.presentToday || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">✅</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-red-600 text-sm font-medium">Tidak Hadir</p>
                                        <p className="text-3xl font-bold text-red-700">{stats?.absentToday || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">❌</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 text-sm font-medium">Total Absen</p>
                                        <p className="text-3xl font-bold text-purple-700">{stats?.todayAttendances || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Attendances */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Absensi Terbaru Hari Ini</h2>
                            </div>
                            <div className="p-6">
                                {recentAttendances && recentAttendances.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentAttendances.map((attendance) => (
                                            <div key={attendance.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 font-medium text-sm">
                                                            {attendance.student.user.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{attendance.student.user.name}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {attendance.schedule.subject.name} - {attendance.schedule.school_class.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(attendance.status)}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <span className="text-4xl mb-4 block">📝</span>
                                        <p>Belum ada data absensi hari ini</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Teacher Dashboard */}
                {user.role.name === 'teacher' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Today's Schedule */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <span className="mr-2">📅</span>
                                        Jadwal Mengajar Hari Ini
                                    </h2>
                                </div>
                                <div className="p-6">
                                    {todaySchedules && todaySchedules.length > 0 ? (
                                        <div className="space-y-4">
                                            {todaySchedules.map((schedule) => (
                                                <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">
                                                                {schedule.subject.name} ({schedule.subject.code})
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Kelas {schedule.school_class?.name}
                                                                {schedule.room && ` • Ruang ${schedule.room}`}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-medium text-blue-600">
                                                                {schedule.start_time} - {schedule.end_time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        onClick={() => handleTakeAttendance(schedule.id)}
                                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        📝 Ambil Absensi
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <span className="text-4xl mb-4 block">📅</span>
                                            <p>Tidak ada jadwal mengajar hari ini</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Homeroom Classes */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <span className="mr-2">🏫</span>
                                        Kelas Wali
                                    </h2>
                                </div>
                                <div className="p-6">
                                    {homeroomClasses && homeroomClasses.length > 0 ? (
                                        <div className="space-y-4">
                                            {homeroomClasses.map((schoolClass) => (
                                                <div key={schoolClass.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-semibold text-gray-900">{schoolClass.name}</h3>
                                                        <span className="text-sm text-gray-600">
                                                            {schoolClass.students.length} siswa
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {schoolClass.grade_level} {schoolClass.program}
                                                    </p>
                                                    <Button variant="outline" className="w-full">
                                                        📊 Lihat Laporan Kelas
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <span className="text-4xl mb-4 block">🏫</span>
                                            <p>Anda belum menjadi wali kelas</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Student Dashboard */}
                {user.role.name === 'student' && student && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Student Info */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <span className="mr-2">👤</span>
                                        Profil Siswa
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-bold text-xl">
                                                    {student.user.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{student.user.name}</h3>
                                                <p className="text-gray-600">NISN: {student.nisn}</p>
                                                <p className="text-gray-600">Kelas: {student.school_class.name}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="border-t pt-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                                <span className="font-medium">NIS:</span> {student.student_id_number}
                                            </p>
                                            {student.parent_name && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    <span className="font-medium">Orang Tua:</span> {student.parent_name}
                                                </p>
                                            )}
                                            {student.barcode && (
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Barcode:</span> {student.barcode}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Today's Schedule */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <span className="mr-2">📅</span>
                                        Jadwal Pelajaran Hari Ini
                                    </h2>
                                </div>
                                <div className="p-6">
                                    {todaySchedules && todaySchedules.length > 0 ? (
                                        <div className="space-y-3">
                                            {todaySchedules.map((schedule) => (
                                                <div key={schedule.id} className="border border-gray-200 rounded-lg p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{schedule.subject.name}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                {schedule.teacher?.user.name}
                                                                {schedule.room && ` • Ruang ${schedule.room}`}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-medium text-blue-600">
                                                                {schedule.start_time} - {schedule.end_time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <span className="text-4xl mb-4 block">📅</span>
                                            <p>Tidak ada jadwal pelajaran hari ini</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Attendance */}
                        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <span className="mr-2">📊</span>
                                    Riwayat Kehadiran (7 Hari Terakhir)
                                </h2>
                            </div>
                            <div className="p-6">
                                {myAttendances && myAttendances.length > 0 ? (
                                    <div className="space-y-3">
                                        {myAttendances.map((attendance) => (
                                            <div key={attendance.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {attendance.schedule.subject.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(attendance.attendance_date).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                                {getStatusBadge(attendance.status)}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <span className="text-4xl mb-4 block">📊</span>
                                        <p>Belum ada riwayat kehadiran</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Quick Actions */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {user.role.name === 'admin' && (
                            <>
                                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                                    <span className="text-2xl">👥</span>
                                    <span>Kelola Pengguna</span>
                                </Button>
                                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                                    <span className="text-2xl">🏫</span>
                                    <span>Kelola Kelas</span>
                                </Button>
                            </>
                        )}
                        
                        {(user.role.name === 'admin' || user.role.name === 'teacher') && (
                            <>
                                <Button 
                                    variant="outline" 
                                    className="h-auto p-4 flex flex-col items-center space-y-2"
                                    onClick={() => router.get(route('attendance.reports'))}
                                >
                                    <span className="text-2xl">📈</span>
                                    <span>Laporan Absensi</span>
                                </Button>
                                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                                    <span className="text-2xl">📊</span>
                                    <span>Statistik</span>
                                </Button>
                            </>
                        )}

                        {user.role.name === 'student' && (
                            <>
                                <Button 
                                    variant="outline" 
                                    className="h-auto p-4 flex flex-col items-center space-y-2"
                                    onClick={() => router.get(route('attendance.reports'))}
                                >
                                    <span className="text-2xl">📊</span>
                                    <span>Riwayat Absensi</span>
                                </Button>
                                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                                    <span className="text-2xl">📱</span>
                                    <span>Barcode Saya</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}