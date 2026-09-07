import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { createPatient, getPatient, updatePatient } from "../api/patientApi";

import "./PatientForm.css";

function PatientForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        date_of_birth: "",
        phone: "",
        email: "",
        address: "",
        blood_group: "",
        emergency_contact: "",
        status: "Check-up",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load patient data when editing
    useEffect(() => {
        if (!isEditMode) {
            return;
        }

        async function loadPatient() {
            try {
                setLoading(true);
                setError("");

                const patient = await getPatient(id);

                setFormData({
                    first_name: patient.first_name || "",
                    last_name: patient.last_name || "",
                    gender: patient.gender || "",
                    date_of_birth: patient.date_of_birth || "",
                    phone: patient.phone || "",
                    email: patient.email || "",
                    address: patient.address || "",
                    blood_group: patient.blood_group || "",
                    emergency_contact: patient.emergency_contact || "",
                    status: patient.status || "Check-up",
                });
            } catch (error) {
                console.error(error);
                setError("Failed to load patient.");
            } finally {
                setLoading(false);
            }
        }

        loadPatient();
    }, [id, isEditMode]);

    // Handle input changes
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            if (isEditMode) {
                await updatePatient(id, formData);
            } else {
                await createPatient(formData);
            }

            navigate("/patients");
        } catch (error) {
            console.error(error);
            setError(
                "Failed to save patient. Please check the information and try again.",
            );
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        navigate("/patients");
    }

    if (loading && isEditMode && !formData.first_name) {
        return <p>Loading patient...</p>;
    }

    return (
        <div className="patient-form-page">
            <Sidebar />
            <div className="patient-form-header">
                <h1>{isEditMode ? "Edit Patient" : "Add New Patient"}</h1>

                <p>
                    {isEditMode
                        ? "Update the patient's information."
                        : "Enter the patient's information below."}
                </p>
            </div>

            {error && <div className="form-error">{error}</div>}

            <form className="patient-form" onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="form-group">
                    <label htmlFor="first_name">First Name</label>

                    <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Last Name */}
                <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>

                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Gender */}
                <div className="form-group">
                    <label htmlFor="gender">Gender</label>

                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>

                        <option value="Male">Male</option>

                        <option value="Female">Female</option>
                    </select>
                </div>

                {/* Date of Birth */}
                <div className="form-group">
                    <label htmlFor="date_of_birth">Date of Birth</label>

                    <input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Phone */}
                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>

                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email">Email</label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Address */}
                <div className="form-group">
                    <label htmlFor="address">Address</label>

                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>

                {/* Blood Group */}
                <div className="form-group">
                    <label htmlFor="blood_group">Blood Group</label>

                    <select
                        id="blood_group"
                        name="blood_group"
                        value={formData.blood_group}
                        onChange={handleChange}
                    >
                        <option value="">Select Blood Group</option>

                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                {/* Emergency Contact */}
                <div className="form-group">
                    <label htmlFor="emergency_contact">Emergency Contact</label>

                    <input
                        id="emergency_contact"
                        name="emergency_contact"
                        type="tel"
                        value={formData.emergency_contact}
                        onChange={handleChange}
                    />
                </div>

                {/* Status */}
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

                {/* Buttons */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : isEditMode
                              ? "Update Patient"
                              : "Add Patient"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PatientForm;
