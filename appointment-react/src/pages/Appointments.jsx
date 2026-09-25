import "../App.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout, { useLayout } from "../components/Layout";

const mapAppointment = (appointment) => {
    return {
        id: appointment.id,

        appointmentNumber: appointment.appointment_number || "N/A",

        // Keep numeric ID for API/filtering
        patientId: appointment.patient_id,

        // Keep the complete patient object for AppointmentDetails
        patient: appointment.patient,

        // Keep numeric ID for API/filtering
        doctorId: appointment.doctor_id,

        // Keep the complete doctor object for AppointmentDetails
        doctor: appointment.doctor,

        department: appointment.doctor?.department?.name || "Not available",

        date: appointment.appointment_date,

        time: appointment.appointment_time,

        reason: appointment.reason || "Not specified",

        status: appointment.status
            ? appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)
            : "Not specified",

        notes: appointment.notes || "",

        type: appointment.appointment_type || "Not specified",
    };
};

function Appointments() {
    const { toggleSidebar } = useLayout();

    const [appointments, setAppointments] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);

    /* ========================================
                FETCH APPOINTMENTS
    ======================================== */

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/appointments")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch appointments");
                }

                return response.json();
            })
            .then((data) => {
                const mappedAppointments = data.map(mapAppointment);

                setAppointments(mappedAppointments);
            })
            .catch((error) => {
                console.error("Error fetching appointments:", error);
            });
    }, []);

    /* ========================================
            FETCH DEPARTMENTS AND DOCTORS
    ======================================== */

    useEffect(() => {
        Promise.all([
            fetch("http://127.0.0.1:8000/api/departments"),
            fetch("http://127.0.0.1:8000/api/doctors"),
        ])
            .then(async ([departmentsResponse, doctorsResponse]) => {
                if (!departmentsResponse.ok) {
                    throw new Error("Failed to fetch departments");
                }

                if (!doctorsResponse.ok) {
                    throw new Error("Failed to fetch doctors");
                }

                const departmentsData = await departmentsResponse.json();

                const doctorsData = await doctorsResponse.json();

                setDepartments(departmentsData);
                setDoctors(doctorsData);
            })
            .catch((error) => {
                console.error("Error fetching departments/doctors:", error);
            });
    }, []);

    /* ========================================
                APPOINTMENT STATISTICS
    ======================================== */

    const appointmentStats = [
        {
            title: "Today's Appointments",
            count: 18,
            icon: "fa-calendar-check",
        },
        {
            title: "Pending",
            count: 6,
            icon: "fa-clock",
        },
        {
            title: "Completed",
            count: 4,
            icon: "fa-circle-check",
        },
        {
            title: "Cancelled",
            count: 8,
            icon: "fa-circle-xmark",
        },
    ];

    /* ========================================
                    FILTERS
    ======================================== */

    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] = useState("All Status");

    const [departmentFilter, setDepartmentFilter] = useState("All Departments");

    const [doctorFilter, setDoctorFilter] = useState("All Doctors");

    const [dateFilter, setDateFilter] = useState("");

    const statuses = [
        "All Status",
        "Pending",
        "Approved",
        "Completed",
        "Cancelled",
    ];

    /* ========================================
                FILTER APPOINTMENTS
    ======================================== */

    const filteredAppointments = appointments.filter((appointment) => {
        const search = searchTerm.toLowerCase();

        /*
         * Display IDs:
         * P001
         * D001
         */

        const patientDisplayId =
            appointment.patient?.patient_code ||
            `P${String(appointment.patientId).padStart(3, "0")}`;

        const doctorDisplayId = appointment.doctor
            ? `D${String(appointment.doctor.id).padStart(3, "0")}`
            : `D${String(appointment.doctorId).padStart(3, "0")}`;

        const matchesSearch =
            appointment.appointmentNumber.toLowerCase().includes(search) ||
            patientDisplayId.toLowerCase().includes(search) ||
            doctorDisplayId.toLowerCase().includes(search) ||
            appointment.department.toLowerCase().includes(search) ||
            appointment.reason.toLowerCase().includes(search) ||
            appointment.status.toLowerCase().includes(search) ||
            appointment.notes.toLowerCase().includes(search) ||
            appointment.type.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "All Status" ||
            appointment.status.toLowerCase() === statusFilter.toLowerCase();

        const matchesDepartment =
            departmentFilter === "All Departments" ||
            appointment.department === departmentFilter;

        /*
         * Compare the real numeric doctor ID.
         * The user only sees D001, D002, etc.
         */
        const matchesDoctor =
            doctorFilter === "All Doctors" ||
            appointment.doctorId.toString() === doctorFilter;

        const matchesDate =
            dateFilter === "" || appointment.date === dateFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesDepartment &&
            matchesDoctor &&
            matchesDate
        );
    });

    /* ========================================
                    DELETE
    ======================================== */

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this appointment?",
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/appointments/${id}`,
                {
                    method: "DELETE",
                },
            );

            if (!response.ok) {
                throw new Error("Failed to delete appointment");
            }

            setAppointments((currentAppointments) =>
                currentAppointments.filter(
                    (appointment) => appointment.id !== id,
                ),
            );

            alert("Appointment deleted successfully.");
        } catch (error) {
            console.error("Error deleting appointment:", error);

            alert("Failed to delete appointment.");
        }
    };

    return (
        <Layout>
            {/* ========================================
                        PAGE HEADER
                    ======================================== */}

            <header className="page-header">
                <div className="page-header-left">
                    <button
                        className="hamburger"
                        type="button"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                    <div>
                        <h1>Appointments</h1>

                        <p>Manage and track all hospital appointments.</p>
                    </div>
                </div>
            </header>

            {/* ========================================
                        CONTENT
                    ======================================== */}

            <section className="content">
                {/* ========================================
                        APPOINTMENT STATISTICS
                    ======================================== */}

                <div className="card-container">
                    {appointmentStats.map((stat, index) => (
                        <div
                            className={`card card-${index + 1}`}
                            key={stat.title}
                        >
                            <i className={`fa-regular ${stat.icon}`}></i>

                            <div>
                                <p>{stat.title}</p>

                                <h2>{stat.count}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ========================================
                        SEARCH AND FILTERS
                    ======================================== */}

                <div className="search-filter-container">
                    <div className="search-input-container">
                        <i className="fa-solid fa-magnifying-glass"></i>

                        <input
                            className="appointment-search-input"
                            type="text"
                            placeholder="Search appointments here"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-container">
                        {/* Status */}

                        <select
                            className="filter-select status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        {/* Department */}

                        <select
                            className="filter-select department-filter"
                            value={departmentFilter}
                            onChange={(e) =>
                                setDepartmentFilter(e.target.value)
                            }
                        >
                            <option value="All Departments">
                                All Departments
                            </option>

                            {departments.map((department) => (
                                <option
                                    key={department.id}
                                    value={department.name}
                                >
                                    {department.name}
                                </option>
                            ))}
                        </select>

                        {/* Doctor */}

                        <select
                            className="filter-select doctor-filter"
                            value={doctorFilter}
                            onChange={(e) => setDoctorFilter(e.target.value)}
                        >
                            <option value="All Doctors">All Doctors</option>

                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {`D${String(doctor.id).padStart(3, "0")}`}
                                </option>
                            ))}
                        </select>

                        {/* Date */}

                        <div className="date-filter">
                            <input
                                type="date"
                                id="appointment-date"
                                aria-label="Select date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    <Link to="/edit-appointment/new" className="add-btn">
                        + New Appointment
                    </Link>
                </div>

                {/* ========================================
                        APPOINTMENT TABLE
                    ======================================== */}

                <table>
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Patient ID</th>
                            <th>Doctor ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Notes</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAppointments.map((appointment) => {
                            const patientDisplayId =
                                appointment.patient?.patient_code ||
                                `P${String(appointment.patientId).padStart(
                                    3,
                                    "0",
                                )}`;

                            const doctorDisplayId = appointment.doctor
                                ? `D${String(appointment.doctor.id).padStart(
                                      3,
                                      "0",
                                  )}`
                                : `D${String(appointment.doctorId).padStart(
                                      3,
                                      "0",
                                  )}`;

                            return (
                                <tr key={appointment.id}>
                                    <td>{appointment.appointmentNumber}</td>

                                    {/* P001 */}

                                    <td>{patientDisplayId}</td>

                                    {/* D001 */}

                                    <td>{doctorDisplayId}</td>

                                    <td>{appointment.date}</td>

                                    <td>{appointment.time}</td>

                                    <td>{appointment.reason}</td>

                                    <td>{appointment.status}</td>

                                    <td>{appointment.notes}</td>

                                    <td>{appointment.type}</td>

                                    <td className="actions">
                                        {/* View */}

                                        <Link
                                            to={`/appointment-details/${appointment.id}`}
                                            state={{
                                                appointment,
                                            }}
                                            className="view-btn"
                                            title="View"
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                        </Link>

                                        {/* Edit */}

                                        <Link
                                            to={`/edit-appointment/${appointment.id}`}
                                            state={{
                                                appointment,
                                            }}
                                            className="edit-btn"
                                            title="Edit"
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>

                                        {/* Delete */}

                                        <button
                                            className="delete-btn"
                                            title="Delete"
                                            onClick={() =>
                                                handleDelete(appointment.id)
                                            }
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>
        </Layout>
    );
}

export default Appointments;
