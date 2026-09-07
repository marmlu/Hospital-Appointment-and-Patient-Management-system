import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { getPatient } from "../api/patientApi";

import "./PatientDetails.css";

function PatientDetails() {
    const navigate = useNavigate();
    const { patientId } = useParams();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadPatient() {
            try {
                setLoading(true);
                setError("");

                const data = await getPatient(patientId);

                setPatient(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load patient.");
            } finally {
                setLoading(false);
            }
        }

        loadPatient();
    }, [patientId]);

    /* ========================================
       LOADING
    ======================================== */

    if (loading) {
        return (
            <div className="patient-details-page">
                <Sidebar />

                <main className="patient-details-main">
                    <div className="patient-details-card">
                        <h1>Loading Patient...</h1>
                    </div>
                </main>
            </div>
        );
    }

    /* ========================================
       PATIENT NOT FOUND
    ======================================== */

    if (error || !patient) {
        return (
            <div className="patient-details-page">
                <Sidebar />

                <main className="patient-details-main">
                    <div className="patient-details-card">
                        <h1>Patient Not Found</h1>

                        <p>
                            {error ||
                                "The patient you are looking for does not exist."}
                        </p>

                        <button
                            type="button"
                            className="back-btn"
                            onClick={() => navigate("/patients")}
                        >
                            Back to Patients
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    /* ========================================
       EDIT PATIENT
    ======================================== */

    function handleEdit() {
        navigate(`/patients/edit/${patient.id}`);
    }

    /* ========================================
       PAGE
    ======================================== */

    return (
        <div className="patient-details-page">
            <Sidebar />

            <main className="patient-details-main">
                {/* PAGE HEADER */}

                <div className="patient-details-header">
                    <div>
                        <h1>Patient Details</h1>

                        <p>View the complete information for this patient.</p>
                    </div>
                </div>

                {/* PATIENT CARD */}

                <div className="patient-details-card">
                    <div className="patient-details-title">
                        <div>
                            <h2>
                                {patient.first_name} {patient.last_name}
                            </h2>

                            <p>Patient ID: {patient.id}</p>
                        </div>

                        <span
                            className={`patient-details-status ${getStatusClass(
                                patient.status,
                            )}`}
                        >
                            {patient.status || "Check-up"}
                        </span>
                    </div>

                    {/* PATIENT INFORMATION */}

                    <div className="patient-info-grid">
                        <div className="patient-info-item">
                            <span>Patient ID</span>

                            <strong>{patient.id}</strong>
                        </div>

                        <div className="patient-info-item">
                            <span>Full Name</span>

                            <strong>
                                {patient.first_name} {patient.last_name}
                            </strong>
                        </div>

                        <div className="patient-info-item">
                            <span>Age</span>

                            <strong>
                                {calculateAge(patient.date_of_birth)}
                            </strong>
                        </div>

                        <div className="patient-info-item">
                            <span>Gender</span>

                            <strong>{patient.gender}</strong>
                        </div>

                        <div className="patient-info-item">
                            <span>Date of Birth</span>

                            <strong>{patient.date_of_birth}</strong>
                        </div>

                        <div className="patient-info-item">
                            <span>Phone</span>

                            <strong>{patient.phone}</strong>
                        </div>

                        <div className="patient-info-item">
                            <span>Email</span>

                            <strong>{patient.email || "Not provided"}</strong>
                        </div>

                        <div className="patient-info-item">
                            <span>Address</span>

                            <strong>{patient.address || "Not provided"}</strong>
                        </div>

                        <div className="patient-info-item">
                            <span>Blood Group</span>

                            <strong>
                                {patient.blood_group || "Not provided"}
                            </strong>
                        </div>

                        <div className="patient-info-item">
                            <span>Emergency Contact</span>

                            <strong>
                                {patient.emergency_contact || "Not provided"}
                            </strong>
                        </div>

                        <div className="patient-info-item">
                            <span>Status</span>

                            <strong>{patient.status || "Check-up"}</strong>
                        </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="patient-details-actions">
                        <button
                            type="button"
                            className="back-btn"
                            onClick={() => navigate("/patients")}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            Back
                        </button>

                        <button
                            type="button"
                            className="edit-btn"
                            onClick={handleEdit}
                        >
                            <i className="fa-solid fa-pen"></i>
                            Edit Patient
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ========================================
   CALCULATE AGE
======================================== */

function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
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

export default PatientDetails;
