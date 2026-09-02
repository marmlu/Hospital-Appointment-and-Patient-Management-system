import "../App.css";
import { useLocation, useNavigate } from "react-router-dom";
import Layout, { useLayout } from "../components/Layout";

function EditAppointment() {
    const location = useLocation();
    const navigate = useNavigate();

    const { toggleSidebar, addAppointment, updateAppointment } = useLayout();

    // Get appointment when editing
    const { appointment } = location.state || {};

    // Check whether this is New Appointment mode
    const isNewAppointment = location.pathname.endsWith("/new");

    // If editing but no appointment was provided
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const appointmentData = {
            patientId: Number(formData.get("patientId")),
            doctorId: Number(formData.get("doctorId")),
            department: formData.get("department"),
            date: formData.get("date"),
            time: convertTo12Hour(formData.get("time")),
            reason: formData.get("reason"),
            status: formData.get("status"),
            type: formData.get("type"),
            notes: formData.get("notes"),
        };

        // ========================================
        // NEW APPOINTMENT
        // ========================================

        if (isNewAppointment) {
            addAppointment(appointmentData);

            alert("Appointment created successfully!");

            navigate("/appointments");

            return;
        }

        // ========================================
        // EDIT APPOINTMENT
        // ========================================

        updateAppointment({
            id: appointment.id,
            ...appointmentData,
        });

        alert("Appointment updated successfully!");

        navigate("/appointments");
    };

    return (
        <Layout>
            {/* ========================================
                        PAGE HEADER
                    ======================================== */}

            <header className="page-header">
                <div className="page-header-left">
                    <button
                        className="hamburger"
                        type="button"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                    <div>
                        <h1>
                            {isNewAppointment
                                ? "New Appointment"
                                : "Edit Appointment"}
                        </h1>

                        <p>
                            {isNewAppointment
                                ? "Create a new hospital appointment."
                                : `Update the information for appointment #${appointment.id}.`}
                        </p>
                    </div>
                </div>
            </header>

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
                                    value={appointment.id}
                                    readOnly
                                />
                            </div>
                        )}

                        {/* Patient ID */}

                        <div className="form-group">
                            <label htmlFor="patient-id">Patient ID</label>

                            <input
                                id="patient-id"
                                name="patientId"
                                type="number"
                                defaultValue={
                                    isNewAppointment
                                        ? ""
                                        : appointment.patientId
                                }
                                placeholder="Enter patient ID"
                                required
                            />
                        </div>

                        {/* Doctor ID */}

                        <div className="form-group">
                            <label htmlFor="doctor-id">Doctor ID</label>

                            <input
                                id="doctor-id"
                                name="doctorId"
                                type="number"
                                defaultValue={
                                    isNewAppointment ? "" : appointment.doctorId
                                }
                                placeholder="Enter doctor ID"
                                required
                            />
                        </div>

                        {/* Department */}

                        <div className="form-group">
                            <label htmlFor="department">Department</label>

                            <select
                                id="department"
                                name="department"
                                defaultValue={
                                    isNewAppointment
                                        ? ""
                                        : appointment.department
                                }
                                required
                            >
                                <option value="" disabled>
                                    Select department
                                </option>

                                <option value="Cardiology">Cardiology</option>

                                <option value="Neurology">Neurology</option>

                                <option value="Orthopedics">Orthopedics</option>

                                <option value="Dermatology">Dermatology</option>

                                <option value="Pediatrics">Pediatrics</option>

                                <option value="Ophthalmology">
                                    Ophthalmology
                                </option>
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
                                    isNewAppointment ? "" : appointment.date
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
                                        : convertTo24Hour(appointment.time)
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
                                    isNewAppointment ? "" : appointment.type
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
                                    isNewAppointment ? "" : appointment.notes
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

/* ========================================
   CONVERT 12-HOUR → 24-HOUR
======================================== */

function convertTo24Hour(time) {
    if (!time) {
        return "";
    }

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

/* ========================================
   CONVERT 24-HOUR → 12-HOUR
======================================== */

function convertTo12Hour(time) {
    if (!time) {
        return "";
    }

    let [hours, minutes] = time.split(":");

    hours = Number(hours);

    const modifier = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    return `${String(hours).padStart(2, "0")}:${minutes} ${modifier}`;
}

export default EditAppointment;
