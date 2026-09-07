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
         * Check if any patients exist.
         *
         * If there are no patients, start from P001.
         */
        if (Patient::count() === 0) {
            $nextNumber = 1;
        } else {
            /*
             * Find the highest patient code.
             *
             * Example:
             * P001
             * P002
             * P003
             *
             * The next patient will receive P004.
             */
            $lastPatient = Patient::whereNotNull('patient_code')
                ->orderByRaw(
                    "CAST(SUBSTRING(patient_code, 2) AS UNSIGNED) DESC"
                )
                ->first();

            if ($lastPatient) {
                $lastNumber = (int) substr(
                    $lastPatient->patient_code,
                    1
                );

                $nextNumber = $lastNumber + 1;
            } else {
                /*
                 * Patients exist, but none has a patient code.
                 * Start from P001.
                 */
                $nextNumber = 1;
            }
        }

        /*
         * Generate the patient code.
         *
         * 1  -> P001
         * 2  -> P002
         * 10 -> P010
         */
        $validated['patient_code'] =
            'P' . str_pad(
                $nextNumber,
                3,
                '0',
                STR_PAD_LEFT
            );

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

        /*
         * patient_code is intentionally NOT included here.
         *
         * This means editing a patient will never change
         * their patient ID.
         */
        $patient->update($validated);

        return response()->json([
            'message' => 'Patient updated successfully.',
            'patient' => $patient->fresh(),
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