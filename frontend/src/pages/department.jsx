import { useEffect, useState } from "react";
import "./doctor_department.css";

import {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment as deleteDepartmentApi
} from "../api/departmentApi";

const API_URL = "http://127.0.0.1:8000/api/departments";

function DepartmentManagement() {

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

        const data = await getDepartments();

        setDepartments(data);

    } catch (error) {

        console.error(
            "Error fetching departments:",
            error
        );

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
        setName(department.name);
        setDescription(department.description);
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
    // SAVE DEPARTMENT
    // =========================

   const saveDepartment = async (e) => {

    e.preventDefault();

    if (
        name.trim() === "" ||
        description.trim() === ""
    ) {

        alert("Please fill in all fields.");

        return;
    }

    try {

        const departmentData = {
            name: name.trim(),
            description: description.trim()
        };

        if (editingDepartment) {

            await updateDepartment(
                editingDepartment.id,
                departmentData
            );

            alert(
                "Department updated successfully."
            );

        } else {

            await createDepartment(
                departmentData
            );

            alert(
                "Department added successfully."
            );
        }

        closeForm();

        await fetchDepartments();

    } catch (error) {

        console.error(
            "Error saving department:",
            error
        );

        alert(
            error.message ||
            "Could not connect to Laravel."
        );
    }
};

    // =========================
    // DELETE DEPARTMENT
    // =========================
const deleteDepartment = async (id) => {

    const department = departments.find(
        (item) => item.id === id
    );

    if (!department) {
        return;
    }

    const confirmed = window.confirm(
        `Are you sure you want to delete ${department.name}?`
    );

    if (!confirmed) {
        return;
    }

    try {

        await deleteDepartmentApi(id);

        alert(
            "Department deleted successfully."
        );

        await fetchDepartments();

    } catch (error) {

        console.error(
            "Error deleting department:",
            error
        );

        alert(
            error.message ||
            "Could not connect to Laravel."
        );
    }
};
    // =========================
    // SEARCH
    // =========================

    const filteredDepartments =
        departments.filter((department) =>

            department.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            department.description
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    // =========================
    // PAGE
    // =========================

    return (

        <main className="department-management">

            <section className="page-header">

                <div>

                    <h1>
                        Department Management
                    </h1>

                    <p>
                        Manage hospital departments and their information.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={openAddForm}
                >

                    <i className="fa-solid fa-plus"></i>

                    Add Department

                </button>

            </section>

            <section className="department-tools">

                <div className="search-box">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="search"
                        placeholder="Search departments..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

            </section>

            <section className="department-list">

                <div className="section-title">

                    <h2>
                        Departments
                    </h2>

                    <span>
                        Total Departments: {departments.length}
                    </span>

                </div>

                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>
                                    Department Name
                                </th>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredDepartments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        style={{
                                            textAlign: "center",
                                            padding: "30px"
                                        }}
                                    >

                                        No departments found.

                                    </td>

                                </tr>

                            ) : (

                                filteredDepartments.map(
                                    (department) => (

                                        <tr
                                            key={department.id}
                                        >

                                            <td>
                                                {department.id}
                                            </td>

                                            <td>
                                                {department.name}
                                            </td>

                                            <td>
                                                {department.description}
                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        openEditForm(
                                                            department
                                                        )
                                                    }
                                                >

                                                    <i className="fa-solid fa-pen"></i>

                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteDepartment(
                                                            department.id
                                                        )
                                                    }
                                                >

                                                    <i className="fa-solid fa-trash"></i>

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </section>

            {showForm && (

                <div className="department-modal">

                    <div className="department-form">

                        <div className="form-header">

                            <h2>

                                {editingDepartment
                                    ? "Edit Department"
                                    : "Add Department"}

                            </h2>

                            <button
                                type="button"
                                onClick={closeForm}
                            >
                                ×
                            </button>

                        </div>

                        <form onSubmit={saveDepartment}>

                            <label>
                                Department Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter department name"
                                required
                            />

                            <label>
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter department description"
                                rows="4"
                                required
                            ></textarea>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button type="submit">

                                    {editingDepartment
                                        ? "Update Department"
                                        : "Add Department"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </main>
    );
}

export default DepartmentManagement;