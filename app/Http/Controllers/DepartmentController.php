<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    // Get all departments
    public function index()
    {
        return response()->json(
            Department::all()
        );
    }

    // Add a new department
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'required|string',
        ]);

        $department = Department::create($validated);

        return response()->json(
            $department,
            201
        );
    }

    // Get one department
    public function show(Department $department)
    {
        return response()->json(
            $department
        );
    }

    // Update department
    public function update(
        Request $request,
        Department $department
    ) {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'required|string',
        ]);

        $department->update($validated);

        return response()->json(
            $department
        );
    }

    // Delete department
    public function destroy(Department $department)
    {
        $department->delete();

        return response()->json([
            'message' => 'Department deleted successfully'
        ]);
    }
}
