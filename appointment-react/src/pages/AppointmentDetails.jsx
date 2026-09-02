import "../App.css";
import { useLocation, useParams, Link } from "react-router-dom";
import Layout, { useLayout } from "../components/Layout";

function AppointmentDetails() {
    const { id } = useParams();
    const location = useLocation();
    const { toggleSidebar } = useLayout();

    const appointment = location.state?.appointment;

    /*
     * If appointment data was not passed
     */
    if (!appointment) {
        return (
            <Layout>
                <section className="appointment-details">
                    <h1>Appointment Not Found</h1>

                    <p>The appointment information could not be found.</p>

                    <Link to="/appointments" className="back-btn">
                        <i className="fa-solid fa-arrow-left"></i>
                        Back to Appointments
                    </Link>
                </section>
            </Layout>
        );
    }

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
                        <h1>Appointment Details</h1>
                        <p>View complete information about this appointment.</p>
                    </div>
                </div>
            </header>

            {/* ========================================
                        APPOINTMENT DETAILS CONTENT
                    ======================================== */}

            <section className="appointment-details">
                {/* ========================================
                            DETAILS HEADER
                        ======================================== */}

                <div className="details-header">
                    <div>
                        <Link to="/appointments" className="back-btn">
                            <i className="fa-solid fa-arrow-left"></i>
                            Back to Appointments
                        </Link>

                        <h1>Appointment Details</h1>

                        <p>View complete information about this appointment.</p>
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

                {/* ========================================
                            APPOINTMENT INFORMATION
                        ======================================== */}

                <div className="details-card">
                    <div className="card-title">
                        <i className="fa-solid fa-calendar-check"></i>

                        <h2>Appointment Information</h2>
                    </div>

                    <div className="details-grid">
                        {/* Appointment ID */}

                        <div className="detail-item">
                            <span>Appointment ID</span>

                            <strong>{appointment.id}</strong>
                        </div>

                        {/* Status */}

                        <div className="detail-item">
                            <span>Status</span>

                            <span
                                className={`status ${appointment.status.toLowerCase()}`}
                            >
                                {appointment.status}
                            </span>
                        </div>

                        {/* Date */}

                        <div className="detail-item">
                            <span>Date</span>

                            <strong>{appointment.date}</strong>
                        </div>

                        {/* Time */}

                        <div className="detail-item">
                            <span>Time</span>

                            <strong>{appointment.time}</strong>
                        </div>

                        {/* Type */}

                        <div className="detail-item">
                            <span>Type</span>

                            <strong>{appointment.type}</strong>
                        </div>
                    </div>
                </div>

                {/* ========================================
                            PATIENT AND DOCTOR
                        ======================================== */}

                <div className="two-column">
                    {/* ========================================
                                PATIENT INFORMATION
                            ======================================== */}

                    <div className="details-card">
                        <div className="card-title">
                            <i className="fa-solid fa-user"></i>

                            <h2>Patient Information</h2>
                        </div>

                        <div className="detail-list">
                            <div className="detail-item">
                                <span>Patient ID</span>

                                <strong>{appointment.patientId}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Patient Name</span>

                                <strong>Not available</strong>
                            </div>

                            <div className="detail-item">
                                <span>Phone</span>

                                <strong>Not available</strong>
                            </div>

                            <div className="detail-item">
                                <span>Email</span>

                                <strong>Not available</strong>
                            </div>

                            <div className="detail-item">
                                <span>Gender</span>

                                <strong>Not available</strong>
                            </div>

                            <div className="detail-item">
                                <span>Age</span>

                                <strong>Not available</strong>
                            </div>
                        </div>
                    </div>

                    {/* ========================================
                                DOCTOR INFORMATION
                            ======================================== */}

                    <div className="details-card">
                        <div className="card-title">
                            <i className="fa-solid fa-user-doctor"></i>

                            <h2>Doctor Information</h2>
                        </div>

                        <div className="detail-list">
                            <div className="detail-item">
                                <span>Doctor ID</span>

                                <strong>{appointment.doctorId}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Department</span>

                                <strong>{appointment.department}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Doctor Name</span>

                                <strong>Not available</strong>
                            </div>

                            <div className="detail-item">
                                <span>Specialization</span>

                                <strong>Not available</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================
                            APPOINTMENT REASON
                        ======================================== */}

                <div className="details-card">
                    <div className="card-title">
                        <i className="fa-solid fa-notes-medical"></i>

                        <h2>Appointment Reason</h2>
                    </div>

                    <p className="description">{appointment.reason}</p>
                </div>

                {/* ========================================
                            NOTES
                        ======================================== */}

                <div className="details-card">
                    <div className="card-title">
                        <i className="fa-solid fa-note-sticky"></i>

                        <h2>Notes</h2>
                    </div>

                    <p className="description">
                        {appointment.notes || "No notes available."}
                    </p>
                </div>
            </section>
        </Layout>
    );
}

export default AppointmentDetails;
