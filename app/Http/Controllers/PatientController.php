<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    // Get all patients
    public function index()
    {
        $patients = Patient::latest()->get();

        return response()->json($patients);
    }

    // Create a new patient
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'gender' => 'required|in:Male,Female',
            'date_of_birth' => 'required|date',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:150',
            'address' => 'nullable|string',
            'blood_group' => 'nullable|string|max:5',
            'emergency_contact' => 'nullable|string|max:20',
            'status' => 'nullable|in:Check-up,Admitted,Discharged',
        ]);

        /*
         * Get the highest existing patient code.
         *
         * Example:
         * P001
         * P002
         * P003
         *
         * The next patient will receive P004.
         */
        $lastPatient = Patient::orderBy('id', 'desc')->first();

        if ($lastPatient) {
            $lastNumber = (int) str_replace(
                'P',
                '',
                $lastPatient->patient_code
            );

            $nextNumber = $lastNumber + 1;
        } else {
            /*
             * No patients exist.
             * Start again from P001.
             */
            $nextNumber = 1;
        }

        $validated['patient_code'] =
            'P' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        $patient = Patient::create($validated);

        return response()->json([
            'message' => 'Patient created successfully.',
            'patient' => $patient,
        ], 201);
    }

    // Get one patient
    public function show(Patient $patient)
    {
        return response()->json($patient);
    }

    // Update a patient
    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'gender' => 'required|in:Male,Female',
            'date_of_birth' => 'required|date',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:150',
            'address' => 'nullable|string',
            'blood_group' => 'nullable|string|max:5',
            'emergency_contact' => 'nullable|string|max:20',
            'status' => 'nullable|in:Check-up,Admitted,Discharged',
        ]);

        $patient->update($validated);

        return response()->json([
            'message' => 'Patient updated successfully.',
            'patient' => $patient,
        ]);
    }

    // Delete a patient
    public function destroy(Patient $patient)
    {
        $patient->delete();

        return response()->json([
            'message' => 'Patient deleted successfully.',
        ]);
    }
}