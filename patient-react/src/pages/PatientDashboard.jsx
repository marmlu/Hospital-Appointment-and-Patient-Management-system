import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import "./PatientDashboard.css";

function PatientDashboard() {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);

    /* ========================================
       LOAD PATIENTS
    ======================================== */

    useEffect(() => {
        const storedPatients =
            JSON.parse(localStorage.getItem("patients")) || [];

        setPatients(storedPatients);
    }, []);

    /* ========================================
       CALCULATE DASHBOARD COUNTS
    ======================================== */

    const totalPatients = patients.length;

    const dischargedPatients = patients.filter(
        (patient) => patient.status === "Discharged",
    ).length;

    const admittedPatients = patients.filter(
        (patient) => patient.status === "Admitted",
    ).length;

    const newPatients = patients.filter(
        (patient) => patient.status === "Check-up",
    ).length;

    /* ========================================
       RECENT PATIENTS
    ======================================== */

    const recentPatients = [...patients].reverse().slice(0, 5);

    /* ========================================
       REFRESH DASHBOARD
    ======================================== */

    function refreshPatients() {
        const storedPatients =
            JSON.parse(localStorage.getItem("patients")) || [];

        setPatients(storedPatients);
    }

    /* ========================================
       RENDER
    ======================================== */

    return (
        <div className="patient-dashboard-page">
            <Sidebar />

            <main className="patient-dashboard-main">
                {/* ====================================
                    PAGE HEADER
                ==================================== */}

                <section className="patient-dashboard-header">
                    <div>
                        <h1>Patient Dashboard</h1>

                        <p>
                            Welcome to the Patient Management Dashboard. Manage
                            patient records quickly and efficiently.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-patient-btn"
                        onClick={() => navigate("/patients/add")}
                    >
                        <i className="fa-solid fa-plus"></i>
                        Add Patient
                    </button>
                </section>

                {/* ====================================
                    DASHBOARD OVERVIEW
                ==================================== */}

                <section className="dashboard-overview">
                    <h2>Dashboard Overview</h2>

                    <div className="summary-cards">
                        {/* TOTAL PATIENTS */}

                        <div className="card">
                            <i className="fa-solid fa-users"></i>

                            <h3>Total Patients</h3>

                            <p className="count">{totalPatients}</p>
                        </div>

                        {/* DISCHARGED PATIENTS */}

                        <div className="card">
                            <i className="fa-solid fa-user-check"></i>

                            <h3>Discharged Patients</h3>

                            <p className="count">{dischargedPatients}</p>
                        </div>

                        {/* NEW PATIENTS */}

                        <div className="card">
                            <i className="fa-solid fa-user-plus"></i>

                            <h3>New Patients</h3>

                            <p className="count">{newPatients}</p>
                        </div>

                        {/* ADMITTED PATIENTS */}

                        <div className="card">
                            <i className="fa-solid fa-bed"></i>

                            <h3>Admitted Patients</h3>

                            <p className="count">{admittedPatients}</p>
                        </div>
                    </div>
                </section>

                {/* ====================================
                    RECENT PATIENTS
                ==================================== */}

                <section className="recent-patients">
                    <div className="section-title-row">
                        <h2>Recent Patients</h2>

                        <button
                            type="button"
                            className="refresh-btn"
                            onClick={refreshPatients}
                        >
                            <i className="fa-solid fa-rotate"></i>
                            Refresh
                        </button>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Patient Name</th>
                                    <th>Gender</th>
                                    <th>Age</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentPatients.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="empty-patients"
                                        >
                                            No patients found.
                                        </td>
                                    </tr>
                                ) : (
                                    recentPatients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td>{patient.id}</td>

                                            <td>{patient.name}</td>

                                            <td>{patient.gender}</td>

                                            <td>{patient.age}</td>

                                            <td>
                                                <span
                                                    className={`dashboard-status ${getStatusClass(
                                                        patient.status,
                                                    )}`}
                                                >
                                                    {patient.status}
                                                </span>
                                            </td>

                                            <td className="dashboard-actions">
                                                <button
                                                    type="button"
                                                    className="dashboard-view-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/patient-details/${patient.id}`,
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    className="dashboard-edit-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/patients/edit/${patient.id}`,
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ====================================
                    QUICK ACTIONS
                ==================================== */}

                <section className="quick-actions">
                    <h2>Quick Actions</h2>

                    <div className="action-container">
                        {/* ADD PATIENT */}

                        <div className="action-card">
                            <i className="fa-solid fa-user-plus"></i>

                            <h3>Add Patient</h3>

                            <button
                                type="button"
                                onClick={() => navigate("/patients/add")}
                            >
                                Add New
                            </button>
                        </div>

                        {/* VIEW PATIENTS */}

                        <div className="action-card">
                            <i className="fa-solid fa-users"></i>

                            <h3>View Patients</h3>

                            <button
                                type="button"
                                onClick={() => navigate("/patients")}
                            >
                                View All
                            </button>
                        </div>

                        {/* APPOINTMENTS */}

                        <div className="action-card">
                            <i className="fa-solid fa-calendar-check"></i>

                            <h3>Appointments</h3>

                            <button
                                type="button"
                                onClick={() =>
                                    alert(
                                        "Appointment module will be connected here.",
                                    )
                                }
                            >
                                Schedule
                            </button>
                        </div>

                        {/* PATIENT RECORDS */}

                        <div className="action-card">
                            <i className="fa-solid fa-file-medical"></i>

                            <h3>Patient Records</h3>

                            <button
                                type="button"
                                onClick={() =>
                                    alert(
                                        "Patient records will be connected here.",
                                    )
                                }
                            >
                                Open
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

/* ========================================
   STATUS CLASS
======================================== */

function getStatusClass(status) {
    if (status === "Admitted") {
        return "status-admitted";
    }

    if (status === "Discharged") {
        return "status-discharged";
    }

    return "status-checkup";
}

export default PatientDashboard;
