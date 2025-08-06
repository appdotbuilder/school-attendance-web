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
    student: {
        user: {
            name: string;
        };
        nisn: string;
        student_id_number: string;
    };
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
    recorded_by: {
        name: string;
    };
}

interface SchoolClass {
    id: number;
    name: string;
    grade_level: string;
    program?: string;
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
    classes?: SchoolClass[];
    filters: {
        class_id?: number;
        date_from?: string;
        date_to?: string;
    };
    auth: {
        user: {
            role: {
                name: string;
            };
        };
    };
    [key: string]: unknown;
}

export default function AttendanceReports({ attendances, classes, filters, auth }: Props) {
    const [localFilters, setLocalFilters] = useState({
        class_id: filters.class_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || ''
    });

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const params: Record<string, string | number> = {};
        if (localFilters.class_id) params.class_id = localFilters.class_id;
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

    const getMethodBadge = (method: string) => {
        const badges = {
            manual: 'bg-gray-100 text-gray-700',
            barcode: 'bg-blue-100 text-blue-700',
            fingerprint: 'bg-purple-100 text-purple-700'
        };
        const labels = {
            manual: '📝 Manual',
            barcode: '📱 Barcode',
            fingerprint: '👆 Fingerprint'
        };
        
        return (
            <span className={`px-2 py-1 text-xs rounded ${badges[method as keyof typeof badges] || 'bg-gray-100 text-gray-700'}`}>
                {labels[method as keyof typeof labels] || method}
            </span>
        );
    };

    const exportToCSV = () => {
        // Simple CSV export functionality
        const csvData = attendances.data.map(attendance => ({
            Tanggal: attendance.attendance_date,
            Siswa: attendance.student.user.name,
            NISN: attendance.student.nisn,
            MataPelajaran: attendance.schedule.subject.name,
            Kelas: attendance.schedule.school_class.name,
            Status: attendance.status,
            Metode: attendance.method,
            WaktuMasuk: attendance.check_in_time || '',
            Keterangan: attendance.notes || '',
            DicatatOleh: attendance.recorded_by.name
        }));
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + Object.keys(csvData[0] || {}).join(",") + "\n"
            + csvData.map(row => Object.values(row).join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `laporan-absensi-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppLayout>
            <Head title="Laporan Absensi" />
            
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                📊 Laporan Absensi
                            </h1>
                            <p className="text-gray-600">
                                {auth.user.role.name === 'student' 
                                    ? 'Riwayat kehadiran Anda'
                                    : 'Laporan kehadiran siswa'
                                }
                            </p>
                        </div>
                        
                        {attendances.data.length > 0 && (
                            <Button 
                                onClick={exportToCSV}
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            >
                                📥 Ekspor CSV
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                {auth.user.role.name !== 'student' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filter Laporan</h2>
                        <form onSubmit={handleFilterSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {classes && classes.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kelas
                                        </label>
                                        <select
                                            value={localFilters.class_id}
                                            onChange={(e) => setLocalFilters(prev => ({ ...prev, class_id: e.target.value }))}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Semua Kelas</option>
                                            {classes.map(cls => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.name} - {cls.grade_level} {cls.program}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                
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
                )}

                {/* Statistics Cards */}
                {attendances.data.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {['present', 'absent', 'sick', 'permission'].map((status) => {
                            const count = attendances.data.filter(att => att.status === status).length;
                            const percentage = ((count / attendances.data.length) * 100).toFixed(1);
                            
                            const configs = {
                                present: { label: 'Hadir', icon: '✅', color: 'green' },
                                absent: { label: 'Alpha', icon: '❌', color: 'red' },
                                sick: { label: 'Sakit', icon: '🤒', color: 'yellow' },
                                permission: { label: 'Izin', icon: '📝', color: 'blue' }
                            };
                            
                            const config = configs[status as keyof typeof configs];

                            return (
                                <div key={status} className={`bg-${config.color}-50 rounded-lg p-6 border border-${config.color}-200`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`text-${config.color}-600 text-sm font-medium`}>{config.label}</p>
                                            <p className={`text-3xl font-bold text-${config.color}-700`}>{count}</p>
                                            <p className={`text-${config.color}-600 text-sm`}>{percentage}%</p>
                                        </div>
                                        <div className={`w-12 h-12 bg-${config.color}-100 rounded-lg flex items-center justify-center`}>
                                            <span className="text-2xl">{config.icon}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Attendance Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Data Absensi ({attendances.meta.total} total)
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        {attendances.data.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        {auth.user.role.name !== 'student' && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Siswa
                                            </th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mata Pelajaran
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kelas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Waktu
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Metode
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Masuk
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Keterangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attendances.data.map((attendance) => (
                                        <tr key={attendance.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(attendance.attendance_date).toLocaleDateString('id-ID')}
                                            </td>
                                            {auth.user.role.name !== 'student' && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {attendance.student.user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            NISN: {attendance.student.nisn}
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {attendance.schedule.subject.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {attendance.schedule.subject.code}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {attendance.schedule.school_class.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {attendance.schedule.start_time} - {attendance.schedule.end_time}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(attendance.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getMethodBadge(attendance.method)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {attendance.check_in_time || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="max-w-xs">
                                                    {attendance.notes || '-'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <span className="text-6xl mb-4 block">📊</span>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data absensi</h3>
                                <p className="text-gray-500">
                                    {auth.user.role.name === 'student' 
                                        ? 'Anda belum memiliki riwayat absensi'
                                        : 'Belum ada data absensi dengan filter yang dipilih'
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {attendances.meta.last_page > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
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
                </div>
            </div>
        </AppLayout>
    );
}