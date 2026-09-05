<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';
protected $fillable = [
    'appointment_number',
    'patient_id',
    'doctor_id',
    'appointment_date',
    'appointment_time',
    'reason',
    'status',
    'notes',
    'appointment_type',
];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}