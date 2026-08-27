<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DoctorController;

Route::apiResource('departments', DepartmentController::class);
Route::apiResource('doctors', DoctorController::class);