import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';


interface AuthUser {
    id: number;
    name: string;
    email: string;
}

interface Props {
    auth?: {
        user?: AuthUser;
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <>
            <Head title="Sistem Absensi Sekolah" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
                {/* Header */}
                <header className="relative bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">📚</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Sistem Absensi</h1>
                                    <p className="text-sm text-gray-600">Sekolah Digital</p>
                                </div>
                            </div>
                            
                            {auth?.user ? (
                                <Link href="/dashboard">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <div className="flex space-x-3">
                                    <Link href="/login">
                                        <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            Daftar
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative py-20 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="mb-8">
                            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-6">
                                📱 Sistem Absensi Sekolah Digital
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Solusi modern untuk mengelola kehadiran siswa dengan teknologi terdepan. 
                                Mendukung absensi manual, barcode, dan fingerprint dalam satu platform terintegrasi.
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid md:grid-cols-3 gap-8 mt-16">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">👥</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Manajemen Multi-Role</h3>
                                <p className="text-gray-600">
                                    Sistem dengan 3 peran pengguna: Admin, Guru, dan Siswa. 
                                    Setiap role memiliki dashboard dan fitur khusus yang disesuaikan.
                                </p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">📊</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Absensi Multi-Method</h3>
                                <p className="text-gray-600">
                                    Mendukung absensi manual, scan barcode, dan simulasi fingerprint. 
                                    Fleksibilitas tinggi untuk berbagai kebutuhan sekolah.
                                </p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">📈</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Laporan Komprehensif</h3>
                                <p className="text-gray-600">
                                    Laporan kehadiran real-time per kelas, per siswa, dan per periode. 
                                    Statistik lengkap untuk monitoring kehadiran siswa.
                                </p>
                            </div>
                        </div>

                        {/* Additional Features */}
                        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white/60 rounded-xl p-6 border border-gray-200">
                                <div className="text-2xl mb-3">🏫</div>
                                <h4 className="font-semibold text-gray-900 mb-2">Manajemen Kelas</h4>
                                <p className="text-sm text-gray-600">Kelola data kelas, wali kelas, dan kapasitas siswa</p>
                            </div>

                            <div className="bg-white/60 rounded-xl p-6 border border-gray-200">
                                <div className="text-2xl mb-3">📚</div>
                                <h4 className="font-semibold text-gray-900 mb-2">Mata Pelajaran</h4>
                                <p className="text-sm text-gray-600">Database lengkap mata pelajaran dan guru pengampu</p>
                            </div>

                            <div className="bg-white/60 rounded-xl p-6 border border-gray-200">
                                <div className="text-2xl mb-3">⏰</div>
                                <h4 className="font-semibold text-gray-900 mb-2">Jadwal Pelajaran</h4>
                                <p className="text-sm text-gray-600">Manajemen jadwal mengajar lengkap dengan ruangan</p>
                            </div>

                            <div className="bg-white/60 rounded-xl p-6 border border-gray-200">
                                <div className="text-2xl mb-3">🎯</div>
                                <h4 className="font-semibold text-gray-900 mb-2">Status Kehadiran</h4>
                                <p className="text-sm text-gray-600">Hadir, Izin, Sakit, Alpha dengan keterangan lengkap</p>
                            </div>
                        </div>

                        {/* CTA Section */}
                        {!auth?.user && (
                            <div className="mt-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white">
                                <h2 className="text-3xl font-bold mb-6">Siap untuk Digitalisasi Absensi?</h2>
                                <p className="text-xl mb-8 text-blue-100">
                                    Bergabunglah dengan sekolah modern yang menggunakan teknologi terdepan
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Link href="/register">
                                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                                            🚀 Mulai Sekarang
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                                            👋 Masuk ke Akun
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-6xl mx-auto px-4 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">📚</span>
                            </div>
                            <span className="text-xl font-bold">Sistem Absensi Sekolah</span>
                        </div>
                        <p className="text-gray-400">
                            Platform digital untuk manajemen kehadiran siswa yang modern dan efisien
                        </p>
                        <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500">
                            <p>&copy; 2024 Sistem Absensi Sekolah. Built with Laravel & React.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}