import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';

interface Student {
    id: number;
    user: {
        name: string;
    };
    nisn: string;
    student_id_number: string;
    barcode: string;
}

interface Schedule {
    id: number;
    subject: {
        name: string;
        code: string;
    };
    school_class: {
        name: string;
    };
    teacher: {
        user: {
            name: string;
        };
    };
    start_time: string;
    end_time: string;
    room?: string;
}

interface ExistingAttendance {
    id: number;
    student_id: number;
    status: string;
    notes?: string;
    method: string;
}

interface Props {
    schedule: Schedule;
    students: Student[];
    existingAttendances: Record<number, ExistingAttendance>;
    attendanceDate: string;
    [key: string]: unknown;
}

type AttendanceStatus = 'present' | 'absent' | 'sick' | 'permission';
type AttendanceMethod = 'manual' | 'barcode' | 'fingerprint';

interface AttendanceData {
    status: AttendanceStatus;
    notes: string;
    method: AttendanceMethod;
}

export default function CreateAttendance({
    schedule,
    students,
    existingAttendances,
    attendanceDate
}: Props) {
    const [attendanceData, setAttendanceData] = useState<Record<number, AttendanceData>>(() => {
        const initial: Record<number, AttendanceData> = {};
        students.forEach(student => {
            const existing = existingAttendances[student.id];
            initial[student.id] = {
                status: existing?.status as AttendanceStatus || 'present',
                notes: existing?.notes || '',
                method: existing?.method as AttendanceMethod || 'manual'
            };
        });
        return initial;
    });

    const [barcodeInput, setBarcodeInput] = useState('');
    const [loading, setLoading] = useState(false);

    const updateAttendance = (studentId: number, field: keyof AttendanceData, value: string | AttendanceStatus | AttendanceMethod) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        
        const attendances = students.map(student => ({
            student_id: student.id,
            status: attendanceData[student.id].status,
            notes: attendanceData[student.id].notes,
            method: attendanceData[student.id].method
        }));

        router.post(route('attendance.store'), {
            schedule_id: schedule.id,
            attendance_date: attendanceDate,
            attendances
        }, {
            onFinish: () => setLoading(false),
            onSuccess: () => {
                // Handle success - redirect will happen automatically
            }
        });
    };

    const handleBarcodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcodeInput.trim()) return;

        // Find student by barcode
        const student = students.find(s => s.barcode === barcodeInput);
        if (student) {
            updateAttendance(student.id, 'status', 'present');
            updateAttendance(student.id, 'method', 'barcode');
            setBarcodeInput('');
            alert(`Absensi berhasil dicatat untuk ${student.user.name}`);
        } else {
            alert('Barcode tidak ditemukan');
        }
    };

    const handleFingerprintAttendance = (studentId: number) => {
        // Simulate fingerprint scan
        updateAttendance(studentId, 'status', 'present');
        updateAttendance(studentId, 'method', 'fingerprint');
        alert('Absensi fingerprint berhasil dicatat!');
    };

    const getStatusColor = (status: AttendanceStatus) => {
        const colors = {
            present: 'bg-green-100 text-green-800 border-green-200',
            absent: 'bg-red-100 text-red-800 border-red-200',
            sick: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            permission: 'bg-blue-100 text-blue-800 border-blue-200'
        };
        return colors[status];
    };

    const markAllPresent = () => {
        const newData = { ...attendanceData };
        students.forEach(student => {
            newData[student.id] = {
                ...newData[student.id],
                status: 'present'
            };
        });
        setAttendanceData(newData);
    };

    return (
        <AppLayout>
            <Head title="Ambil Absensi" />
            
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                📝 Ambil Absensi
                            </h1>
                            <div className="text-gray-600 space-y-1">
                                <p>
                                    <span className="font-medium">Mata Pelajaran:</span> {schedule.subject.name} ({schedule.subject.code})
                                </p>
                                <p>
                                    <span className="font-medium">Kelas:</span> {schedule.school_class.name}
                                </p>
                                <p>
                                    <span className="font-medium">Waktu:</span> {schedule.start_time} - {schedule.end_time}
                                    {schedule.room && ` • Ruang ${schedule.room}`}
                                </p>
                                <p>
                                    <span className="font-medium">Tanggal:</span> {new Date(attendanceDate).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                        </div>
                        <Button 
                            onClick={markAllPresent}
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        >
                            ✅ Tandai Semua Hadir
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Attendance List */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Daftar Siswa ({students.length})
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {students.map((student) => (
                                        <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 font-medium">
                                                            {student.user.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{student.user.name}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            NISN: {student.nisn} • NIS: {student.student_id_number}
                                                        </p>
                                                        {student.barcode && (
                                                            <p className="text-xs text-gray-500">Barcode: {student.barcode}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <Button
                                                    onClick={() => handleFingerprintAttendance(student.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                                >
                                                    👆 Fingerprint
                                                </Button>
                                            </div>

                                            {/* Status Selection */}
                                            <div className="grid grid-cols-4 gap-2 mb-3">
                                                {(['present', 'absent', 'sick', 'permission'] as const).map((status) => {
                                                    const labels = {
                                                        present: '✅ Hadir',
                                                        absent: '❌ Alpha', 
                                                        sick: '🤒 Sakit',
                                                        permission: '📝 Izin'
                                                    };
                                                    
                                                    return (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            onClick={() => updateAttendance(student.id, 'status', status)}
                                                            className={`p-2 text-sm font-medium border rounded-lg transition-colors ${
                                                                attendanceData[student.id]?.status === status
                                                                    ? getStatusColor(status)
                                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {labels[status]}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Notes */}
                                            {(attendanceData[student.id]?.status === 'sick' || 
                                              attendanceData[student.id]?.status === 'permission' ||
                                              attendanceData[student.id]?.status === 'absent') && (
                                                <div className="mt-3">
                                                    <textarea
                                                        placeholder="Keterangan tambahan..."
                                                        value={attendanceData[student.id]?.notes || ''}
                                                        onChange={(e) => updateAttendance(student.id, 'notes', e.target.value)}
                                                        className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        rows={2}
                                                    />
                                                </div>
                                            )}

                                            {/* Method indicator */}
                                            <div className="mt-2 text-xs text-gray-500">
                                                Metode: {attendanceData[student.id]?.method === 'manual' ? '📝 Manual' : 
                                                        attendanceData[student.id]?.method === 'barcode' ? '📱 Barcode' :
                                                        '👆 Fingerprint'}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Submit Button */}
                                <div className="mt-8 flex justify-end">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 px-8"
                                    >
                                        {loading ? '⏳ Menyimpan...' : '💾 Simpan Absensi'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Barcode Scanner */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="mr-2">📱</span>
                                    Scan Barcode
                                </h3>
                                <form onSubmit={handleBarcodeSubmit} className="space-y-3">
                                    <input
                                        type="text"
                                        value={barcodeInput}
                                        onChange={(e) => setBarcodeInput(e.target.value)}
                                        placeholder="Scan atau ketik barcode"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        autoFocus
                                    />
                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                        ✅ Catat Kehadiran
                                    </Button>
                                </form>
                                <p className="text-xs text-gray-500 mt-2">
                                    Scanner barcode akan mengisi otomatis saat scan
                                </p>
                            </div>

                            {/* Summary */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Ringkasan</h3>
                                <div className="space-y-3">
                                    {['present', 'absent', 'sick', 'permission'].map((status) => {
                                        const count = students.filter(student => 
                                            attendanceData[student.id]?.status === status
                                        ).length;
                                        
                                        const labels = {
                                            present: '✅ Hadir',
                                            absent: '❌ Alpha',
                                            sick: '🤒 Sakit',
                                            permission: '📝 Izin'
                                        };

                                        return (
                                            <div key={status} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">{labels[status as keyof typeof labels]}</span>
                                                <span className="font-semibold text-gray-900">{count}</span>
                                            </div>
                                        );
                                    })}
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-900">Total Siswa</span>
                                            <span className="font-bold text-gray-900">{students.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Aksi Cepat</h3>
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start"
                                        onClick={() => {
                                            const newData = { ...attendanceData };
                                            students.forEach(student => {
                                                newData[student.id] = { ...newData[student.id], status: 'present' };
                                            });
                                            setAttendanceData(newData);
                                        }}
                                    >
                                        ✅ Semua Hadir
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start"
                                        onClick={() => {
                                            const newData = { ...attendanceData };
                                            students.forEach(student => {
                                                newData[student.id] = { ...newData[student.id], method: 'manual' };
                                            });
                                            setAttendanceData(newData);
                                        }}
                                    >
                                        📝 Reset ke Manual
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}