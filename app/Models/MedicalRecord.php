<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'appointment_id',
        'visit_date',
        'symptoms',
        'diagnosis',
        'treatment',
        'notes',
    ];

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }
}public function patient()
{
    return $this->belongsTo(Patient::class);
}
