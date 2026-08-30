import { Link } from "react-router-dom";
import "../App.css";
import Layout from "../components/Layout";

function AppointmentDashboard() {
    const upcomingAppointments = [
        {
            patient: "Abebe Kebede",
            doctor: "Dr. Jon Doe",
            time: "09:00 AM",
            status: "Approved",
        },
        {
            patient: "Hana Tesfaye",
            doctor: "Dr. Sarah Smith",
            time: "10:30 AM",
            status: "Pending",
        },
        {
            patient: "Meron Alemu",
            doctor: "Dr. Jon Doe",
            time: "01:00 PM",
            status: "Approved",
        },
        {
            patient: "Samuel Bekele",
            doctor: "Dr. Sarah Smith",
            time: "03:30 PM",
            status: "Pending",
        },
    ];

    const recentActivities = [
        {
            icon: "fa-calendar-check",
            title: "New appointment booked",
            description: "Abebe Kebede booked an appointment with Dr. Jon Doe.",
            time: "10 minutes ago",
        },
        {
            icon: "fa-user-plus",
            title: "New patient registered",
            description: "Hana Tesfaye was added to the system.",
            time: "30 minutes ago",
        },
        {
            icon: "fa-circle-check",
            title: "Appointment approved",
            description: "Dr. Jon Doe approved an appointment.",
            time: "1 hour ago",
        },
        {
            icon: "fa-pen",
            title: "Appointment updated",
            description: "An appointment schedule was updated.",
            time: "2 hours ago",
        },
    ];

    return (
        <Layout>
            <section className="dashboard">
                {/* ========================================
        DASHBOARD HEADER
    ======================================== */}

                <div className="dashboard-header">
                    <h1>Appointment Dashboard</h1>

                    <p>Welcome to your appointment dashboard.</p>
                </div>

                {/* ========================================
        OVERVIEW CARDS
    ======================================== */}

                <div className="overview-cards">
                    {/* Total Appointments */}

                    <div className="overview-card">
                        <div className="overview-icon">
                            <i className="fa-solid fa-calendar-check"></i>
                        </div>

                        <div className="overview-info">
                            <span>Total Appointments</span>

                            <h2>24</h2>

                            <small>This month</small>
                        </div>
                    </div>

                    {/* Pending */}

                    <div className="overview-card">
                        <div className="overview-icon">
                            <i className="fa-solid fa-clock"></i>
                        </div>

                        <div className="overview-info">
                            <span>Pending</span>

                            <h2>8</h2>

                            <small>Awaiting approval</small>
                        </div>
                    </div>

                    {/* Approved */}

                    <div className="overview-card">
                        <div className="overview-icon">
                            <i className="fa-solid fa-circle-check"></i>
                        </div>

                        <div className="overview-info">
                            <span>Approved</span>

                            <h2>12</h2>

                            <small>Confirmed appointments</small>
                        </div>
                    </div>

                    {/* Completed */}

                    <div className="overview-card">
                        <div className="overview-icon">
                            <i className="fa-solid fa-check-double"></i>
                        </div>

                        <div className="overview-info">
                            <span>Completed</span>

                            <h2>4</h2>

                            <small>Completed appointments</small>
                        </div>
                    </div>
                </div>

                {/* ========================================
        DASHBOARD GRID
    ======================================== */}

                <div className="dashboard-grid">
                    {/* ========================================
        UPCOMING APPOINTMENTS
    ======================================== */}

                    <div className="dashboard-card">
                        <div className="dashboard-card-header">
                            <div>
                                <h2>Upcoming Appointments</h2>

                                <p>Today's scheduled appointments</p>
                            </div>

                            <Link to="/appointments">View All</Link>
                        </div>

                        <div className="appointment-preview">
                            {upcomingAppointments.map((appointment, index) => (
                                <div className="appointment-item" key={index}>
                                    <div className="appointment-patient">
                                        <div className="patient-icon">
                                            <i className="fa-solid fa-user"></i>
                                        </div>

                                        <div>
                                            <strong>
                                                {appointment.patient}
                                            </strong>
                                            <span>{appointment.doctor}</span>
                                        </div>
                                    </div>

                                    <div className="appointment-time">
                                        <strong>{appointment.time}</strong>

                                        <span>{appointment.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ========================================
        RECENT ACTIVITY
    ======================================== */}

                    <div className="dashboard-card">
                        <div className="dashboard-card-header">
                            <div>
                                <h2>Recent Activity</h2>

                                <p>Latest system activities</p>
                            </div>

                            <Link to="/appointments">View All</Link>
                        </div>

                        <div className="activity-list">
                            {recentActivities.map((activity, index) => (
                                <div className="activity-item" key={index}>
                                    <div className="activity-icon">
                                        <i
                                            className={`fa-solid ${activity.icon}`}
                                        ></i>
                                    </div>

                                    <div>
                                        <strong>{activity.title}</strong>

                                        <span>{activity.description}</span>

                                        <small>{activity.time}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default AppointmentDashboard;
