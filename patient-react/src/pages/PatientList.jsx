import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import "./PatientList.css";

function PatientList() {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const storedPatients =
            JSON.parse(localStorage.getItem("patients")) || [];

        setPatients(storedPatients);
    }, []);

    function handleView(patientId) {
        navigate(`/patient-details/${patientId}`);
    }

    function handleEdit(patientId) {
        navigate(`/patients/edit/${patientId}`);
    }

    function handleDelete(patientId) {
        const patient = patients.find((patient) => patient.id === patientId);

        if (!patient) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${patient.name}?`,
        );

        if (!confirmed) {
            return;
        }

        const updatedPatients = patients.filter(
            (patient) => patient.id !== patientId,
        );

        setPatients(updatedPatients);

        localStorage.setItem("patients", JSON.stringify(updatedPatients));
    }

    const filteredPatients = patients.filter((patient) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            patient.id.toLowerCase().includes(searchValue) ||
            patient.name.toLowerCase().includes(searchValue) ||
            patient.phone.toLowerCase().includes(searchValue);

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
                                        <td>{patient.id}</td>

                                        <td>{patient.name}</td>

                                        <td>{patient.gender}</td>

                                        <td>{patient.age}</td>

                                        <td>{patient.phone}</td>

                                        <td>
                                            <span
                                                className={`patient-status ${getStatusClass(
                                                    patient.status,
                                                )}`}
                                            >
                                                {patient.status}
                                            </span>
                                        </td>

                                        <td className="patient-list-actions">
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
                </div>
            </main>
        </div>
    );
}

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
