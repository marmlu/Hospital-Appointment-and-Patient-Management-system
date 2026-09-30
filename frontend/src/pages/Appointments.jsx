import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Search,
  Eye,
} from "lucide-react";

import "./ModulePages.css";

const sampleAppointments = [
  {
    id: "AP-0001",
    patient: "Abebe Kebede",
    patientId: "PT-0001",
    doctor: "Dr. Hana",
    specialty: "General Physician",
    date: "08 Aug 2026",
    time: "10:30 AM",
    department: "General Medicine",
    status: "Confirmed",
  },
  {
    id: "AP-0002",
    patient: "Mekdes Alemu",
    patientId: "PT-0002",
    doctor: "Dr. Samuel",
    specialty: "Cardiologist",
    date: "09 Aug 2026",
    time: "02:00 PM",
    department: "Cardiology",
    status: "Pending",
  },
  {
    id: "AP-0003",
    patient: "Hana Tesfaye",
    patientId: "PT-0003",
    doctor: "Dr. Meron",
    specialty: "Pediatrician",
    date: "10 Aug 2026",
    time: "09:00 AM",
    department: "Pediatrics",
    status: "Confirmed",
  },
  {
    id: "AP-0004",
    patient: "Dawit Bekele",
    patientId: "PT-0004",
    doctor: "Dr. Dawit",
    specialty: "Orthopedic Surgeon",
    date: "11 Aug 2026",
    time: "11:30 AM",
    department: "Orthopedics",
    status: "Completed",
  },
  {
    id: "AP-0005",
    patient: "Selamawit Girma",
    patientId: "PT-0005",
    doctor: "Dr. Selam",
    specialty: "Gynecologist",
    date: "12 Aug 2026",
    time: "03:30 PM",
    department: "Gynecology",
    status: "Pending",
  },
];

function Appointments() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredAppointments = useMemo(() => {
    return sampleAppointments.filter((appointment) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        appointment.patient
          .toLowerCase()
          .includes(searchText) ||
        appointment.doctor
          .toLowerCase()
          .includes(searchText) ||
        appointment.id
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        status === "All" ||
        appointment.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="module-page">

      <div className="module-header">

        <div className="module-header-left">
          <h1>Appointments</h1>

          <p>
            Schedule and manage hospital appointments
          </p>
        </div>

        <button className="primary-action">
          <CalendarDays size={16} />
          New Appointment
        </button>

      </div>

      <div className="module-stats">

        <div className="module-stat-card">
          <div className="module-stat-icon">
            <CalendarDays size={23} />
          </div>

          <div className="module-stat-content">
            <span>Total Appointments</span>
            <strong>320</strong>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-icon green">
            <CalendarDays size={23} />
          </div>

          <div className="module-stat-content">
            <span>Confirmed</span>
            <strong>214</strong>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-icon orange">
            <Clock3 size={23} />
          </div>

          <div className="module-stat-content">
            <span>Pending</span>
            <strong>42</strong>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-icon purple">
            <CalendarDays size={23} />
          </div>

          <div className="module-stat-content">
            <span>Today</span>
            <strong>24</strong>
          </div>
        </div>

      </div>

      <div className="module-card">

        <div className="module-card-header">
          <h2>Appointment Schedule</h2>
        </div>

        <div className="module-toolbar">

          <div className="module-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            className="module-filter"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option>All</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>

        </div>

        <div className="module-table-wrapper">

          <table className="module-table">

            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredAppointments.map(
                (appointment) => (

                  <tr key={appointment.id}>

                    <td>
                      <div className="person-cell">

                        <div className="person-avatar">
                          {appointment.patient.charAt(0)}
                        </div>

                        <div className="person-details">
                          <strong>
                            {appointment.patient}
                          </strong>

                          <span>
                            PID: {appointment.patientId}
                          </span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <div className="person-details">
                        <strong>
                          {appointment.doctor}
                        </strong>

                        <span>
                          {appointment.specialty}
                        </span>
                      </div>
                    </td>

                    <td>{appointment.date}</td>

                    <td>{appointment.time}</td>

                    <td>
                      {appointment.department}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          appointment.status.toLowerCase()
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="table-action"
                        title="View appointment"
                      >
                        <Eye size={15} />
                      </button>
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          {filteredAppointments.length === 0 && (
            <div className="no-results">
              No appointments found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Appointments;