import "../App.css";
import { useLocation, useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
function AppointmentDetails() {
    const { id } = useParams();
    const location = useLocation();

    const { appointment } = location.state;
    if (!appointment) {
        return (
            <Layout>
                <section className="appointment-details">
                    <h1>Appointment Not Found</h1>

                    <p>The appointment information could not be found.</p>

                    <Link to="/appointments" className="edit-btn">
                        Back to Appointments
                    </Link>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="appointment-details">
                <div className="details-header">
                    <div>
                        <h1>Appointment Details</h1>
                        <p>View detailed information about this appointment.</p>
                    </div>
                    <Link
                        to={`/edit-appointment/${appointment.id}`}
                        state={{ appointment }}
                        className="edit-btn"
                        title="Edit"
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                </div>
                <div className="details-grid">
                    <div className="details-card">
                        <h2>Appointment Information</h2>

                        <div className="two-column">
                            <div>
                                <span>Appointment ID</span>
                                <strong>{appointment.id}</strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>{appointment.status}</strong>
                            </div>

                            <div>
                                <span>Date</span>
                                <strong>{appointment.date}</strong>
                            </div>

                            <div>
                                <span>Time</span>
                                <strong>{appointment.time}</strong>
                            </div>

                            <div>
                                <span>Department</span>
                                <strong>{appointment.department}</strong>
                            </div>

                            <div>
                                <span>Type</span>
                                <strong>{appointment.type}</strong>
                            </div>

                            <div>
                                <span>Reason</span>
                                <strong>{appointment.reason}</strong>
                            </div>

                            <div>
                                <span>Patient ID</span>
                                <strong>{appointment.patientId}</strong>
                            </div>

                            <div>
                                <span>Doctor ID</span>
                                <strong>{appointment.doctorId}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="details-card">
                        <h2>Notes</h2>

                        <p>{appointment.notes}</p>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default AppointmentDetails;
