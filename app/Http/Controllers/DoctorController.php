<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    // Get all doctors
    public function index()
    {
        $doctors = Doctor::with(['user', 'department'])->get();

        return response()->json($doctors);
    }

    // Add doctor
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'specialization' => 'required|string|max:255',
            'qualification' => 'required|string|max:255',
            'experience' => 'required|integer|min:0',
            'phone' => 'required|string|max:255',
            'working_days' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => 'doctor' . time() . '@hospital.com',
            'password' => Hash::make('password'),
        ]);

        $doctor = Doctor::create([
            'user_id' => $user->id,
            'department_id' => $validated['department_id'],
            'specialization' => $validated['specialization'],
            'qualification' => $validated['qualification'],
            'experience' => $validated['experience'],
            'phone' => $validated['phone'],
            'working_days' => $validated['working_days'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);

        return response()->json(
            $doctor->load(['user', 'department']),
            201
        );
    }

    // Get one doctor
    public function show(Doctor $doctor)
    {
        return response()->json(
            $doctor->load(['user', 'department'])
        );
    }

    // Update doctor
    public function update(Request $request, Doctor $doctor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
            'department_id' => 'required|exists:departments,id',
            'specialization' => 'required|string|max:255',
            'qualification' => 'required|string|max:255',
            'experience' => 'required|integer|min:0',
            'phone' => 'required|string|max:255',
            'working_days' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        User::where('id', $validated['user_id'])->update([
            'name' => $validated['name'],
        ]);

        $doctor->update([
            'department_id' => $validated['department_id'],
            'specialization' => $validated['specialization'],
            'qualification' => $validated['qualification'],
            'experience' => $validated['experience'],
            'phone' => $validated['phone'],
            'working_days' => $validated['working_days'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);

        return response()->json(
            $doctor->load(['user', 'department'])
        );
    }

    // Delete doctor
    public function destroy(Doctor $doctor)
    {
        $doctor->delete();

        return response()->json([
            'message' => 'Doctor deleted successfully'
        ]);
    }
}