import "../App.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
function Appointments() {
    const appointments = [
        {
            id: 3,
            patientId: 12,
            doctorId: 4,
            department: "Cardiology",
            date: "2027-10-05",
            time: "09:30 AM",
            reason: "Chest Pain",
            status: "Completed",
            notes: "Follow-up required after consultation.",
            type: "Walk-in",
        },
        {
            id: 4,
            patientId: 9,
            doctorId: 7,
            department: "Pediatrics",
            date: "2027-11-01",
            time: "11:00 AM",
            reason: "Fever",
            status: "Completed",
            notes: "First Appointment",
            type: "Follow-up",
        },
        {
            id: 5,
            patientId: 15,
            doctorId: 10,
            department: "Neurology",
            date: "2027-12-09",
            time: "02:00 PM",
            reason: "Migraine",
            status: "Pending",
            notes: "Patient requested morning appointment.",
            type: "Consultation",
        },
        {
            id: 6,
            patientId: 18,
            doctorId: 1,
            department: "Dermatology",
            date: "2027-02-13",
            time: "10:15 AM",
            reason: "Skin Rash",
            status: "Cancelled",
            notes: "Patient referred for further evaluation.",
            type: "Emergency",
        },
        {
            id: 7,
            patientId: 21,
            doctorId: 7,
            department: "Ophthalmology",
            date: "2027-08-14",
            time: "03:45 PM",
            reason: "Blurred Vision",
            status: "Cancelled",
            notes: "First Appointment",
            type: "Online",
        },
    ];
    const [appointmentList, setAppointmentList] = useState(appointments);
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

    const filteredAppointments = appointmentList.filter((appointment) => {
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

        setAppointmentList((currentAppointments) =>
            currentAppointments.filter((appointment) => appointment.id !== id),
        );
    };
    return (
        <Layout>
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

                    <button className="add-btn">+ New Appointment</button>
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
