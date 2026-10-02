import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";

const mapAppointment = (appointment) => {
    return {
        id: appointment.id,

        appointmentNumber:
            appointment.appointment_number || "N/A",

        patientId: appointment.patient_id,

        patient: appointment.patient,

        doctorId: appointment.doctor_id,

        doctor: appointment.doctor,

        department:
            appointment.doctor?.department?.name || "Not available",

        date: appointment.appointment_date,

        time: appointment.appointment_time,

        reason: appointment.reason || "Not specified",

        status: appointment.status
            ? appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)
            : "Not specified",

        notes: appointment.notes || "",

        type: appointment.appointment_type || "Not specified",
    };
};

function AppointmentDetails() {
    const { id } = useParams();
    const location = useLocation();

    const passedAppointment = location.state?.appointment;

    const [appointment, setAppointment] = useState(
        passedAppointment || null
    );

    const [loading, setLoading] = useState(!passedAppointment);
    const [error, setError] = useState("");

    useEffect(() => {
        // If appointment was already passed from Appointments page,
        // there is no need to fetch it again.
        if (passedAppointment) {
            setAppointment(passedAppointment);
            setLoading(false);
            return;
        }

        // If page was opened directly using the URL,
        // fetch the appointment using the ID.
        const fetchAppointment = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://127.0.0.1:8000/api/appointments/${id}`
                );

                if (!response.ok) {
                    throw new Error("Appointment not found.");
                }

                const data = await response.json();

                setAppointment(mapAppointment(data));
            } catch (error) {
                console.error(
                    "Error fetching appointment:",
                    error
                );

                setError(" Failed to load appointment details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [id, passedAppointment]);

    // Loading
    if (loading) {
        return (
            <section className="appointment-details">
                <Link
                    to="/appointments"
                    className="back-btn"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Appointments
                    <br/>
                <br/>
                </Link>

                <p>Loading appointment details...</p>
            </section>
        );
    }

    // Error
    if (error || !appointment) {
        return (
            <section className="appointment-details">
                <Link
                    to="/appointments"
                    className="back-btn"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Appointments
                </Link>

                <p>
                    {error || "Appointment not found."}
                </p>
            </section>
        );
    }

    return (
        <section className="appointment-details">

            <div className="details-header">

                <div>
                    <Link
                        to="/appointments"
                        className="back-btn"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Back to Appointments
                    </Link>
                </div>

                <Link
                    to={`/edit-appointment/${appointment.id}`}
                    state={{ appointment }}
                    className="edit-appointment-btn"
                >
                    <i className="fa-solid fa-pen-to-square"></i>
                    Edit Appointment
                </Link>

            </div>


            {/* Appointment Information */}

            <div className="details-card">

                <div className="card-title">
                    <i className="fa-solid fa-calendar-check"></i>
                    <h2>Appointment Information</h2>
                </div>

                <div className="details-grid">

                    <div className="detail-item">
                        <span>Appointment ID</span>
                        <strong>
                            {appointment.appointmentNumber}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Status</span>

                        <strong
                            className={`status ${appointment.status?.toLowerCase()}`}
                        >
                            {appointment.status}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Date</span>
                        <strong>
                            {appointment.date}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Time</span>
                        <strong>
                            {appointment.time}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Type</span>
                        <strong>
                            {appointment.type}
                        </strong>
                    </div>

                </div>

            </div>


            {/* Patient + Doctor */}

            <div className="two-column">

                {/* Patient Information */}

                <div className="details-card">

                    <div className="card-title">
                        <i className="fa-solid fa-user"></i>
                        <h2>Patient Information</h2>
                    </div>

                    <div className="detail-list">

                        <div className="detail-item">
                            <span>Patient ID</span>

                            <strong>
                                {appointment.patient?.patient_code ||
                                    "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Patient Name</span>

                            <strong>
                                {appointment.patient
                                    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                                    : "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Phone</span>

                            <strong>
                                {appointment.patient?.phone ||
                                    "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Email</span>

                            <strong>
                                {appointment.patient?.email ||
                                    "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Gender</span>

                            <strong>
                                {appointment.patient?.gender ||
                                    "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Date of Birth</span>

                            <strong>
                                {appointment.patient?.date_of_birth ||
                                    "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Address</span>

                            <strong>
                                {appointment.patient?.address ||
                                    "Not available"}
                            </strong>
                        </div>

                    </div>

                </div>


                {/* Doctor Information */}

                <div className="details-card">

                    <div className="card-title">
                        <i className="fa-solid fa-user-doctor"></i>
                        <h2>Doctor Information</h2>
                    </div>

                    <div className="detail-list">

                        <div className="detail-item">
                            <span>Doctor ID</span>

                            <strong>
                                {appointment.doctor
                                    ? `D${String(
                                          appointment.doctor.id
                                      ).padStart(3, "0")}`
                                    : "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Doctor Name</span>

                            <strong>
                                {appointment.doctor?.user?.name ||
                                    "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Department</span>

                            <strong>
                                {appointment.doctor?.department?.name ||
                                    "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Specialization</span>

                            <strong>
                                {appointment.doctor?.specialization ||
                                    "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Qualification</span>

                            <strong>
                                {appointment.doctor?.qualification ||
                                    "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Experience</span>

                            <strong>
                                {appointment.doctor?.experience !==
                                undefined
                                    ? `${appointment.doctor.experience} years`
                                    : "Not available"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Phone</span>

                            <strong>
                                {appointment.doctor?.phone ||
                                    "Not available"}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>


            {/* Appointment Reason */}

            <div className="details-card">

                <div className="card-title">
                    <i className="fa-solid fa-notes-medical"></i>
                    <h2>Appointment Reason</h2>
                </div>

                <p className="description">
                    {appointment.reason ||
                        "No reason provided."}
                </p>

            </div>


            {/* Notes */}

            <div className="details-card">

                <div className="card-title">
                    <i className="fa-solid fa-note-sticky"></i>
                    <h2>Notes</h2>
                </div>

                <p className="description">
                    {appointment.notes ||
                        "No notes available."}
                </p>

            </div>

        </section>
    );
}

export default AppointmentDetails;