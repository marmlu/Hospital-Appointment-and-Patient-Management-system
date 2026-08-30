<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    // =====================================================
    // GET ALL DOCTORS
    // =====================================================

    public function index()
    {
        $doctors = Doctor::with(['department', 'user'])->get();

        return response()->json($doctors);
    }


    // =====================================================
    // ADD DOCTOR
    // =====================================================

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            'department_id' =>
                'required|exists:departments,id',

            'specialization' =>
                'required|string|max:255',

            'qualification' =>
                'required|string|max:255',

            'experience' =>
                'required|integer|min:0',

            'phone' =>
                'required|string|max:255',

            'working_days' =>
                'nullable|string|max:255',

            'start_time' =>
                'nullable|date_format:H:i',

            'end_time' =>
                'nullable|date_format:H:i',
        ]);


        // =================================================
        // CREATE USER
        // =================================================

        $user = User::create([

            'name' =>
                $validated['name'],

            'email' =>
                'doctor' . time() . '@ethio-care.local',

            'password' =>
                Hash::make('password123'),

        ]);


        // =================================================
        // CREATE DOCTOR
        // =================================================

        $doctor = Doctor::create([

            'department_id' =>
                $validated['department_id'],

            'user_id' =>
                $user->id,

            'specialization' =>
                $validated['specialization'],

            'qualification' =>
                $validated['qualification'],

            'experience' =>
                $validated['experience'],

            'phone' =>
                $validated['phone'],

            'working_days' =>
                $validated['working_days'] ?? null,

            'start_time' =>
                $validated['start_time'] ?? null,

            'end_time' =>
                $validated['end_time'] ?? null,

        ]);


        return response()->json(

            $doctor->load([
                'department',
                'user'
            ]),

            201
        );
    }


    // =====================================================
    // GET ONE DOCTOR
    // =====================================================

    public function show(Doctor $doctor)
    {
        return response()->json(

            $doctor->load([
                'department',
                'user'
            ])

        );
    }


    // =====================================================
    // UPDATE DOCTOR
    // =====================================================

    public function update(
        Request $request,
        Doctor $doctor
    ) {

        $validated = $request->validate([

            'name' =>
                'required|string|max:255',

            'user_id' =>
                'required|exists:users,id',

            'department_id' =>
                'required|exists:departments,id',

            'specialization' =>
                'required|string|max:255',

            'qualification' =>
                'required|string|max:255',

            'experience' =>
                'required|integer|min:0',

            'phone' =>
                'required|string|max:255',

            'working_days' =>
                'nullable|string|max:255',

            'start_time' =>
                'nullable|date_format:H:i',

            'end_time' =>
                'nullable|date_format:H:i',

        ]);


        // =================================================
        // UPDATE USER NAME
        // =================================================

        $user = User::find(
            $validated['user_id']
        );


        if ($user) {

            $user->update([

                'name' =>
                    $validated['name']

            ]);
        }


        // =================================================
        // UPDATE DOCTOR
        // =================================================

        $doctor->update([

            'department_id' =>
                $validated['department_id'],

            'user_id' =>
                $validated['user_id'],

            'specialization' =>
                $validated['specialization'],

            'qualification' =>
                $validated['qualification'],

            'experience' =>
                $validated['experience'],

            'phone' =>
                $validated['phone'],

            'working_days' =>
                $validated['working_days'] ?? null,

            'start_time' =>
                $validated['start_time'] ?? null,

            'end_time' =>
                $validated['end_time'] ?? null,

        ]);


        return response()->json(

            $doctor->load([
                'department',
                'user'
            ])

        );
    }


    // =====================================================
    // DELETE DOCTOR
    // =====================================================

    public function destroy(Doctor $doctor)
    {
        $user = $doctor->user;


        $doctor->delete();


        // Delete the related user too

        if ($user) {

            $user->delete();

        }


        return response()->json([

            'message' =>
                'Doctor deleted successfully'

        ]);
    }
}