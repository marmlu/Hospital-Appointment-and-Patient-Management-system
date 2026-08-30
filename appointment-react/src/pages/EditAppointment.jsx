import "../App.css";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function EditAppointment() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get the selected appointment from Appointments.jsx
    const { appointment } = location.state || {};

    // If no appointment was passed
    if (!appointment) {
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

    return (
        <Layout>
            <section className="edit-appointment">
                {/* ========================================
                        HEADER
                    ======================================== */}

                <div className="edit-header">
                    <div>
                        <h1>Edit Appointment</h1>

                        <p>
                            Update the information for appointment #
                            {appointment.id}.
                        </p>
                    </div>
                </div>

                {/* ========================================
                        FORM CARD
                    ======================================== */}

                <div className="form-card">
                    <div className="card-title">
                        <h2>Appointment Information</h2>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();

                            // Temporary behavior.
                            // Later this will send the updated
                            // appointment to Laravel.
                            alert("Appointment updated successfully!");
                        }}
                    >
                        {/* Appointment ID */}

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

                        {/* Patient ID */}

                        <div className="form-group">
                            <label htmlFor="patient-id">Patient ID</label>

                            <input
                                id="patient-id"
                                type="number"
                                defaultValue={appointment.patientId}
                            />
                        </div>

                        {/* Doctor ID */}

                        <div className="form-group">
                            <label htmlFor="doctor-id">Doctor ID</label>

                            <input
                                id="doctor-id"
                                type="number"
                                defaultValue={appointment.doctorId}
                            />
                        </div>

                        {/* Department */}

                        <div className="form-group">
                            <label htmlFor="department">Department</label>

                            <select
                                id="department"
                                defaultValue={appointment.department}
                            >
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
                                type="date"
                                defaultValue={appointment.date}
                            />
                        </div>

                        {/* Time */}

                        <div className="form-group">
                            <label htmlFor="appointment-time">Time</label>

                            <input
                                id="appointment-time"
                                type="time"
                                defaultValue={appointment.time}
                            />
                        </div>

                        {/* Reason */}

                        <div className="form-group">
                            <label htmlFor="reason">Reason</label>

                            <input
                                id="reason"
                                type="text"
                                defaultValue={appointment.reason}
                            />
                        </div>

                        {/* Status */}

                        <div className="form-group">
                            <label htmlFor="status">Status</label>

                            <select
                                id="status"
                                defaultValue={appointment.status}
                            >
                                <option value="Pending">Pending</option>

                                <option value="Approved">Approved</option>

                                <option value="Completed">Completed</option>

                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Type */}

                        <div className="form-group">
                            <label htmlFor="type">Type</label>

                            <select id="type" defaultValue={appointment.type}>
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
                                rows="5"
                                defaultValue={appointment.notes}
                            ></textarea>
                        </div>

                        {/* Form Actions */}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() =>
                                    navigate(
                                        `/appointment-details/${appointment.id}`,
                                        {
                                            state: { appointment },
                                        },
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button type="submit" className="save-btn">
                                <i className="fa-solid fa-floppy-disk"></i>
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </Layout>
    );
}

export default EditAppointment;
