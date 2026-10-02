import React, { useEffect, useState } from "react";
import {
    Building2,
    Users,
    Stethoscope,
    CalendarDays,
    Search,
    Pencil,
    Trash2,
} from "lucide-react";

import "./ModulePages.css";

const API_URL = "http://127.0.0.1:8000/api";

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // =========================
    // GET DEPARTMENTS
    // =========================
    const fetchDepartments = async () => {
        try {
            const response = await fetch(`${API_URL}/departments`);

            if (!response.ok) {
                throw new Error("Failed to fetch departments.");
            }

            const data = await response.json();

            setDepartments(data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    // =========================
    // OPEN ADD FORM
    // =========================
    const openAddForm = () => {
        setEditingDepartment(null);
        setName("");
        setDescription("");
        setShowForm(true);
    };

    // =========================
    // OPEN EDIT FORM
    // =========================
    const openEditForm = (department) => {
        setEditingDepartment(department);
        setName(department.name || "");
        setDescription(department.description || "");
        setShowForm(true);
    };

    // =========================
    // CLOSE FORM
    // =========================
    const closeForm = () => {
        setShowForm(false);
        setEditingDepartment(null);
        setName("");
        setDescription("");
    };

    // =========================
    // ADD / UPDATE DEPARTMENT
    // =========================
    const saveDepartment = async (e) => {
        e.preventDefault();

        if (name.trim() === "" || description.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const url = editingDepartment
                ? `${API_URL}/departments/${editingDepartment.id}`
                : `${API_URL}/departments`;

            const method = editingDepartment ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data);

                alert(data.message || "Something went wrong.");

                return;
            }

            alert(
                editingDepartment
                    ? "Department updated successfully."
                    : "Department added successfully.",
            );

            closeForm();

            fetchDepartments();
        } catch (error) {
            console.error("Error saving department:", error);

            alert("Could not connect to Laravel.");
        }
    };

    // =========================
    // DELETE DEPARTMENT
    // =========================
    const deleteDepartment = async (id) => {
        const department = departments.find((item) => item.id === id);

        if (!department) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${department.name}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/departments/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data);

                alert(data.message || "Could not delete department.");

                return;
            }

            alert("Department deleted successfully.");

            fetchDepartments();
        } catch (error) {
            console.error("Error deleting department:", error);

            alert("Could not connect to Laravel.");
        }
    };

    // =========================
    // SEARCH
    // =========================
    const filteredDepartments = departments.filter(
        (department) =>
            (department.name || "")
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            (department.description || "")
                .toLowerCase()
                .includes(search.toLowerCase()),
    );

    // =========================
    // STATISTICS
    // =========================
    const totalDepartments = departments.length;

    const totalDoctors = departments.reduce(
        (total, department) => total + Number(department.doctors || 0),
        0,
    );

    const totalPatients = departments.reduce(
        (total, department) => total + Number(department.patients || 0),
        0,
    );

    const totalAppointments = departments.reduce(
        (total, department) => total + Number(department.appointments || 0),
        0,
    );

    return (
        <div className="module-page">
            {/* =========================
                HEADER
            ========================= */}
            <div className="module-header">
                <div className="module-header-left">
                    <h1>Departments</h1>

                    <p>Hospital departments and service distribution</p>
                </div>

                <button className="primary-action" onClick={openAddForm}>
                    <Building2 size={16} />
                    Add Department
                </button>
            </div>

            {/* =========================
                STATISTICS
            ========================= */}
            <div className="module-stats">
                <div className="module-stat-card">
                    <div className="module-stat-icon orange">
                        <Building2 size={23} />
                    </div>

                    <div className="module-stat-content">
                        <span>Total Departments</span>

                        <strong>{totalDepartments}</strong>
                    </div>
                </div>

                <div className="module-stat-card">
                    <div className="module-stat-icon green">
                        <Stethoscope size={23} />
                    </div>

                    <div className="module-stat-content">
                        <span>Doctors</span>

                        <strong>{totalDoctors}</strong>
                    </div>
                </div>

                <div className="module-stat-card">
                    <div className="module-stat-icon">
                        <Users size={23} />
                    </div>

                    <div className="module-stat-content">
                        <span>Patients</span>

                        <strong>{totalPatients}</strong>
                    </div>
                </div>

                <div className="module-stat-card">
                    <div className="module-stat-icon purple">
                        <CalendarDays size={23} />
                    </div>

                    <div className="module-stat-content">
                        <span>Appointments</span>

                        <strong>{totalAppointments}</strong>
                    </div>
                </div>
            </div>

            {/* =========================
                DEPARTMENT CARD
            ========================= */}
            <div className="module-card">
                <div className="module-card-header">
                    <h2>Department Distribution</h2>
                </div>

                <div className="module-toolbar">
                    <div className="module-search">
                        <Search size={16} />

                        <input
                            type="text"
                            placeholder="Search departments..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ padding: "20px" }}>
                    <div className="department-grid">
                        {filteredDepartments.map((department) => {
                            const doctors = Number(department.doctors || 0);

                            const patients = Number(department.patients || 0);

                            const appointments = Number(
                                department.appointments || 0,
                            );

                            return (
                                <div
                                    className="department-card"
                                    key={department.id}
                                >
                                    {/* CARD TOP */}
                                    <div className="department-card-top">
                                        <div className="department-icon">
                                            <Building2 size={22} />
                                        </div>

                                        <div className="department-actions">
                                            <button
                                                type="button"
                                                className="edit-btn"
                                                onClick={() =>
                                                    openEditForm(department)
                                                }
                                                title="Edit department"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteDepartment(
                                                        department.id,
                                                    )
                                                }
                                                title="Delete department"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* NAME */}
                                    <h3>{department.name}</h3>

                                    {/* DESCRIPTION */}
                                    <p>{department.description}</p>

                                    {/* INFORMATION */}
                                    <div className="department-info">
                                        <div>
                                            <strong>{doctors}</strong>

                                            <span>Doctors</span>
                                        </div>

                                        <div>
                                            <strong>{patients}</strong>

                                            <span>Patients</span>
                                        </div>

                                        <div>
                                            <strong>{appointments}</strong>

                                            <span>Appointments</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredDepartments.length === 0 && (
                        <div className="no-results">No departments found.</div>
                    )}
                </div>
            </div>

            {/* =========================
                ADD / EDIT MODAL
            ========================= */}
            {showForm && (
                <div className="department-modal">
                    <div className="department-form">
                        <h2>
                            {editingDepartment
                                ? "Edit Department"
                                : "Add Department"}
                        </h2>

                        <form onSubmit={saveDepartment}>
                            <div className="form-group">
                                <label>Department Name</label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter department name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Enter department description"
                                    rows="4"
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>

                                <button type="submit" className="save-btn">
                                    {editingDepartment
                                        ? "Update Department"
                                        : "Add Department"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Departments;
