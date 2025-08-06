import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';

interface Attendance {
    id: number;
    attendance_date: string;
    status: 'present' | 'absent' | 'sick' | 'permission';
    method: 'manual' | 'barcode' | 'fingerprint';
    check_in_time?: string;
    notes?: string;
    schedule: {
        subject: {
            name: string;
            code: string;
        };
        school_class: {
            name: string;
        };
        start_time: string;
        end_time: string;
    };
}

interface Student {
    id: number;
    nisn: string;
    student_id_number: string;
    barcode?: string;
    user: {
        name: string;
        email: string;
    };
    school_class: {
        name: string;
        grade_level: string;
        program?: string;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    total: number;
    from: number;
    to: number;
    last_page: number;
}

interface Props {
    attendances: {
        data: Attendance[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    student: Student;
    filters: {
        date_from?: string;
        date_to?: string;
    };
    [key: string]: unknown;
}

export default function StudentReport({ attendances, student, filters }: Props) {
    const [localFilters, setLocalFilters] = useState({
        date_from: filters.date_from || '',
        date_to: filters.date_to || ''
    });

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const params: Record<string, string> = {};
        if (localFilters.date_from) params.date_from = localFilters.date_from;
        if (localFilters.date_to) params.date_to = localFilters.date_to;
        
        router.get(route('attendance.reports'), params);
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            present: 'bg-green-100 text-green-800 border-green-200',
            absent: 'bg-red-100 text-red-800 border-red-200',
            sick: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            permission: 'bg-blue-100 text-blue-800 border-blue-200'
        };
        const labels = {
            present: 'Hadir',
            absent: 'Alpha',
            sick: 'Sakit',
            permission: 'Izin'
        };
        
        return (
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                {labels[status as keyof typeof labels] || status}
            </span>
        );
    };

    const getMethodIcon = (method: string) => {
        const icons = {
            manual: '📝',
            barcode: '📱',
            fingerprint: '👆'
        };
        return icons[method as keyof typeof icons] || '📝';
    };

    // Calculate statistics
    const stats = {
        total: attendances.data.length,
        present: attendances.data.filter(att => att.status === 'present').length,
        absent: attendances.data.filter(att => att.status === 'absent').length,
        sick: attendances.data.filter(att => att.status === 'sick').length,
        permission: attendances.data.filter(att => att.status === 'permission').length,
    };

    const attendancePercentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : '0';

    return (
        <AppLayout>
            <Head title="Riwayat Kehadiran Saya" />
            
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📊 Riwayat Kehadiran Saya
                    </h1>
                    <p className="text-gray-600">
                        Data kehadiran pribadi dan statistik kehadiran
                    </p>
                </div>

                {/* Student Profile Card */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8 border border-blue-200">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                                {student.user.name.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{student.user.name}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">NISN:</span> {student.nisn}
                                </div>
                                <div>
                                    <span className="font-medium">NIS:</span> {student.student_id_number}
                                </div>
                                <div>
                                    <span className="font-medium">Kelas:</span> {student.school_class.name}
                                </div>
                                <div>
                                    <span className="font-medium">Tingkat:</span> {student.school_class.grade_level} {student.school_class.program}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">{attendancePercentage}%</div>
                            <div className="text-sm text-gray-600">Tingkat Kehadiran</div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Absensi</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Hadir</p>
                                <p className="text-3xl font-bold text-green-700">{stats.present}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-600 text-sm font-medium">Alpha</p>
                                <p className="text-3xl font-bold text-red-700">{stats.absent}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">❌</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-600 text-sm font-medium">Sakit</p>
                                <p className="text-3xl font-bold text-yellow-700">{stats.sick}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🤒</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Izin</p>
                                <p className="text-3xl font-bold text-blue-700">{stats.permission}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📝</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filter Periode</h2>
                    <form onSubmit={handleFilterSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Mulai
                                </label>
                                <input
                                    type="date"
                                    value={localFilters.date_from}
                                    onChange={(e) => setLocalFilters(prev => ({ ...prev, date_from: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Selesai
                                </label>
                                <input
                                    type="date"
                                    value={localFilters.date_to}
                                    onChange={(e) => setLocalFilters(prev => ({ ...prev, date_to: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-end">
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                    🔍 Filter
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Attendance History */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Riwayat Kehadiran ({attendances.meta.total} total)
                        </h2>
                    </div>
                    
                    {attendances.data.length > 0 ? (
                        <>
                            <div className="divide-y divide-gray-200">
                                {attendances.data.map((attendance) => (
                                    <div key={attendance.id} className="p-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <span className="text-blue-600 font-medium">
                                                                {attendance.schedule.subject.code}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {attendance.schedule.subject.name}
                                                            </h3>
                                                            {getStatusBadge(attendance.status)}
                                                        </div>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                            <span>📅 {new Date(attendance.attendance_date).toLocaleDateString('id-ID')}</span>
                                                            <span>⏰ {attendance.schedule.start_time} - {attendance.schedule.end_time}</span>
                                                            <span>🏫 {attendance.schedule.school_class.name}</span>
                                                            {attendance.check_in_time && (
                                                                <span>🕐 Masuk: {attendance.check_in_time}</span>
                                                            )}
                                                        </div>
                                                        {attendance.notes && (
                                                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                                                                <strong>Keterangan:</strong> {attendance.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 ml-4">
                                                <div className="text-center">
                                                    <div className="text-2xl mb-1">
                                                        {getMethodIcon(attendance.method)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {attendance.method === 'manual' ? 'Manual' : 
                                                         attendance.method === 'barcode' ? 'Barcode' :
                                                         'Fingerprint'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {attendances.meta.last_page > 1 && (
                                <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                    <div className="flex-1 flex justify-between items-center">
                                        <p className="text-sm text-gray-700">
                                            Menampilkan {attendances.meta.from} sampai {attendances.meta.to} dari {attendances.meta.total} data
                                        </p>
                                        <div className="flex space-x-2">
                                            {attendances.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    disabled={!link.url}
                                                    className={`px-3 py-2 text-sm rounded-md ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : link.url
                                                            ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <span className="text-6xl mb-4 block">📚</span>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada riwayat kehadiran</h3>
                            <p className="text-gray-500">
                                Riwayat kehadiran Anda akan muncul di sini setelah guru mencatat absensi
                            </p>
                        </div>
                    )}
                </div>

                {/* Barcode Info */}
                {student.barcode && (
                    <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">📱</span>
                            Barcode Absensi Anda
                        </h3>
                        <div className="bg-white rounded-lg p-6 text-center">
                            <div className="text-3xl font-mono font-bold text-gray-900 mb-2">
                                {student.barcode}
                            </div>
                            <p className="text-sm text-gray-600">
                                Tunjukkan kode ini kepada guru untuk absensi barcode
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}