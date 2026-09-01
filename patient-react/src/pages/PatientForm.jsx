import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import "./PatientForm.css";

function PatientForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        status: "Check-up",
    });

    const [error, setError] = useState("");

    /* ========================================
       LOAD PATIENT FOR EDITING
    ======================================== */

    useEffect(() => {
        if (!isEditMode) {
            return;
        }

        const storedPatients =
            JSON.parse(localStorage.getItem("patients")) || [];

        const patient = storedPatients.find((patient) => patient.id === id);

        if (!patient) {
            setError("Patient not found.");
            return;
        }

        setFormData({
            name: patient.name || "",
            age: patient.age || "",
            gender: patient.gender ? patient.gender.toLowerCase() : "",
            phone: patient.phone || "",
            email: patient.email || "",
            address: patient.address || "",
            status: patient.status || "Check-up",
        });
    }, [id, isEditMode]);

    /* ========================================
       HANDLE INPUT
    ======================================== */

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    /* ========================================
       SAVE / UPDATE PATIENT
    ======================================== */

    function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (
            !formData.name.trim() ||
            !formData.age ||
            !formData.gender ||
            !formData.phone.trim()
        ) {
            setError("Please fill in all required fields.");

            return;
        }

        const storedPatients =
            JSON.parse(localStorage.getItem("patients")) || [];

        /* ====================================
           EDIT EXISTING PATIENT
        ==================================== */

        if (isEditMode) {
            const patientIndex = storedPatients.findIndex(
                (patient) => patient.id === id,
            );

            if (patientIndex === -1) {
                setError("Patient not found.");
                return;
            }

            const updatedPatient = {
                ...storedPatients[patientIndex],

                name: formData.name.trim(),

                age: Number(formData.age),

                gender: formData.gender === "male" ? "Male" : "Female",

                phone: formData.phone.trim(),

                email: formData.email.trim(),

                address: formData.address.trim(),

                status: formData.status,
            };

            storedPatients[patientIndex] = updatedPatient;

            localStorage.setItem("patients", JSON.stringify(storedPatients));

            navigate("/patients");

            return;
        }

        /* ====================================
           ADD NEW PATIENT
        ==================================== */

        let nextNumber = 1;

        if (storedPatients.length > 0) {
            const numbers = storedPatients.map((patient) =>
                parseInt(patient.id.replace("P", ""), 10),
            );

            nextNumber = Math.max(...numbers) + 1;
        }

        const newPatient = {
            id: `P${String(nextNumber).padStart(3, "0")}`,

            name: formData.name.trim(),

            age: Number(formData.age),

            gender: formData.gender === "male" ? "Male" : "Female",

            phone: formData.phone.trim(),

            email: formData.email.trim(),

            address: formData.address.trim(),

            status: formData.status,
        };

        storedPatients.push(newPatient);

        localStorage.setItem("patients", JSON.stringify(storedPatients));

        navigate("/patients");
    }

    /* ========================================
       CANCEL
    ======================================== */

    function handleCancel() {
        navigate("/patients");
    }

    /* ========================================
       PATIENT NOT FOUND
    ======================================== */

    if (isEditMode && error === "Patient not found.") {
        return (
            <div className="patient-form-page">
                <Sidebar />

                <main className="patient-form-main">
                    <div className="patient-form-card">
                        <h1>Patient Not Found</h1>

                        <p>
                            The patient you are trying to edit does not exist.
                        </p>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/patients")}
                        >
                            Back to Patients
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="patient-form-page">
            <Sidebar />

            <main className="patient-form-main">
                {/* ====================================
                    PAGE HEADER
                ==================================== */}

                <div className="patient-form-header">
                    <h1>{isEditMode ? "Edit Patient" : "Add Patient"}</h1>

                    <p>
                        {isEditMode
                            ? "Update the patient's information below."
                            : "Enter the patient's information below."}
                    </p>
                </div>

                {/* ====================================
                    FORM
                ==================================== */}

                <form className="patient-form-card" onSubmit={handleSubmit}>
                    {/* ERROR */}
                    {error && <div className="patient-form-error">{error}</div>}

                    {/* NAME */}
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter patient's full name"
                        />
                    </div>

                    {/* AGE */}
                    <div className="form-group">
                        <label htmlFor="age">Age</label>

                        <input
                            id="age"
                            name="age"
                            type="number"
                            min="1"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter patient's age"
                        />
                    </div>

                    {/* GENDER */}
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>

                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>

                            <option value="male">Male</option>

                            <option value="female">Female</option>
                        </select>
                    </div>

                    {/* PHONE */}
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                        />
                    </div>

                    {/* ADDRESS */}
                    <div className="form-group">
                        <label htmlFor="address">Address</label>

                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                        />
                    </div>

                    {/* STATUS */}
                    <div className="form-group">
                        <label htmlFor="status">Status</label>

                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Check-up">Check-up</option>

                            <option value="Admitted">Admitted</option>

                            <option value="Discharged">Discharged</option>
                        </select>
                    </div>

                    {/* BUTTONS */}
                    <div className="patient-form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="save-btn">
                            {isEditMode ? "Update Patient" : "Save Patient"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default PatientForm;
