import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { getPatients, deletePatient } from "../api/patientApi";

import "./PatientList.css";

function PatientList() {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadPatients();
    }, []);

    async function loadPatients() {
        try {
            setLoading(true);
            setError("");

            const data = await getPatients();

            setPatients(data);
        } catch (error) {
            console.error(error);
            setError("Failed to load patients.");
        } finally {
            setLoading(false);
        }
    }

    function handleView(patientId) {
        navigate(`/patient-details/${patientId}`);
    }

    function handleEdit(patientId) {
        navigate(`/patients/edit/${patientId}`);
    }

    async function handleDelete(patientId) {
        const patient = patients.find((patient) => patient.id === patientId);

        if (!patient) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${patient.first_name} ${patient.last_name}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            await deletePatient(patientId);

            setPatients((currentPatients) =>
                currentPatients.filter((patient) => patient.id !== patientId),
            );
        } catch (error) {
            console.error(error);
            alert("Failed to delete patient.");
        }
    }

    /*
     * Search patients by:
     * - Patient ID (P001, P002, P003...)
     * - Patient name
     * - Phone number
     *
     * The search is case-insensitive.
     *
     * Example:
     * P00  → finds P001, P002, P003...
     * p00  → finds P001, P002, P003...
     * P001 → finds P001
     */
    const filteredPatients = patients.filter((patient) => {
        const searchValue = search.trim().toLowerCase();

        const patientId = String(patient.patient_code || "").toLowerCase();

        const fullName =
            `${patient.first_name} ${patient.last_name}`.toLowerCase();

        const phone = String(patient.phone || "").toLowerCase();

        const matchesSearch =
            patientId.includes(searchValue) ||
            fullName.includes(searchValue) ||
            phone.includes(searchValue);

        const matchesStatus =
            statusFilter === "All" || patient.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="patient-list-page">
            <Sidebar />

            <main className="patient-list-main">
                {/* PAGE HEADER */}
                <div className="patient-list-header">
                    <div>
                        <h1>Patients</h1>

                        <p>Manage all registered patients.</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/patients/add")}
                        className="patient-list-add-btn"
                    >
                        <i className="fa-solid fa-plus"></i>
                        Add Patient
                    </button>
                </div>

                {/* ERROR MESSAGE */}
                {error && <div className="patient-list-error">{error}</div>}

                {/* SEARCH AND FILTER */}
                <div className="patient-list-filters">
                    <input
                        type="text"
                        placeholder="Search by ID, name or phone..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                    >
                        <option value="All">All Status</option>

                        <option value="Check-up">Check-up</option>

                        <option value="Admitted">Admitted</option>

                        <option value="Discharged">Discharged</option>
                    </select>
                </div>

                {/* PATIENT TABLE */}
                <div className="patient-list-table-container">
                    {loading ? (
                        <p className="patient-list-empty">
                            Loading patients...
                        </p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Patient Name</th>
                                    <th>Gender</th>
                                    <th>Age</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredPatients.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="patient-list-empty"
                                        >
                                            No patients found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPatients.map((patient) => (
                                        <tr key={patient.id}>
                                            {/* PATIENT ID */}
                                            <td>{patient.patient_code}</td>

                                            {/* PATIENT NAME */}
                                            <td>
                                                {patient.first_name}{" "}
                                                {patient.last_name}
                                            </td>

                                            {/* GENDER */}
                                            <td>{patient.gender}</td>

                                            {/* AGE */}
                                            <td>
                                                {calculateAge(
                                                    patient.date_of_birth,
                                                )}
                                            </td>

                                            {/* PHONE */}
                                            <td>{patient.phone}</td>

                                            {/* STATUS */}
                                            <td>
                                                <span
                                                    className={`patient-status ${getStatusClass(
                                                        patient.status,
                                                    )}`}
                                                >
                                                    {patient.status ||
                                                        "Check-up"}
                                                </span>
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="patient-list-actions">
                                                {/* VIEW */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleView(patient.id)
                                                    }
                                                    className="patient-view-btn"
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                    View
                                                </button>

                                                {/* EDIT */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(patient.id)
                                                    }
                                                    className="patient-edit-btn"
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                    Edit
                                                </button>

                                                {/* DELETE */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(patient.id)
                                                    }
                                                    className="patient-delete-btn"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}

/*
 * Calculate patient's age from date of birth.
 */
function calculateAge(dateOfBirth) {
    if (!dateOfBirth) {
        return "-";
    }

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

/*
 * Return the CSS class for each patient status.
 */
function getStatusClass(status) {
    if (status === "Admitted") {
        return "status-admitted";
    }

    if (status === "Discharged") {
        return "status-discharged";
    }

    return "status-checkup";
}

export default PatientList;
