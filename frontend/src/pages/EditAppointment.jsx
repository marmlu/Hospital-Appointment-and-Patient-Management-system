import "./App.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout, { useLayout } from "../components/Layout";

function EditAppointment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    // Check whether this is New Appointment mode
    const isNewAppointment = location.pathname.endsWith("/new");

    // Get appointment when editing
    const [appointment, setAppointment] = useState(
        location.state?.appointment || null,
    );

    const [loading, setLoading] = useState(!isNewAppointment);
    const [patients, setPatients] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");

    // ========================================
    // FETCH APPOINTMENT WHEN EDITING
    // ========================================

    useEffect(() => {
        if (isNewAppointment) {
            return;
        }

        fetch(`http://127.0.0.1:8000/api/appointments/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch appointment");
                }

                return response.json();
            })
            .then((data) => {
                setAppointment(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching appointment:", error);
                setLoading(false);
            });
    }, [id, isNewAppointment]);

    // ========================================
    // FETCH PATIENTS, DEPARTMENTS & DOCTORS
    // ========================================

    useEffect(() => {
        Promise.all([
            fetch("http://127.0.0.1:8000/api/patients"),
            fetch("http://127.0.0.1:8000/api/departments"),
            fetch("http://127.0.0.1:8000/api/doctors"),
        ])
            .then(
                async ([
                    patientsResponse,
                    departmentsResponse,
                    doctorsResponse,
                ]) => {
                    if (!patientsResponse.ok) {
                        throw new Error("Failed to fetch patients");
                    }

                    if (!departmentsResponse.ok) {
                        throw new Error("Failed to fetch departments");
                    }

                    if (!doctorsResponse.ok) {
                        throw new Error("Failed to fetch doctors");
                    }

                    const patientsData = await patientsResponse.json();
                    const departmentsData = await departmentsResponse.json();
                    const doctorsData = await doctorsResponse.json();

                    setPatients(patientsData);
                    setDepartments(departmentsData);
                    setDoctors(doctorsData);
                },
            )
            .catch((error) => {
                console.error(
                    "Error fetching patients/departments/doctors:",
                    error,
                );
            });
    }, []);

    // ========================================
    // SET DEPARTMENT WHEN EDITING
    // ========================================

    useEffect(() => {
        if (!isNewAppointment && appointment?.doctor?.department) {
            setSelectedDepartment(String(appointment.doctor.department.id));
        }
    }, [appointment, isNewAppointment]);

    // ========================================
    // SET DOCTOR WHEN EDITING
    // ========================================

    useEffect(() => {
        if (!isNewAppointment && appointment?.doctor_id) {
            setSelectedDoctor(String(appointment.doctor_id));
        }
    }, [appointment, isNewAppointment]);

    // ========================================
    // FILTER DOCTORS BY DEPARTMENT
    // ========================================

    const filteredDoctors = selectedDepartment
        ? doctors.filter(
              (doctor) =>
                  String(doctor.department?.id) === String(selectedDepartment),
          )
        : doctors;

    // ========================================
    // LOADING
    // ========================================

    if (loading) {
        return (
            <Layout>
                <section className="edit-appointment">
                    <h1>Loading Appointment...</h1>

                    <p>
                        Please wait while the appointment information is being
                        loaded.
                    </p>
                </section>
            </Layout>
        );
    }

    // ========================================
    // APPOINTMENT NOT FOUND
    // ========================================

    if (!appointment && !isNewAppointment) {
        return (
            <Layout>
                <section className="edit-appointment">
                    <h1>Appointment Not Found</h1>

                    <p>
                        The appointment you are trying to edit does not exist or
                        was not selected.
                    </p>

                    <button
                        className="cancel-btn"
                        onClick={() => navigate("/appointments")}
                    >
                        Back to Appointments
                    </button>
                </section>
            </Layout>
        );
    }

    // ========================================
    // HANDLE FORM SUBMISSION
    // ========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const appointmentData = {
            patient_id: Number(formData.get("patientId")),
            doctor_id: Number(formData.get("doctorId")),
            appointment_date: formData.get("date"),
            appointment_time: formData.get("time"),
            reason: formData.get("reason"),
            status: formData.get("status").toLowerCase(),
            notes: formData.get("notes"),
            appointment_type: formData.get("type"),
        };

        // ========================================
        // NEW APPOINTMENT
        // ========================================

        if (isNewAppointment) {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/appointments",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify(appointmentData),
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error("Validation error:", data);
                    throw new Error("Failed to create appointment");
                }

                alert("Appointment created successfully!");

                navigate("/appointments");
            } catch (error) {
                console.error("Error creating appointment:", error);
                alert("Failed to create appointment.");
            }

            return;
        }

        // ========================================
        // EDIT APPOINTMENT
        // ========================================

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/appointments/${appointment.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(appointmentData),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Validation error:", data);
                throw new Error("Failed to update appointment");
            }

            alert("Appointment updated successfully!");

            navigate("/appointments");
        } catch (error) {
            console.error("Error updating appointment:", error);
            alert("Failed to update appointment.");
        }
    };

    return (
        <Layout>
            {/* ========================================
                PAGE HEADER
            ======================================== */}

           

            {/* ========================================
                FORM
            ======================================== */}

            <section className="edit-appointment">
                <div className="form-card">
                    <div className="card-title">
                        <h2>Appointment Information</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Appointment ID */}

                        {!isNewAppointment && (
                            <div className="form-group">
                                <label htmlFor="appointment-id">
                                    Appointment ID
                                </label>

                                <input
                                    id="appointment-id"
                                    type="text"
                                    value={
                                        appointment.appointment_number ??
                                        appointment.appointmentNumber ??
                                        appointment.id
                                    }
                                    readOnly
                                />
                            </div>
                        )}

                        {/* Patient ID */}

                        <div className="form-group">
                            <label htmlFor="patient-id">Patient ID</label>

                            <select
                                id="patient-id"
                                name="patientId"
                                defaultValue={
                                    isNewAppointment
                                        ? ""
                                        : (appointment.patientId ??
                                          appointment.patient_id ??
                                          "")
                                }
                                required
                            >
                                <option value="" disabled>
                                    Select patient id
                                </option>

                                {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.patient_code}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department */}

                        <div className="form-group">
                            <label htmlFor="department">Department</label>

                            <select
                                id="department"
                                name="department"
                                value={selectedDepartment}
                                onChange={(e) => {
                                    setSelectedDepartment(e.target.value);
                                    setSelectedDoctor("");
                                }}
                                required
                            >
                                <option value="" disabled>
                                    Select department
                                </option>

                                {departments.map((department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Doctor ID */}

                        <div className="form-group">
                            <label htmlFor="doctor-id">Doctor</label>

                            <select
                                id="doctor-id"
                                name="doctorId"
                                value={selectedDoctor}
                                onChange={(e) =>
                                    setSelectedDoctor(e.target.value)
                                }
                                required
                            >
                                <option value="" disabled>
                                    Select doctor
                                </option>

                                {filteredDoctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {`D${String(doctor.id).padStart(
                                            3,
                                            "0",
                                        )}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}

                        <div className="form-group">
                            <label htmlFor="appointment-date">Date</label>

                            <input
                                id="appointment-date"
                                name="date"
                                type="date"
                                defaultValue={
                                    isNewAppointment
                                        ? ""
                                        : (appointment.date ??
                                          appointment.appointment_date)
                                }
                                required
                            />
                        </div>

                        {/* Time */}

                        <div className="form-group">
                            <label htmlFor="appointment-time">Time</label>

                            <input
                                id="appointment-time"
                                name="time"
                                type="time"
                                defaultValue={
                                    isNewAppointment
                                        ? ""
                                        : convertTo24Hour(
                                              appointment.time ??
                                                  appointment.appointment_time,
                                          )
                                }
                                required
                            />
                        </div>

                        {/* Reason */}

                        <div className="form-group">
                            <label htmlFor="reason">Reason</label>

                            <input
                                id="reason"
                                name="reason"
                                type="text"
                                defaultValue={
                                    isNewAppointment ? "" : appointment.reason
                                }
                                placeholder="Enter appointment reason"
                                required
                            />
                        </div>

                        {/* Status */}

                        <div className="form-group">
                            <label htmlFor="status">Status</label>

                            <select
                                id="status"
                                name="status"
                                defaultValue={
                                    isNewAppointment ? "" : appointment.status
                                }
                                required
                            >
                                <option value="" disabled>
                                    Select status
                                </option>

                                <option value="Pending">Pending</option>

                                <option value="Approved">Approved</option>

                                <option value="Completed">Completed</option>

                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Type */}

                        <div className="form-group">
                            <label htmlFor="type">Type</label>

                            <select
                                id="type"
                                name="type"
                                defaultValue={
                                    isNewAppointment
                                        ? ""
                                        : (appointment.type ??
                                          appointment.appointment_type ??
                                          "")
                                }
                                required
                            >
                                <option value="" disabled>
                                    Select appointment type
                                </option>

                                <option value="Walk-in">Walk-in</option>

                                <option value="Follow-up">Follow-up</option>

                                <option value="Consultation">
                                    Consultation
                                </option>

                                <option value="Emergency">Emergency</option>

                                <option value="Online">Online</option>
                            </select>
                        </div>

                        {/* Notes */}

                        <div className="form-group full-width">
                            <label htmlFor="notes">Notes</label>

                            <textarea
                                id="notes"
                                name="notes"
                                rows="5"
                                defaultValue={
                                    isNewAppointment
                                        ? ""
                                        : (appointment.notes ?? "")
                                }
                                placeholder="Enter appointment notes"
                            ></textarea>
                        </div>

                        {/* Form Actions */}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    if (isNewAppointment) {
                                        navigate("/appointments");
                                    } else {
                                        navigate(
                                            `/appointment-details/${appointment.id}`,
                                            {
                                                state: { appointment },
                                            },
                                        );
                                    }
                                }}
                            >
                                Cancel
                            </button>

                            <button type="submit" className="save-btn">
                                <i className="fa-solid fa-floppy-disk"></i>

                                {isNewAppointment
                                    ? "Create Appointment"
                                    : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </Layout>
    );
}

// ========================================
// CONVERT 12-HOUR → 24-HOUR
// ========================================

function convertTo24Hour(time) {
    if (!time) {
        return "";
    }

    // Laravel/database format: HH:MM:SS
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
        return time.slice(0, 5);
    }

    // Frontend format: HH:MM AM/PM
    const [timePart, modifier] = time.split(" ");

    let [hours, minutes] = timePart.split(":");

    if (modifier === "PM" && hours !== "12") {
        hours = String(Number(hours) + 12);
    }

    if (modifier === "AM" && hours === "12") {
        hours = "00";
    }

    return `${hours.padStart(2, "0")}:${minutes}`;
}

export default EditAppointment;
