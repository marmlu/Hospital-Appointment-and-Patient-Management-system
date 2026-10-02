import React, { useMemo, useState } from "react";
import {
  Stethoscope,
  UserRoundPlus,
  Search,
  Eye,
} from "lucide-react";

import "./ModulePages.css";

const sampleDoctors = [
  {
    id: "DR-001",
    name: "Dr. Hana",
    specialty: "General Physician",
    department: "General Medicine",
    patients: 42,
    status: "Available",
  },
  {
    id: "DR-002",
    name: "Dr. Samuel",
    specialty: "Cardiologist",
    department: "Cardiology",
    patients: 35,
    status: "Available",
  },
  {
    id: "DR-003",
    name: "Dr. Meron",
    specialty: "Pediatrician",
    department: "Pediatrics",
    patients: 28,
    status: "Busy",
  },
  {
    id: "DR-004",
    name: "Dr. Dawit",
    specialty: "Orthopedic Surgeon",
    department: "Orthopedics",
    patients: 31,
    status: "Available",
  },
  {
    id: "DR-005",
    name: "Dr. Selam",
    specialty: "Gynecologist",
    department: "Gynecology",
    patients: 24,
    status: "Busy",
  },
];

function Doctors() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const filteredDoctors = useMemo(() => {
    return sampleDoctors.filter((doctor) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        doctor.name.toLowerCase().includes(searchText) ||
        doctor.specialty.toLowerCase().includes(searchText) ||
        doctor.id.toLowerCase().includes(searchText);

      const matchesDepartment =
        department === "All" ||
        doctor.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [search, department]);

  return (
    <div className="module-page">

      <div className="module-header">

        <div className="module-header-left">
          <h1>Doctors</h1>

          <p>
            Manage hospital doctors and medical staff
          </p>
        </div>

        <button className="primary-action">
          <UserRoundPlus size={16} />
          Add Doctor
        </button>

      </div>

      <div className="module-stats">

        <div className="module-stat-card">
          <div className="module-stat-icon green">
            <Stethoscope size={23} />
          </div>

          <div className="module-stat-content">
            <span>Total Doctors</span>
            <strong>85</strong>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-icon">
            <Stethoscope size={23} />
          </div>

          <div className="module-stat-content">
            <span>Available</span>
            <strong>62</strong>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-icon purple">
            <Stethoscope size={23} />
          </div>

          <div className="module-stat-content">
            <span>On Duty</span>
            <strong>18</strong>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-icon orange">
            <Stethoscope size={23} />
          </div>

          <div className="module-stat-content">
            <span>Departments</span>
            <strong>12</strong>
          </div>
        </div>

      </div>

      <div className="module-card">

        <div className="module-card-header">
          <h2>Medical Staff Directory</h2>
        </div>

        <div className="module-toolbar">

          <div className="module-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            className="module-filter"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
          >
            <option>All</option>
            <option>General Medicine</option>
            <option>Cardiology</option>
            <option>Pediatrics</option>
            <option>Orthopedics</option>
            <option>Gynecology</option>
          </select>

        </div>

        <div className="module-table-wrapper">

          <table className="module-table">

            <thead>
              <tr>
                <th>Doctor</th>
                <th>Doctor ID</th>
                <th>Specialty</th>
                <th>Department</th>
                <th>Patients</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredDoctors.map((doctor) => (

                <tr key={doctor.id}>

                  <td>
                    <div className="person-cell">

                      <div className="person-avatar">
                        {doctor.name.replace("Dr. ", "").charAt(0)}
                      </div>

                      <div className="person-details">
                        <strong>
                          {doctor.name}
                        </strong>

                        <span>
                          Medical Doctor
                        </span>
                      </div>

                    </div>
                  </td>

                  <td>{doctor.id}</td>

                  <td>{doctor.specialty}</td>

                  <td>{doctor.department}</td>

                  <td>{doctor.patients}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        doctor.status.toLowerCase()
                      }`}
                    >
                      {doctor.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="table-action"
                      title="View doctor"
                    >
                      <Eye size={15} />
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredDoctors.length === 0 && (
            <div className="no-results">
              No doctors found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Doctors;