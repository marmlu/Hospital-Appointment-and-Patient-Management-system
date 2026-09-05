import { useState, useEffect } from "react";
import "./doctor_department.css";

const API_URL = "http://127.0.0.1:8000/api";

function DoctorManagement() {

    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [search, setSearch] = useState("");
    const [departmentSearch, setDepartmentSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        qualification: "",
        experience: "",
        phone: "",
        department: ""
    });

    // =========================
    // GET DOCTORS
    // =========================

    const fetchDoctors = async () => {

        try {

            const response = await fetch(
                `${API_URL}/doctors`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch doctors.");
            }

            const data = await response.json();

            const formattedDoctors = data.map((doctor) => ({

                id: doctor.id,

                user_id: doctor.user_id,

                department_id: doctor.department_id,

                name: doctor.user?.name || "Unknown Doctor",

                specialization: doctor.specialization || "",

                qualification: doctor.qualification || "",

                experience: doctor.experience ?? "",

                phone: doctor.phone || "",

                department:
                    doctor.department?.name || "No Department"

            }));

            setDoctors(formattedDoctors);

        } catch (error) {

            console.error(
                "Error fetching doctors:",
                error
            );
        }
    };

    // =========================
    // GET DEPARTMENTS
    // =========================

    const fetchDepartments = async () => {

        try {

            const response = await fetch(
                `${API_URL}/departments`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch departments."
                );
            }

            const data = await response.json();

            setDepartments(data);

        } catch (error) {

            console.error(
                "Error fetching departments:",
                error
            );
        }
    };

    useEffect(() => {

        fetchDoctors();
        fetchDepartments();

    }, []);

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    // =========================
    // OPEN ADD FORM
    // =========================

    const openAddForm = () => {

        setEditingId(null);

        setFormData({
            name: "",
            specialization: "",
            qualification: "",
            experience: "",
            phone: "",
            department: ""
        });

        setDepartmentSearch("");

        setShowForm(true);
    };

    // =========================
    // OPEN EDIT FORM
    // =========================

    const openEditForm = (doctor) => {

        setEditingId(doctor.id);

        setFormData({
            name: doctor.name,
            specialization: doctor.specialization,
            qualification: doctor.qualification,
            experience: doctor.experience,
            phone: doctor.phone,
            department: doctor.department
        });

        setDepartmentSearch(doctor.department);

        setShowForm(true);
    };

    // =========================
    // CANCEL
    // =========================

    const cancelForm = () => {

        setShowForm(false);
        setEditingId(null);
        setDepartmentSearch("");

        setFormData({
            name: "",
            specialization: "",
            qualification: "",
            experience: "",
            phone: "",
            department: ""
        });
    };

    // =========================
    // SELECT DEPARTMENT
    // =========================

    const selectDepartment = (department) => {

        setFormData((previousData) => ({
            ...previousData,
            department: department.name
        }));

        setDepartmentSearch(department.name);
    };

    // =========================
    // FILTER DEPARTMENTS
    // =========================

    const filteredDepartments =
        departments.filter((department) =>
            department.name
                .toLowerCase()
                .includes(
                    departmentSearch.toLowerCase()
                )
        );

    // =========================
    // ADD / UPDATE DOCTOR
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            formData.name.trim() === "" ||
            formData.specialization.trim() === "" ||
            formData.qualification.trim() === "" ||
            formData.experience === "" ||
            formData.phone.trim() === "" ||
            formData.department.trim() === ""
        ) {

            alert("Please fill in all fields.");

            return;
        }

        try {

            const selectedDepartment =
                departments.find(
                    (department) =>
                        department.name
                            .toLowerCase()
                            .trim() ===
                        formData.department
                            .toLowerCase()
                            .trim()
                );

            if (!selectedDepartment) {

                alert(
                    "Please select a valid department from the list."
                );

                return;
            }

            // =========================
            // ADD
            // =========================

            if (editingId === null) {

                const response = await fetch(
                    `${API_URL}/doctors`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name:
                                formData.name,

                            department_id:
                                selectedDepartment.id,

                            specialization:
                                formData.specialization,

                            qualification:
                                formData.qualification,

                            experience:
                                Number(
                                    formData.experience
                                ),

                            phone:
                                formData.phone,

                            working_days:
                                "Monday-Friday",

                            start_time:
                                "08:00",

                            end_time:
                                "16:00"
                        })
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    console.error(data);

                    alert(
                        data.message ||
                        "Failed to add doctor."
                    );

                    return;
                }

                alert(
                    "Doctor added successfully."
                );
            }

            // =========================
            // UPDATE
            // =========================

            else {

                const doctor =
                    doctors.find(
                        (item) =>
                            item.id === editingId
                    );

                if (!doctor) {

                    alert("Doctor not found.");

                    return;
                }

                const response = await fetch(
                    `${API_URL}/doctors/${editingId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name:
                                formData.name,

                            user_id:
                                doctor.user_id,

                            department_id:
                                selectedDepartment.id,

                            specialization:
                                formData.specialization,

                            qualification:
                                formData.qualification,

                            experience:
                                Number(
                                    formData.experience
                                ),

                            phone:
                                formData.phone,

                            working_days:
                                "Monday-Friday",

                            start_time:
                                "08:00",

                            end_time:
                                "16:00"
                        })
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    console.error(data);

                    alert(
                        data.message ||
                        "Failed to update doctor."
                    );

                    return;
                }

                alert(
                    "Doctor updated successfully."
                );
            }

            await fetchDoctors();

            cancelForm();

        } catch (error) {

            console.error(
                "Error saving doctor:",
                error
            );

            alert(
                "Could not connect to the Laravel server."
            );
        }
    };

    // =========================
    // DELETE
    // =========================

    const deleteDoctor = async (id) => {

        const doctor =
            doctors.find(
                (item) => item.id === id
            );

        if (!doctor) {
            return;
        }

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${doctor.name}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/doctors/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                console.error(data);

                alert(
                    data.message ||
                    "Failed to delete doctor."
                );

                return;
            }

            alert(
                "Doctor deleted successfully."
            );

            await fetchDoctors();

        } catch (error) {

            console.error(
                "Error deleting doctor:",
                error
            );

            alert(
                "Could not connect to the Laravel server."
            );
        }
    };

    // =========================
    // SEARCH DOCTORS
    // =========================

    const filteredDoctors =
        doctors.filter((doctor) =>

            doctor.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            doctor.specialization
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            doctor.department
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    // =========================
    // PAGE
    // =========================

    return (

        <main className="doctor-management">

            <section className="page-header">

                <div>

                    <h1>
                        Doctor Management
                    </h1>

                    <p>
                        Manage doctors and their professional information.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={openAddForm}
                >

                    <i className="fa-solid fa-plus"></i>

                    Add Doctor

                </button>

            </section>

            {showForm && (

                <div className="doctor-modal">

                    <section className="doctor-form">

                        <div className="form-header">

                            <div>

                                <h2>

                                    {editingId !== null
                                        ? "Edit Doctor"
                                        : "Add Doctor"}

                                </h2>

                                <p>

                                    {editingId !== null
                                        ? "Update the doctor's professional information."
                                        : "Enter the doctor's professional information."}

                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={cancelForm}
                                className="modal-close"
                            >
                                ×
                            </button>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Doctor Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter doctor name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Specialization
                                    </label>

                                    <input
                                        type="text"
                                        name="specialization"
                                        placeholder="e.g. Cardiology"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Qualification
                                    </label>

                                    <input
                                        type="text"
                                        name="qualification"
                                        placeholder="e.g. MD, MBBS"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Experience
                                    </label>

                                    <input
                                        type="number"
                                        name="experience"
                                        placeholder="Years of experience"
                                        min="0"
                                        value={formData.experience}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Department
                                    </label>

                                    <input
                                        type="text"
                                        name="department"
                                        placeholder="Search department..."
                                        value={departmentSearch}
                                        onChange={(e) => {

                                            const value =
                                                e.target.value;

                                            setDepartmentSearch(value);

                                            setFormData(
                                                (previousData) => ({
                                                    ...previousData,
                                                    department: value
                                                })
                                            );
                                        }}
                                    />

                                    {departmentSearch.trim() !== "" &&
                                        filteredDepartments.length > 0 && (

                                            <div className="department-options">

                                                {filteredDepartments.map(
                                                    (department) => (

                                                        <div
                                                            key={department.id}
                                                            onClick={() =>
                                                                selectDepartment(
                                                                    department
                                                                )
                                                            }
                                                        >

                                                            {department.name}

                                                        </div>

                                                    )
                                                )}

                                            </div>
                                        )}

                                    {departmentSearch.trim() !== "" &&
                                        filteredDepartments.length === 0 && (

                                            <div className="no-department">
                                                No department found.
                                            </div>
                                        )}

                                </div>

                            </div>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    onClick={cancelForm}
                                >
                                    Cancel
                                </button>

                                <button type="submit">

                                    <i
                                        className={
                                            editingId !== null
                                                ? "fa-solid fa-pen"
                                                : "fa-solid fa-plus"
                                        }
                                    ></i>

                                    {editingId !== null
                                        ? "Update Doctor"
                                        : "Add Doctor"}

                                </button>

                            </div>

                        </form>

                    </section>

                </div>
            )}

            <section className="doctor-tools">

                <div className="search-box">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="search"
                        placeholder="Search doctors..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

            </section>

            <section className="doctor-list">

                <div className="section-title">

                    <h2>
                        Doctors
                    </h2>

                    <span>
                        Total Doctors: {doctors.length}
                    </span>

                </div>

                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>Doctor</th>
                                <th>Specialization</th>
                                <th>Qualification</th>
                                <th>Experience</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredDoctors.length > 0 ? (

                                filteredDoctors.map(
                                    (doctor) => (

                                        <tr key={doctor.id}>

                                            <td>

                                                <div className="doctor-name">

                                                    <div className="doctor-icon">

                                                        <i className="fa-solid fa-user-doctor"></i>

                                                    </div>

                                                    <span>
                                                        {doctor.name}
                                                    </span>

                                                </div>

                                            </td>

                                            <td>
                                                {doctor.specialization}
                                            </td>

                                            <td>
                                                {doctor.qualification}
                                            </td>

                                            <td>
                                                {doctor.experience} Years
                                            </td>

                                            <td>
                                                {doctor.phone}
                                            </td>

                                            <td>
                                                {doctor.department}
                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        openEditForm(
                                                            doctor
                                                        )
                                                    }
                                                >

                                                    <i className="fa-solid fa-pen"></i>

                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteDoctor(
                                                            doctor.id
                                                        )
                                                    }
                                                >

                                                    <i className="fa-solid fa-trash"></i>

                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        style={{
                                            textAlign: "center",
                                            padding: "25px",
                                            color: "#64748b"
                                        }}
                                    >

                                        No doctors found.

                                    </td>

                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        </main>
    );
}

export default DoctorManagement;