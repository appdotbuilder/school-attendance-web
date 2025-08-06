<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->isTeacher() || $this->user()->isAdmin());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'schedule_id' => 'required|exists:schedules,id',
            'attendance_date' => 'required|date',
            'attendances' => 'required|array|min:1',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,absent,sick,permission',
            'attendances.*.notes' => 'nullable|string|max:500',
            'attendances.*.method' => 'required|in:manual,barcode,fingerprint',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'schedule_id.required' => 'Jadwal pelajaran harus dipilih.',
            'schedule_id.exists' => 'Jadwal pelajaran tidak valid.',
            'attendance_date.required' => 'Tanggal absensi harus diisi.',
            'attendance_date.date' => 'Format tanggal tidak valid.',
            'attendances.required' => 'Data absensi harus diisi.',
            'attendances.array' => 'Format data absensi tidak valid.',
            'attendances.min' => 'Minimal harus ada satu data absensi.',
            'attendances.*.student_id.required' => 'ID siswa harus diisi.',
            'attendances.*.student_id.exists' => 'Siswa tidak ditemukan.',
            'attendances.*.status.required' => 'Status kehadiran harus dipilih.',
            'attendances.*.status.in' => 'Status kehadiran tidak valid.',
            'attendances.*.notes.string' => 'Keterangan harus berupa teks.',
            'attendances.*.notes.max' => 'Keterangan maksimal 500 karakter.',
            'attendances.*.method.required' => 'Metode absensi harus dipilih.',
            'attendances.*.method.in' => 'Metode absensi tidak valid.',
        ];
    }
}