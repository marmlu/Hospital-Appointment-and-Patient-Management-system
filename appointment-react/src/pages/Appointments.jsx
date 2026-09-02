import "../App.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout, { useLayout } from "../components/Layout";

function Appointments() {
    const { toggleSidebar, appointments, deleteAppointment } = useLayout();

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

    const departments = [
        "All Departments",
        "Neurology",
        "Orthopedics",
        "Dermatology",
        "Cardiology",
        "Pediatrics",
        "Ophthalmology",
    ];

    const doctors = [
        { id: "1", name: "Dr Abraham" },
        { id: "7", name: "Dr John" },
        { id: "4", name: "Dr Gemechis" },
        { id: "10", name: "Dr Lia" },
    ];

    const filteredAppointments = appointments.filter((appointment) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            appointment.id.toString().includes(search) ||
            appointment.patientId.toString().includes(search) ||
            appointment.doctorId.toString().includes(search) ||
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

    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this appointment?",
        );

        if (!confirmed) {
            return;
        }

        deleteAppointment(id);
    };

    return (
        <Layout>
            {/* ========================================
                        APPOINTMENTS HEADER
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
                        APPOINTMENTS CONTENT
                    ======================================== */}

            <section className="content">
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

                        <select
                            className="filter-select department-filter"
                            value={departmentFilter}
                            onChange={(e) =>
                                setDepartmentFilter(e.target.value)
                            }
                        >
                            {departments.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>

                        <select
                            className="filter-select doctor-filter"
                            value={doctorFilter}
                            onChange={(e) => setDoctorFilter(e.target.value)}
                        >
                            <option value="All Doctors">All Doctors</option>

                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>

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

                <table>
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Patient_ID</th>
                            <th>Doctor_ID</th>
                            <th>Department</th>
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
                        {filteredAppointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>{appointment.id}</td>
                                <td>{appointment.patientId}</td>
                                <td>{appointment.doctorId}</td>
                                <td>{appointment.department}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.reason}</td>
                                <td>{appointment.status}</td>
                                <td>{appointment.notes}</td>
                                <td>{appointment.type}</td>

                                <td className="actions">
                                    <Link
                                        to={`/appointment-details/${appointment.id}`}
                                        state={{ appointment }}
                                        className="view-btn"
                                        title="View"
                                    >
                                        <i className="fa-solid fa-eye"></i>
                                    </Link>

                                    <Link
                                        to={`/edit-appointment/${appointment.id}`}
                                        state={{ appointment }}
                                        className="edit-btn"
                                        title="Edit"
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </Link>

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
                        ))}
                    </tbody>
                </table>
            </section>
        </Layout>
    );
}

export default Appointments;
