<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Display all appointments.
     */
    public function index()
    {
        $appointments = Appointment::with(['patient', 'doctor'])->get();

        return response()->json($appointments);
    }

    /**
     * Store a new appointment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'reason' => 'required|string|max:255',
            'status' => 'required|in:pending,approved,completed,cancelled',
            'notes' => 'nullable|string',
            'appointment_type' => 'nullable|string|max:255',
        ]);

        // Get the highest existing appointment number
        $lastAppointment = Appointment::orderByRaw(
            "CAST(SUBSTRING(appointment_number, 5) AS UNSIGNED) DESC"
        )->first();

        if ($lastAppointment) {
            $lastNumber = (int) str_replace(
                'APT-',
                '',
                $lastAppointment->appointment_number
            );

            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        // Generate APT-001, APT-002, APT-003...
        $appointmentNumber = 'APT-' . str_pad(
            $newNumber,
            3,
            '0',
            STR_PAD_LEFT
        );

        $appointment = Appointment::create([
            'appointment_number' => $appointmentNumber,
            ...$validated,
        ]);

        return response()->json([
            'message' => 'Appointment created successfully.',
            'appointment' => $appointment->load(['patient', 'doctor']),
        ], 201);
    }

    /**
     * Display one appointment.
     */
    public function show(string $id)
    {
        $appointment = Appointment::with(['patient', 'doctor'])
            ->findOrFail($id);

        return response()->json($appointment);
    }

    /**
     * Update an appointment.
     */
    public function update(Request $request, string $id)
    {
        $appointment = Appointment::findOrFail($id);

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'reason' => 'required|string|max:255',
            'status' => 'required|in:pending,approved,completed,cancelled',
            'notes' => 'nullable|string',
            'appointment_type' => 'nullable|string|max:255',
        ]);

        $appointment->update($validated);

        return response()->json([
            'message' => 'Appointment updated successfully.',
            'appointment' => $appointment->load(['patient', 'doctor']),
        ]);
    }

    /**
     * Delete an appointment.
     */
    public function destroy(string $id)
    {
        $appointment = Appointment::findOrFail($id);

        $appointment->delete();

        return response()->json([
            'message' => 'Appointment deleted successfully.',
        ]);
    }
}